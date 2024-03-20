import os, decky_plugin

# Path to the env_vars file
env_vars_path = f"{os.environ['HOME']}/.config/systemd/user/env_vars"
env_vars = {}

def refresh_env_vars():
    global env_vars
    env_vars = {}
    # Check if the env_vars file exists
    if not os.path.exists(env_vars_path):
        decky_plugin.logger.error(f"Error: {env_vars_path} does not exist.")
        return

    # Read variables from the file
    with open(env_vars_path, 'r') as f:
        lines = f.readlines()

    for line in lines:
        if line.startswith('export '):
            line = line[7:]  # Remove 'export '
        name, value = line.strip().split('=', 1)
        env_vars[name] = value

    # Delete env_vars entries for Chrome shortcuts so that they're only added once
    with open(env_vars_path, 'w') as f:
        for line in lines:
            if line.find('chromelaunchoptions') == -1 and line.find('websites_str') == -1:
                f.write(line)
    
    return env_vars
