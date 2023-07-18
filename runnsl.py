#!/usr/bin/env python3
import subprocess
import logging
import sys
import os
import decky_plugin
from decky_plugin import DECKY_PLUGIN_DIR

# Get the selected options from the command line arguments
selected_options = sys.argv[1:]

# Log the selected options for debugging
decky_plugin.logger.debug(f"Selected options: {selected_options}")

# Set the path to the script
script_path = os.path.join(DECKY_PLUGIN_DIR, 'NonSteamLaunchers.sh')

# Log the script path for debugging
decky_plugin.logger.debug(f"Script path: {script_path}")

# Add execute permissions to the script
os.chmod(script_path, 0o755)

# Execute the script and pass the selected options as arguments
decky_plugin.logger.debug(f"Executing script with options: {selected_options}")
process = subprocess.Popen([script_path, *selected_options], stdout=subprocess.PIPE, stderr=subprocess.PIPE)

# Handle output from the script
for line in process.stdout:
    decky_plugin.logger.debug(f"Script output: {line.decode('utf-8').strip()}")

# Handle errors from the script
for line in process.stderr:
    decky_plugin.logger.error(f"Script error: {line.decode('utf-8').strip()}")