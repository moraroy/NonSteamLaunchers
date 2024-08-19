import os, re, decky_plugin

#Gog Galaxy Scanner
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
        depends_on = None
        launch_command = None
        start_menu_link = None
        gog_entry = False
        for line in file:
            split_line = line.split("=")
            if len(split_line) > 1:
                if "gameid" in line.lower():
                    game_id = re.findall(r'\"(.+?)\"', split_line[1])
                    if game_id:
                        game_id = game_id[0]
                if "gamename" in line.lower():
                    game_name = re.findall(r'\"(.+?)\"', split_line[1])
                    if game_name:
                        game_name = bytes(game_name[0], 'utf-8').decode('unicode_escape')
                        game_name = game_name.replace('!22', '™')
                if "exe" in line.lower() and not "unins000.exe" in line.lower():
                    exe_path = re.findall(r'\"(.+?)\"', split_line[1])
                    if exe_path:
                        exe_path = exe_path[0].replace('\\\\', '\\')
                if "dependson" in line.lower():
                    depends_on = re.findall(r'\"(.+?)\"', split_line[1])
                    if depends_on:
                        depends_on = depends_on[0]
                if "launchcommand" in line.lower():
                    launch_command = re.findall(r'\"(.+?)\"', split_line[1])
                    if launch_command:
                        launch_command = launch_command[0]
            if game_id and game_name and launch_command:
                game_dict[game_name] = {'id': game_id, 'exe': exe_path}
                game_id = None
                game_name = None
                exe_path = None
                depends_on = None
                launch_command = None

    return game_dict

def gog_scanner(logged_in_home, gog_galaxy_launcher, create_new_entry):
    # Define your paths
    registry_file_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/system.reg"

    # Check if the paths exist
    if not os.path.exists(registry_file_path):
        decky_plugin.logger.info("Registry path does not exist, skipping GOG scanner.")
    else:
        game_dict = getGogGameInfo(registry_file_path)

        for game, game_info in game_dict.items():
            if game_info['id']:
                exe_path = game_info['exe'].strip()
                launch_options = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/\" %command% /command=runGame /gameId={game_info['id']} /path=\"{exe_path}\""
                exe_path = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/drive_c/Program Files (x86)/GOG Galaxy/GalaxyClient.exe\""
                start_dir = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{gog_galaxy_launcher}/pfx/drive_c/Program Files (x86)/GOG Galaxy/\""
                create_new_entry(exe_path, game, launch_options, start_dir, "Gog Galaxy")

# End of Gog Galaxy Scanner