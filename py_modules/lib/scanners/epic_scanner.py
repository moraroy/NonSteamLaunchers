import os, json, decky_plugin

def epic_games_scanner(logged_in_home, epic_games_launcher, create_new_entry):
    item_dir = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{epic_games_launcher}/pfx/drive_c/ProgramData/Epic/EpicGamesLauncher/Data/Manifests/"
    dat_file_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{epic_games_launcher}/pfx/drive_c/ProgramData/Epic/UnrealEngineLauncher/LauncherInstalled.dat"

    if os.path.exists(dat_file_path) and os.path.exists(item_dir):
        with open(dat_file_path, 'r') as file:
            dat_data = json.load(file)

        #Epic Game Scanner
        for item_file in os.listdir(item_dir):
            if item_file.endswith('.item'):
                with open(os.path.join(item_dir, item_file), 'r') as file:
                    item_data = json.load(file)

                # Initialize variables
                display_name = item_data['DisplayName']
                app_name = item_data['AppName']
                exe_path = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{epic_games_launcher}/pfx/drive_c/Program Files (x86)/Epic Games/Launcher/Portal/Binaries/Win32/EpicGamesLauncher.exe\""
                start_dir = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{epic_games_launcher}/pfx/drive_c/Program Files (x86)/Epic Games/Launcher/Portal/Binaries/Win32/\""
                launch_options = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{epic_games_launcher}\" %command% -'com.epicgames.launcher://apps/{app_name}?action=launch&silent=true'"

                # Check if the game is still installed
                for game in dat_data['InstallationList']:
                    if game['AppName'] == item_data['AppName']:
                        create_new_entry(exe_path, display_name, launch_options, start_dir, "Epic Games")

    else:
        decky_plugin.logger.info("Epic Games Launcher data not found. Skipping scanning for installed Epic Games.")