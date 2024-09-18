import os
import platform
import externals.xml.etree.ElementTree as ET

# EA App Game Scanner

def get_ea_app_game_info(installed_games, game_directory_path):
    game_dict = {}
    for game in installed_games:
        xml_file = ET.parse(f"{game_directory_path}{game}/__Installer/installerdata.xml")
        xml_root = xml_file.getroot()
        ea_ids = None
        game_name = None
        for content_id in xml_root.iter('contentID'):
            if ea_ids is None:
                ea_ids = content_id.text
            else:
                ea_ids = ea_ids + ',' + content_id.text
        for game_title in xml_root.iter('gameTitle'):
            if game_name is None:
                game_name = game_title.text
                continue
        for game_title in xml_root.iter('title'):
            if game_name is None:
                game_name = game_title.text
                continue
        if game_name is None:
            game_name = game
        if ea_ids:  # Add the game's info to the dictionary if its ID was found in the folder
            game_dict[game_name] = ea_ids
    return game_dict

def ea_scanner(logged_in_home, ea_app_launcher, create_new_entry):
    if platform.system() == "Windows":
        game_directory_path = os.path.join(logged_in_home, "AppData", "Local", "Electronic Arts", "EA Desktop", "EA Desktop", "EALaunchHelper.exe")
    else:
        game_directory_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{ea_app_launcher}/pfx/drive_c/Program Files/EA Games/"

    if not os.path.isdir(game_directory_path):
        print("EA App game data not found. Skipping EA App Scanner.")
    else:
        installed_games = os.listdir(game_directory_path)  # Get a list of game folders
        game_dict = get_ea_app_game_info(installed_games, game_directory_path)

        for game, ea_ids in game_dict.items():
            if platform.system() == "Windows":
                launch_options = f"origin2://game/launch?offerIds={ea_ids}"
                exe_path = os.path.join(logged_in_home, "AppData", "Local", "Electronic Arts", "EA Desktop", "EA Desktop", "EALaunchHelper.exe")
                start_dir = os.path.join(logged_in_home, "AppData", "Local", "Electronic Arts", "EA Desktop", "EA Desktop")
            else:
                launch_options = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{ea_app_launcher}/\" %command% \"origin2://game/launch?offerIds={ea_ids}\""
                exe_path = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{ea_app_launcher}/pfx/drive_c/Program Files/Electronic Arts/EA Desktop/EA Desktop/EALaunchHelper.exe\""
                start_dir = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{ea_app_launcher}/pfx/drive_c/Program Files/Electronic Arts/EA Desktop/EA Desktop/\""
            
            create_new_entry(exe_path, game, launch_options, start_dir, "EA App")

# End of EA App Scanner
