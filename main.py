def get_plugin_dir():
    from pathlib import Path
    return Path(__file__).parent.resolve()

def add_plugin_to_path():
    import sys
    plugin_dir = get_plugin_dir()
    decky_plugin.logger.info(f"{plugin_dir}")
    directories = [["./"], ["py_modules"], ["py_modules", "lib"], ["py_modules", "externals"]]
    for dir in directories:
        sys.path.append(str(plugin_dir.joinpath(*dir)))

import decky_plugin
add_plugin_to_path()

import os
import logging
import re
import asyncio
import subprocess
from aiohttp import web
from decky_plugin import DECKY_PLUGIN_DIR, DECKY_USER_HOME
from py_modules.lib.scanner import scan, addCustomSite
from settings import SettingsManager
from subprocess import Popen, run 

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def camel_to_title(s):
    # Split the string into words using a regular expression
    words = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)', s)
    # Convert the first character of each word to uppercase and join the words with spaces
    return ' '.join(word.capitalize() for word in words)

class Plugin:
    async def _main(self):
        decky_plugin.logger.info("This is _main being called")
        self.settings = SettingsManager(name="config", settings_directory=decky_plugin.DECKY_PLUGIN_SETTINGS_DIR)
        decky_user_home = decky_plugin.DECKY_USER_HOME
        defaultSettings = {"autoscan": True, "customSites": ""}

        async def run_backup(decky_user_home):
            decky_plugin.logger.info("Running Game Save backup...")
            process = await asyncio.create_subprocess_exec(
                "flatpak", "run", "com.github.mtkennerly.ludusavi", "--config", f"{decky_user_home}/.var/app/com.github.mtkennerly.ludusavi/config/ludusavi/NSLconfig/", "backup", "--force",
                stdout=asyncio.subprocess.DEVNULL,
                stderr=asyncio.subprocess.STDOUT
            )
            await process.wait()
            decky_plugin.logger.info("Backup completed")

        async def handleAutoScan(request):
            await asyncio.sleep(5)
            ws = web.WebSocketResponse()
            await ws.prepare(request)
            decky_plugin.logger.info(f"AutoScan: {self.settings.getSetting('settings', defaultSettings)['autoscan']}")
            try:
                while self.settings.getSetting('settings', defaultSettings)['autoscan']:
                    decky_shortcuts = scan()
                    if not decky_shortcuts:
                        decky_plugin.logger.info(f"No shortcuts to send")
                    else:
                        new_shortcuts = False
                        for game in decky_shortcuts.values():
                            if game.get('appname') is None or game.get('exe') is None:
                                continue
                            if ws.closed:
                                decky_plugin.logger.info("WebSocket connection closed")
                                break
                            decky_plugin.logger.info(f"Sending game data to client")
                            await ws.send_json(game)
                            new_shortcuts = True

                        if not new_shortcuts:
                            decky_plugin.logger.info("No new shortcuts found. Skipping backup.")
                        else:
                            decky_plugin.logger.info("Running Auto Scan Game Save backup...")
                            # Run the Ludusavi backup command
                            process = await asyncio.create_subprocess_exec(
                                "flatpak", "run", "com.github.mtkennerly.ludusavi", "--config", f"{decky_user_home}/.var/app/com.github.mtkennerly.ludusavi/config/ludusavi/NSLconfig/", "backup", "--force",
                                stdout=asyncio.subprocess.DEVNULL,
                                stderr=asyncio.subprocess.STDOUT
                            )

                            # Wait for the process to complete
                            await process.wait()
                            decky_plugin.logger.info("Backup Auto Scan Game Save completed")

                    await asyncio.sleep(5)  # Increase the sleep interval to reduce scan frequency

                decky_plugin.logger.info("Exiting AutoScan loop")

            except Exception as e:
                decky_plugin.logger.error(f"Error during AutoScan: {e}")

            finally:
                await ws.close()

            return ws

        async def handleScan(request):
            ws = web.WebSocketResponse()
            await ws.prepare(request)
            decky_plugin.logger.info(f"Called Manual Scan")
            try:
                decky_shortcuts = scan()
                if not decky_shortcuts:
                    decky_plugin.logger.info(f"No shortcuts to send")
                else:
                    for game in decky_shortcuts.values():
                        if game.get('appname') is None or game.get('exe') is None:
                            continue
                        decky_plugin.logger.info(f"Sending game data to client")
                        # Send the game data to the client
                        await ws.send_json(game)

                decky_plugin.logger.info("Running Manual Scan Game Save backup...")
                # Run the Ludusavi backup command
                process = await asyncio.create_subprocess_exec(
                    "flatpak", "run", "com.github.mtkennerly.ludusavi", "--config", f"{decky_user_home}/.var/app/com.github.mtkennerly.ludusavi/config/ludusavi/NSLconfig/", "backup", "--force",
                    stdout=asyncio.subprocess.DEVNULL,
                    stderr=asyncio.subprocess.STDOUT
                )

                # Wait for the process to complete
                await process.wait()
                decky_plugin.logger.info("Backup Manual Scan Game Save completed")

            except Exception as e:
                decky_plugin.logger.error(f"Error during Manual Scan: {e}")

            finally:
                await ws.close()

            return ws

        async def handleCustomSite(request):
            ws = web.WebSocketResponse()
            await ws.prepare(request)
            decky_plugin.logger.info(f"Called Custom Site")
            async for msg in ws:
                decky_plugin.logger.info(msg.data)
                decky_shortcuts = addCustomSite(msg.data)
                if not decky_shortcuts:
                    decky_plugin.logger.info(f"No shortcuts")
                    await ws.send_str("NoShortcuts")
                else:
                    for game in decky_shortcuts.values():
                        if game.get('appname') is None or game.get('exe') is None:
                            continue
                        if ws.closed:
                            decky_plugin.logger.info("WebSocket connection closed")
                            break
                        decky_plugin.logger.info(f"Sending game data to client")
                        try:
                            await ws.send_json(game)
                        except Exception as e:
                            decky_plugin.logger.error(f"Error sending game data: {e}")
                            break
            return ws

        async def handleLogUpdates(request):
            ws = web.WebSocketResponse()
            await ws.prepare(request)
            log_file_path = os.path.join(decky_user_home, 'Downloads', 'NonSteamLaunchers-install.log')

            def start_tail_process():
                return subprocess.Popen(['tail', '-n', '+1', '-f', log_file_path], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

            process = start_tail_process()
            buffer = []

            try:
                while True:
                    if not os.path.exists(log_file_path):
                        process.terminate()
                        await asyncio.sleep(0.1)
                        process = start_tail_process()

                    line = await asyncio.get_event_loop().run_in_executor(None, process.stdout.readline)
                    if not line:
                        if buffer:
                            await ws.send_str('\n'.join(buffer))
                            buffer = []
                        await asyncio.sleep(0.1)
                        continue
                    line = line.decode('utf-8').strip()
                    buffer.append(line)
                    if len(buffer) >= 5:
                        if ws.closed:
                            decky_plugin.logger.info("WebSocket connection closed")
                            break
                        try:
                            await ws.send_str('\n'.join(buffer))
                        except Exception as e:
                            decky_plugin.logger.error(f"Error sending log data: {e}")
                            break
                        buffer = []
            except Exception as e:
                decky_plugin.logger.error(f"Error in handleLogUpdates: {e}")
            finally:
                process.terminate()
                await ws.close()

            return ws

        app = web.Application()
        app.router.add_get('/autoscan', handleAutoScan)
        app.router.add_get('/scan', handleScan)
        app.router.add_get('/customSite', handleCustomSite)
        app.router.add_get('/logUpdates', handleLogUpdates)

        runner = web.AppRunner(app)
        await runner.setup()
        decky_plugin.logger.info("Server runner setup")
        site = web.TCPSite(runner, 'localhost', 8675)
        await site.start()
        decky_plugin.logger.info("Server started at http://localhost:8675")


    async def _migration(self):

        decky_plugin.logger.info("Starting migration process")

        # Get the path to the Decky user's home directory
        decky_user_home = decky_plugin.DECKY_USER_HOME

        # Define the paths for the service file, symlink, and NSLGameScanner.py
        service_file = os.path.join(decky_user_home, '.config/systemd/user/nslgamescanner.service')
        symlink = os.path.join(decky_user_home, '.config/systemd/user/default.target.wants/nslgamescanner.service')
        nslgamescanner_py = os.path.join(decky_user_home, '.config/systemd/user/NSLGameScanner.py')

        # Flags to check if any action was taken
        service_file_deleted = False
        symlink_removed = False
        nslgamescanner_py_deleted = False

        # Delete the service file
        if os.path.exists(service_file):
            os.remove(service_file)
            service_file_deleted = True
            decky_plugin.logger.info(f"Deleted service file: {service_file}")
        else:
            decky_plugin.logger.info(f"Service file not found: {service_file}")

        # Remove the symlink
        if os.path.islink(symlink):
            os.unlink(symlink)
            symlink_removed = True
            decky_plugin.logger.info(f"Removed symlink: {symlink}")
        else:
            decky_plugin.logger.info(f"Symlink not found: {symlink}")

        # Delete the NSLGameScanner.py file
        if os.path.exists(nslgamescanner_py):
            os.remove(nslgamescanner_py)
            nslgamescanner_py_deleted = True
            decky_plugin.logger.info(f"Deleted NSLGameScanner.py: {nslgamescanner_py}")
        else:
            decky_plugin.logger.info(f"NSLGameScanner.py not found: {nslgamescanner_py}")

        # Reload the systemd daemon only if any action was taken
        if service_file_deleted or symlink_removed or nslgamescanner_py_deleted:
            subprocess.run(['systemctl', '--user', 'daemon-reload'])
            decky_plugin.logger.info("Reloaded systemd daemon")
        else:
            decky_plugin.logger.info("No changes made, skipping daemon reload")


        decky_plugin.logger.info("Running Migration Game Save backup...")
        # Run the Ludusavi backup command
        process = subprocess.Popen(
            ["flatpak", "run", "com.github.mtkennerly.ludusavi", "--config", f"{decky_user_home}/.var/app/com.github.mtkennerly.ludusavi/config/ludusavi/NSLconfig/", "backup", "--force"],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.STDOUT
        )
        # Wait for the process to complete
        process.wait()
        decky_plugin.logger.info("Backup Migration Game Save Scan completed")


        
    async def _unload(self):
        decky_plugin.logger.info("Plugin Unloaded!")
        pass

    async def set_setting(self, key, value):
        self.settings.setSetting(key, value)

    async def get_setting(self, key, default):
        return self.settings.getSetting(key, default)
        
    async def install(self, selected_options, install_chrome, separate_app_ids, start_fresh, operation="Install"):
        decky_plugin.logger.info('install was called')

        # Log the arguments for debugging
        decky_plugin.logger.info(f"selected_options: {selected_options}")
        decky_plugin.logger.info(f"separate_app_ids: {separate_app_ids}")
        decky_plugin.logger.info(f"start_fresh: {start_fresh}")
        decky_plugin.logger.info(f"install_chrome: {install_chrome}")

        # Convert the selected options mapping to a list of strings
        selected_option_nice = ""
        if selected_options in ['fortnite', 'xboxGamePass', 'geforceNow', 'amazonLuna', 'movieweb', 'netflix', 'hulu', 'disneyPlus', 'amazonPrimeVideo', 'youtube', 'twitch']:
            # Streaming site or game service option
            selected_option_nice = camel_to_title(selected_options).replace('Geforce', 'GeForce').replace('Disney Plus', 'Disney+').replace('movieweb', 'movie-web')
        elif selected_options != 'separateAppIds':
            # Launcher option (excluding the Separate App IDs option)
            selected_option_nice = camel_to_title(selected_options).replace('Ea App', 'EA App').replace('Uplay', 'Ubisoft Connect').replace('Gog Galaxy', 'GOG Galaxy').replace('Battle Net', 'Battle.net').replace('Itch Io', 'itch.io').replace('Humble Games', 'Humble Games Collection').replace('Indie Gala', 'IndieGala').replace('Rockstar', 'Rockstar Games Launcher').replace('Hoyo Play', 'HoYoPlay').replace('Glyph', 'Glyph Launcher').replace('Ps Plus', 'Playstation Plus').replace('DMM', 'DMM Games').replace('Remote Play Whatever', 'RemotePlayWhatever')

        # Log the selected_options_list
        decky_plugin.logger.info(f"selected_option_nice: {selected_option_nice}")

        # Make the script executable
        script_path = os.path.join(DECKY_PLUGIN_DIR, 'NonSteamLaunchers.sh')

        os.chmod(script_path, 0o755)

        # Temporarily disable access control for the X server
        run(['xhost', '+'])

        # Construct the command to run
        command_suffix = ' '.join(([f'"{operation if operation == "Uninstall" else ""} {selected_option_nice}"'] if selected_option_nice != '' else []) + ([f'"Chrome"'] if install_chrome else []) + ([f'"SEPARATE APP IDS - CHECK THIS TO SEPARATE YOUR PREFIX"'] if separate_app_ids else []) + ([f'"Start Fresh"'] if start_fresh else []) + [f'"DeckyPlugin"'])

        # Construct the command to run
        command = f"{script_path} {command_suffix}"

        # Log the command for debugging
        decky_plugin.logger.info(f"Running command: {command}")

        # Set up the environment for the new process
        env = os.environ.copy()
        env['DISPLAY'] = ':0'
        env['XAUTHORITY'] = os.path.join(os.environ['HOME'], '.Xauthority')

        # Temporarily disable access control for the X server
        run(['xhost', '+'])

        # Run the command in a new xterm window
        xterm_command = f"xterm -e {command}"
        process = Popen(xterm_command, shell=True, env=env)

        # Wait for the script to complete and get the exit code
        exit_code = process.wait()

        # Re-enable access control for the X server
        run(['xhost', '-'])

        # Log the exit code for debugging
        decky_plugin.logger.info(f"Command exit code: {exit_code}")

        if exit_code == 0:
            return True
        else:
            return False