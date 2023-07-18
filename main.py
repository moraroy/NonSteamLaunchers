#!/usr/bin/env python3
import os
import logging
import sys
import subprocess
import re
import shutil
import json
import math
import decky_plugin


homeDir = os.environ['HOME']


# Set up logging
logging.basicConfig(level=logging.DEBUG)

def camel_to_title(s):
    # Split the string into words using a regular expression
    words = re.findall(r'[A-Z]?[a-z]+|[A-Z]+(?=[A-Z]|$)', s)
    # Convert the first character of each word to uppercase and join the words with spaces
    return ' '.join(word.capitalize() for word in words)

class Plugin:
    def install(self, selected_options):
        decky_plugin.logger.info('install was called')
        # Set up logging
        logging.basicConfig(level=logging.DEBUG)

        # Set the path to the runnsl.py script
        script_path = os.path.join('runnsl.py')

        # Change the permissions of the runnsl.py script to make it executable
        os.chmod(script_path, 0o755)

        # Log the script_path for debugging
        decky_plugin.logger.info(f"script_path: {script_path}")
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
        decky_plugin.logger.info(f"selected_options_list: {selected_options_list}")
        print(f"selected_options_list: {selected_options_list}")

         # Run the runnsl.py script with the selected options using subprocess.Popen
        command = [sys.executable, script_path] + selected_options_list

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
