import os
import re
import decky_plugin
import platform

# Conditionally import winreg for Windows
if platform.system() == "Windows":
    import winreg

# Battle.net Scanner
# Define your mapping
flavor_mapping = {
    "Blizzard Arcade Collection": "RTRO",
    "Diablo": "D1",
    "Diablo II Resurrected": "OSI",
    "Diablo III": "D3",
    "Diablo IV": "Fen",
    "Diablo Immortal (PC)": "ANBS",
    "Hearthstone": "WTCG",
    "Heroes of the Storm": "Hero",
    "Overwatch": "Pro",
    "Overwatch 2": "Pro",
    "StarCraft": "S1",
    "StarCraft 2": "S2",
    "Warcraft: Orcs & Humans": "W1",
    "Warcraft II: Battle.net Edition": "W2",
    "Warcraft III: Reforged": "W3",
    "World of Warcraft": "WoW",
    "World of Warcraft Classic": "WoWC",
    "Warcraft Arclight Rumble": "GRY",
    "Call of Duty: Black Ops - Cold War": "ZEUS",
    "Call of Duty: Black Ops 4": "VIPR",
    "Call of Duty: Modern Warfare": "ODIN",
    "Call of Duty": "AUKS",
    "Call of Duty: MW 2 Campaign Remastered": "LAZR",
    "Call of Duty: Vanguard": "FORE",
    "Call of Duty: Modern Warfare III": "SPOT",
    "Crash Bandicoot 4: It's About Time": "WLBY",
    # Add more games here...
}

def get_flavor_from_file(game_path):
    game_path = game_path.replace('\\', '/')
    flavor_file = os.path.join(game_path, '_retail_', '.flavor.info')
    if os.path.exists(flavor_file):
        with open(flavor_file, 'r') as file:
            for line in file:
                if 'STRING' in line:
                    return line.split(':')[-1].strip().capitalize()
    else:
        decky_plugin.logger.info(f"Flavor file not found: {flavor_file}")
        # Use the mapping as a fallback
        game_name = os.path.basename(game_path)
        decky_plugin.logger.info(f"Game name from file path: {game_name}")
        return flavor_mapping.get(game_name, 'unknown')

def getBnetGameInfo(filePath):
    # Check if the file contains any Battle.net entries
    with open(filePath, 'r') as file:
        if "Battle.net" not in file.read():
            decky_plugin.logger.info("No Battle.net entries found in the registry file. Skipping Battle.net Games Scanner.")
            return None

    # If Battle.net entries exist, parse the registry file
    game_dict = {}
    with open(filePath, 'r') as file:
        game_name = None
        exe_path = None
        publisher = None
        contact = None
        for line in file:
            split_line = line.split("=")
            if len(split_line) > 1:
                if "Publisher" in line:
                    publisher = re.findall(r'\"(.+?)\"', split_line[1])
                    if publisher:
                        publisher = publisher[0]
                        # Skip if the publisher is not Blizzard Entertainment
                        if publisher != "Blizzard Entertainment":
                            game_name = None
                            exe_path = None
                            publisher = None
                            continue
                if "Contact" in line:
                    contact = re.findall(r'\"(.+?)\"', split_line[1])
                    if contact:
                        contact = contact[0]
                if "DisplayName" in line:
                    game_name = re.findall(r'\"(.+?)\"', split_line[1])
                    if game_name:
                        game_name = game_name[0]
                if "InstallLocation" in line:
                    exe_path = re.findall(r'\"(.+?)\"', split_line[1])
                    if exe_path:
                        exe_path = exe_path[0].replace('\\\\', '\\')
                        # Skip if the install location is for the Battle.net launcher
                        if "Battle.net" in exe_path:
                            game_name = None
                            exe_path = None
                            publisher = None
                            continue
            if game_name and exe_path and publisher == "Blizzard Entertainment" and contact == "Blizzard Support":
                game_dict[game_name] = {'exe': exe_path}
                decky_plugin.logger.info(f"Game added to dictionary: {game_name}")
                game_name = None
                exe_path = None
                publisher = None
                contact = None

    # If no games were found, return None
    if not game_dict:
        decky_plugin.logger.info("No Battle.net games found. Skipping Battle.net Games Scanner.")
        return None

    return game_dict

def getBnetGameInfoWindows():
    game_dict = {}
    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r"SOFTWARE\WOW6432Node\Blizzard Entertainment\Battle.net\Capabilities\Applications") as key:
            i = 0
            while True:
                try:
                    subkey_name = winreg.EnumKey(key, i)
                    with winreg.OpenKey(key, subkey_name) as subkey:
                        game_name = winreg.QueryValueEx(subkey, "ApplicationName")[0]
                        exe_path = winreg.QueryValueEx(subkey, "ApplicationIcon")[0]
                        if "Blizzard Entertainment" in winreg.QueryValueEx(subkey, "Publisher")[0]:
                            game_dict[game_name] = {'exe': exe_path}
                    i += 1
                except OSError:
                    break
    except OSError:
        decky_plugin.logger.info("No Battle.net entries found in the Windows registry. Skipping Battle.net Games Scanner.")
        return None

    return game_dict

def battle_net_scanner(logged_in_home, bnet_launcher, create_new_entry):
    game_dict = {}

    if platform.system() == "Windows":
        game_dict = getBnetGameInfoWindows()
    else:
        registry_file_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{bnet_launcher}/pfx/system.reg"
        if os.path.exists(registry_file_path):
            game_dict = getBnetGameInfo(registry_file_path)
        else:
            decky_plugin.logger.info("One or more paths do not exist.")
            decky_plugin.logger.info("Battle.net game data not found. Skipping Battle.net Games Scanner.")

    if game_dict:
        for game, game_info in game_dict.items():
            game_info['flavor'] = get_flavor_from_file(game_info['exe'])
            decky_plugin.logger.info(f"Flavor inferred: {game_info['flavor']}")

            if game == "Overwatch":
                game = "Overwatch 2"

            if game_info['flavor'] == "unknown":
                continue

            if platform.system() == "Windows":
                exe_path = game_info['exe']
                start_dir = os.path.dirname(exe_path)
                launch_options = f"--exec=\"launch {game_info['flavor']}\""
            else:
                exe_path = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{bnet_launcher}/pfx/drive_c/Program Files (x86)/Battle.net/Battle.net.exe\" --exec=\"launch {game_info['flavor']}\""
                start_dir = f"\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{bnet_launcher}/pfx/drive_c/Program Files (x86)/Battle.net/\""
                launch_options = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{bnet_launcher}\" %command% \"battlenet://{game_info['flavor']}\""

            create_new_entry(exe_path, game, launch_options, start_dir, "Battle.net")
# End of Battle.net Scanner
