import os
import logging
import sys
import subprocess
import re
import asyncio
import decky_plugin




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
        print("Hello World!")

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

        # Set the path to the executethescript.py script
        script_path = './backend/src/runnsl.py'

        # Change the permissions of the executethescript.py script to make it executable
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

        # Run the executethescript.py script with the selected options
        command = f"{script_path} {' '.join(selected_options_list)}"
        logging.debug(f"Running command: {command}")
        print(f"Running command: {command}")
        exit_code = os.system(command)
        logging.debug(f"Command exit code: {exit_code}")
        print(f"Command exit code: {exit_code}")

        # Return a result indicating whether the installation was successful or not
        if exit_code == 0:
            return "Installation successful"
        else:
            return "Installation failed"

