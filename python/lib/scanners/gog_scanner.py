import os, re, decky_plugin

# Gog Galaxy Scanner
def getGogGameInfo(filePath):
    # Check if the file contains any GOG entries
    with open(filePath, 'r') as file:
        if "GOG.com" not in file.read():
            decky_plugin.logger.info("No GOG entries found in the registry file. Skipping GOG Galaxy Games Scanner.")
            return {}

    # If GOG entries exist, parse the registry file
    game_dict = {}
    with open(filePath, 'r') as file:
        game_id = None
        game_name = None
        exe_path = None
        for line in file:
            split_line = line.split("=")
            if len(split_line) > 1:
                if "gameID" in line:
                    game_id = re.findall(r'\"(.+?)\"', split_line[1])
                    if game_id:
                        game_id = game_id[0]
                if "gameName" in line:
                    game_name = re.findall(r'\"(.+?)\"', split_line[1])
                    if game_name:
                        game_name = game_name[0]
                if "exe" in line and "GOG Galaxy" in line and not "unins000.exe" in line:
                    exe_path = re.findall(r'\"(.+?)\"', split_line[1])
                    if exe_path:
                        exe_path = exe_path[0].replace('\\\\', '\\')
            if game_id and game_name and exe_path:
                game_dict[game_name] = {'id': game_id, 'exe': exe_path}
                game_id = None
                game_name = None
                exe_path = None

    return game_dict

def gog_scanner(logged_in_home, gog_galaxy_launcher, create_new_entry):
    # Define your paths
    gog_games_directory = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/drive_c/Program Files (x86)/GOG Galaxy/Games"
    registry_file_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/system.reg"

    # Check if the paths exist
    if not os.path.exists(gog_games_directory) or not os.path.exists(registry_file_path):
        decky_plugin.logger.info("One or more paths do not exist.")
        decky_plugin.logger.info("GOG Galaxy game data not found. Skipping scanning for GOG Galaxy games.")
    else:
        game_dict = getGogGameInfo(registry_file_path)

        for game, game_info in game_dict.items():
            if game_info['id']:
                launch_options = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/\" %command% /command=runGame /gameId={game_info['id']} /path=\"{game_info['exe']}\""
                exe_path = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/drive_c/Program Files (x86)/GOG Galaxy/GalaxyClient.exe\""
                start_dir = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/drive_c/Program Files (x86)/GOG Galaxy/\""
                create_new_entry(exe_path, game, launch_options, start_dir)

# End of Gog Galaxy Scanner