#!/usr/bin/env python3
import os
import logging
import sys
import subprocess
import re
import decky_plugin
from decky_plugin import DECKY_PLUGIN_DIR

# Set up logging
logging.basicConfig(level=logging.DEBUG)

def camel_to_title(s):
    # Split the string into words using a regular expression
    words = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)', s)
    # Convert the first character of each word to uppercase and join the words with spaces
    return ' '.join(word.capitalize() for word in words)

class Plugin:
    # A normal method. It can be called from JavaScript using call_plugin_function("method_1", argument1, argument2)
    async def add(self, left, right):
        return left + right

    # Asyncio-compatible long-running code, executed in a task when the plugin is loaded
    async def _main(self):
        decky_plugin.logger.info("Hello World!")

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        # Here's a migration example for logs:
        # - `~/.config/decky-template/template.log` will be migrated to `decky_plugin.DECKY_PLUGIN_LOG_DIR/template.log`
        decky_plugin.migrate_logs(os.path.join(decky_plugin.DECKY_USER_HOME,
                                               ".config", "decky-template", "template.log"))
        # Here's a migration example for settings:
        # - `~/homebrew/settings/template.json` is migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/template.json`
        # - `~/.config/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_SETTINGS_DIR/`
        decky_plugin.migrate_settings(
            os.path.join(decky_plugin.DECKY_HOME, "settings", "template.json"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".config", "decky-template"))
        # Here's a migration example for runtime data:
        # - `~/homebrew/template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        # - `~/.local/share/decky-template/` all files and directories under this root are migrated to `decky_plugin.DECKY_PLUGIN_RUNTIME_DIR/`
        decky_plugin.migrate_runtime(
            os.path.join(decky_plugin.DECKY_HOME, "template"),
            os.path.join(decky_plugin.DECKY_USER_HOME, ".local", "share", "decky-template"))

    async def install(self, selected_options, custom_websites, separate_app_ids):
        decky_plugin.logger.info('install was called')

        # Convert the selected options mapping to a list of strings
        selected_options_list = []
        for option, is_selected in selected_options.items():
            if is_selected:
                if option in ['xboxGamePass', 'geforceNow', 'amazonLuna', 'netflix', 'hulu', 'disneyPlus', 'amazonPrimeVideo', 'youtube']:
                    # Streaming site or game service option
                    selected_option = camel_to_title(option).replace('Geforce', 'GeForce').replace('Disney Plus', 'Disney+')  # Change this line to replace 'Geforce' with 'GeForce'
                    if ' ' in selected_option:
                        selected_option = f'"{selected_option}"'
                    selected_options_list.append(selected_option)
                else:
                    # Launcher option
                    selected_option = camel_to_title(option)
                    if ' ' in selected_option:
                        selected_option = f'"{selected_option}"'
                    selected_options_list.append(selected_option)

        # Log the selected_options_list for debugging
        decky_plugin.logger.info(f"selected_options_list: {selected_options_list}")

        # Set the path to the NonSteamLaunchers.sh script
        script_path = os.path.join(DECKY_PLUGIN_DIR, 'NonSteamLaunchers.sh')

        # Change the permissions of the NonSteamLaunchers.sh script to make it executable
        os.chmod(script_path, 0o755)

        # Run the NonSteamLaunchers.sh script with the selected options, custom websites, and separate app ids option using subprocess.Popen
        command = [script_path] + [option for option in selected_options_list] + [website for website in custom_websites if website and website.strip() != ''] + (['Separate App IDs'] if separate_app_ids else [])
        
        # Log the command for debugging
        decky_plugin.logger.info(f"Running command: {command}")

        process = subprocess.Popen(command)

        # Wait for the script to complete and get the exit code
        exit_code = process.wait()

        # Log the exit code for debugging
        decky_plugin.logger.info(f"Command exit code: {exit_code}")

        if exit_code == 0:
            return True
        else:
            return False
