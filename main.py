import os
import logging
import sys
import subprocess
import re
except ImportError:
    pass

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

    async def _main(self):
        decky_plugin.logger.info('main was called')

    # Function called first during the unload process, utilize this to handle your plugin being removed
    async def _unload(self):
        decky_plugin.logger.info("Goodbye World!")
        print("Goodbye World!")
        pass

    # Migrations that should be performed before entering `_main()`.
    async def _migration(self):
        decky_plugin.logger.info("Migrating")
        print("Migrating")
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

    async def install(self, selected_options):
        # Set up logging
        logging.basicConfig(level=logging.DEBUG)

        # Set the path to the runnsl.py script
        script_path = os.path.join('runnsl.py')

        # Change the permissions of the runnsl.py script to make it executable
        os.chmod(script_path, 0o755)

        # Log the script_path for debugging
        logging.debug(f"script_path: {script_path}")
        print(f"script_path: {script_path}")

        # Convert the selected options mapping to a list of strings
        selected_options_list = []
        for option, is_selected in selected_options.items():
            if is_selected:
                selected_option = camel_to_title(option)
                if ' ' in selected_option:
                    selected_option = f'"{selected_option}"'
                selected_options_list.append(selected_option)

        # Log the selected_options_list for debugging
        logging.debug(f"selected_options_list: {selected_options_list}")
        print(f"selected_options_list: {selected_options_list}")

        # Run the runnsl.py script with the selected options using subprocess.run()
        command = [sys.executable, script_path] + selected_options_list
        logging.debug(f"Running command: {command}")
        print(f"Running command: {command}")

        result = subprocess.run(command)

        exit_code = result.returncode

        logging.debug(f"Command exit code: {exit_code}")

        if exit_code == 0:
            return f"runnsl.py ran successfully with options: {selected_options_list}"
        else:
            return f"runnsl.py failed to run successfully with options: {selected_options_list}"

if __name__ == "__main__":
    plugin = Plugin()
    selected_options = {"epicGames": True}
    result = asyncio.run(plugin.install(selected_options))
    print(result)
