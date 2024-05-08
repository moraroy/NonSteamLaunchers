import os, re, decky_plugin

#Gog Galaxy Scanner
def getGogGameInfo(filePath):
    # Check if the file contains any GOG entries
    with open(filePath, 'r') as file:
        if "GOG.com" not in file.read():
            print("No GOG entries found in the registry file. Skipping GOG Galaxy Games Scanner.")
            return {}

    # If GOG entries exist, parse the registry file
    game_dict = {}
    with open(filePath, 'r') as file:
        game_id = None
        game_name = None
        exe_path = None
        depends_on = None
        launch_command = None
        start_menu_link = None
        gog_entry = False
        for line in file:
            if "GOG.com" in line:
                gog_entry = True
            if gog_entry:
                split_line = line.split("=")
                if len(split_line) > 1:
                    if "gameID" in line:
                        game_id = re.findall(r'\"(.+?)\"', split_line[1])
                        if game_id:
                            game_id = game_id[0]
                    if "gameName" in line:
                        game_name = re.findall(r'\"(.+?)\"', split_line[1])
                        if game_name:
                            game_name = bytes(game_name[0], 'utf-8').decode('unicode_escape')
                            game_name = game_name.replace('!22', '™')
                    if "exe" in line and not "unins000.exe" in line:
                        exe_path = re.findall(r'\"(.+?)\"', split_line[1])
                        if exe_path:
                            exe_path = exe_path[0].replace('\\\\', '\\')
                    if "dependsOn" in line:
                        depends_on = re.findall(r'\"(.+?)\"', split_line[1])
                        if depends_on:
                            depends_on = depends_on[0]
                    if "launchCommand" in line:
                        launch_command = re.findall(r'\"(.+?)\"\s*$', split_line[1])
                        if launch_command:
                            # Remove leading and trailing whitespace from the path
                            path = launch_command[0].strip()
                            # Reconstruct the launch command with the cleaned path
                            launch_command = f"\"{path}\""
                    if "startMenuLink" in line:
                        start_menu_link = re.findall(r'\"(.+?)\"', split_line[1])
                        if start_menu_link:
                            start_menu_link = start_menu_link[0]
                if game_id and game_name and launch_command and start_menu_link and 'GOG.com' in start_menu_link:
                    game_dict[game_name] = {'id': game_id, 'exe': exe_path}
                    game_id = None
                    game_name = None
                    exe_path = None
                    depends_on = None
                    launch_command = None
                    start_menu_link = None

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
                exe_path = game_info['exe'].strip()
                launch_options = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/\" %command% /command=runGame /gameId={game_info['id']} /path=\"{exe_path}\""
                exe_path = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/drive_c/Program Files (x86)/GOG Galaxy/GalaxyClient.exe\""
                start_dir = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/drive_c/Program Files (x86)/GOG Galaxy/\""
                create_new_entry(exe_path, game, launch_options, start_dir)

# End of Gog Galaxy Scanner
