import os
import json
import decky_plugin
import platform

# Define your mapping
flavor_mapping = {
    "RTRO": "Blizzard Arcade Collection",
    "D1": "Diablo",
    "OSI": "Diablo II Resurrected",
    "D3": "Diablo III",
    "Fen": "Diablo IV",
    "ANBS": "Diablo Immortal (PC)",
    "WTCG": "Hearthstone",
    "Hero": "Heroes of the Storm",
    "Pro": "Overwatch 2",
    "S1": "StarCraft",
    "S2": "StarCraft 2",
    "W1": "Warcraft: Orcs & Humans",
    "W2": "Warcraft II: Battle.net Edition",
    "W3": "Warcraft III: Reforged",
    "WoW": "World of Warcraft",
    "WoWC": "World of Warcraft Classic",
    "GRY": "Warcraft Arclight Rumble",
    "ZEUS": "Call of Duty: Black Ops - Cold War",
    "VIPR": "Call of Duty: Black Ops 4",
    "ODIN": "Call of Duty: Modern Warfare",
    "AUKS": "Call of Duty",
    "LAZR": "Call of Duty: MW 2 Campaign Remastered",
    "FORE": "Call of Duty: Vanguard",
    "SPOT": "Call of Duty: Modern Warfare III",
    "WLBY": "Crash Bandicoot 4: It's About Time",
    # Add more games here...
}

def parse_battlenet_config(file_path):
    with open(file_path, 'r') as file:
        config_data = json.load(file)

    games_info = config_data.get("Games", {})
    game_dict = {}

    for game_key, game_data in games_info.items():
        if game_key == "battle_net":
            continue
        if "Resumable" not in game_data:
            continue
        if game_data["Resumable"] == "false":
            if game_key == "prometheus":
                game_key = "Pro"
            game_name = flavor_mapping.get(game_key.upper(), "unknown")
            if game_name != "unknown":
                game_dict[game_name] = {
                    "ServerUid": game_data.get("ServerUid", ""),
                    "LastActioned": game_data.get("LastActioned", "")
                }

    decky_plugin.logger.info(f"Games found from config parsing: {list(game_dict.keys())}")
    return game_dict

def fix_windows_path(path):
    if path.startswith('/c/'):
        return 'C:\\' + path[3:].replace('/', '\\')
    return path

def battle_net_scanner(logged_in_home, bnet_launcher, create_new_entry):
    game_dict = {}

    if platform.system() == "Windows":
        config_file_path = fix_windows_path(logged_in_home) + '\\AppData\\Roaming\\Battle.net\\Battle.net.config'
    else:
        config_file_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{bnet_launcher}/pfx/drive_c/users/steamuser/AppData/Roaming/Battle.net/Battle.net.config"

    if os.path.exists(config_file_path):
        game_dict = parse_battlenet_config(config_file_path)
    else:
        decky_plugin.logger.info("Battle.net config file not found. Skipping Battle.net Games Scanner.")

    if game_dict:
        for game, game_info in game_dict.items():
            if game == "Overwatch":
                game = "Overwatch 2"

            if game_info['ServerUid'] == "unknown":
                continue

            if platform.system() == "Windows":
                exe_path = 'C:\\Program Files (x86)\\Battle.net\\Battle.net.exe'
                start_dir = 'C:\\Program Files (x86)\\Battle.net\\'
                launch_options = '--exec="launch {}" battlenet://{}'.format(game_info['ServerUid'], game_info['ServerUid'])
            else:
                exe_path = '{}/.local/share/Steam/steamapps/compatdata/{}/pfx/drive_c/Program Files (x86)/Battle.net/Battle.net.exe'.format(logged_in_home, bnet_launcher)
                start_dir = '{}/.local/share/Steam/steamapps/compatdata/{}/pfx/drive_c/Program Files (x86)/Battle.net/'.format(logged_in_home, bnet_launcher)
                launch_options = 'STEAM_COMPAT_DATA_PATH="{}/.local/share/Steam/steamapps/compatdata/{}" %command% "--exec=\\"launch {}\\" battlenet://{}"'.format(logged_in_home, bnet_launcher, game_info['ServerUid'], game_info['ServerUid'])

            create_new_entry(exe_path, game, launch_options, start_dir, "Battle.net")
            decky_plugin.logger.info(f"Created new entry for game: {game}")

# End of Battle.net Scanner
