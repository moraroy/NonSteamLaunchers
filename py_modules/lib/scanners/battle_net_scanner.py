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
    decky_plugin.logger.info(f"Parsing Battle.net config file at: {file_path}")
    with open(file_path, 'r') as file:
        config_data = json.load(file)

    games_info = config_data.get("Games", {})
    decky_plugin.logger.info(f"Games section of config file: {games_info}")
    game_dict = {}

    for game_key, game_data in games_info.items():
        decky_plugin.logger.info(f"Processing game_key: {game_key}, game_data: {game_data}")
        if game_key == "battle_net":
            continue
        if "Resumable" not in game_data:
            continue
        if game_data["Resumable"] == "false":
            game_dict[game_key] = {
                "ServerUid": game_data.get("ServerUid", ""),
                "LastActioned": game_data.get("LastActioned", "")
            }
            decky_plugin.logger.info(f"Added game: {game_key} with ServerUid: {game_data.get('ServerUid', '')}")

    decky_plugin.logger.info(f"Final game_dict: {game_dict}")
    return game_dict

def fix_windows_path(path):
    decky_plugin.logger.info(f"Fixing Windows path: {path}")
    if path.startswith('/c/'):
        fixed_path = 'C:\\' + path[3:].replace('/', '\\')
        decky_plugin.logger.info(f"Fixed Windows path: {fixed_path}")
        return fixed_path
    return path

def battle_net_scanner(logged_in_home, bnet_launcher, create_new_entry):
    decky_plugin.logger.info(f"Starting Battle.net scanner with logged_in_home: {logged_in_home} and bnet_launcher: {bnet_launcher}")
    game_dict = {}

    if platform.system() == "Windows":
        config_file_path = fix_windows_path(logged_in_home) + '\\AppData\\Roaming\\Battle.net\\Battle.net.config'
    else:
        config_file_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{bnet_launcher}/pfx/drive_c/users/steamuser/AppData/Roaming/Battle.net/Battle.net.config"

    decky_plugin.logger.info(f"Config file path: {config_file_path}")

    if os.path.exists(config_file_path):
        game_dict = parse_battlenet_config(config_file_path)
    else:
        decky_plugin.logger.info("Battle.net config file not found. Skipping Battle.net Games Scanner.")

    if game_dict:
        for game_key, game_info in game_dict.items():
            # Handle the "prometheus" situation
            if game_key == "prometheus":
                game_key = "Pro"
                decky_plugin.logger.info(f"Re-mapped game_key 'prometheus' to 'Pro'")

            game_name = flavor_mapping.get(game_key, "unknown")

            if game_name == "unknown":
                # Try to match with uppercase version of the key
                game_name = flavor_mapping.get(game_key.upper(), "unknown")
                if game_name == "unknown":
                    decky_plugin.logger.info(f"Skipping unknown game_key: {game_key}")
                    continue

            # Update game_key to its matched form
            matched_key = next((k for k, v in flavor_mapping.items() if v == game_name), game_key)

            if game_name == "Overwatch":
                game_name = "Overwatch 2"

            if game_info['ServerUid'] == "unknown":
                decky_plugin.logger.info(f"Skipping game {game_key} due to unknown ServerUid")
                continue

            if platform.system() == "Windows":
                exe_path = 'C:\\Program Files (x86)\\Battle.net\\Battle.net.exe'
                start_dir = 'C:\\Program Files (x86)\\Battle.net\\'
                launch_options = '--exec="launch {}" battlenet://{}'.format(matched_key, matched_key)
            else:
                exe_path = '"{}/.local/share/Steam/steamapps/compatdata/{}/pfx/drive_c/Program Files (x86)/Battle.net/Battle.net.exe"'.format(logged_in_home, bnet_launcher)
                start_dir = '"{}/.local/share/Steam/steamapps/compatdata/{}/pfx/drive_c/Program Files (x86)/Battle.net/"'.format(logged_in_home, bnet_launcher)
                launch_options = 'STEAM_COMPAT_DATA_PATH="{}/.local/share/Steam/steamapps/compatdata/{}" %command% --exec="launch {}" battlenet://{}'.format(logged_in_home, bnet_launcher, matched_key, matched_key)

            decky_plugin.logger.info(f"Creating new entry: exe_path={exe_path}, start_dir={start_dir}, launch_options={launch_options}")
            create_new_entry(exe_path, game_name, launch_options, start_dir, "Battle.net")
            decky_plugin.logger.info(f"Created new entry for game: {game_name}")

# End of Battle.net Scanner