import os
import re
import decky_plugin
import platform

# Conditionally import winreg for Windows
if platform.system() == "Windows":
    import winreg

def legacy_games_scanner(logged_in_home, legacy_launcher, create_new_entry):
    if platform.system() == "Windows":
        legacy_dir = os.path.join(logged_in_home, "AppData", "Local", "Legacy Games")
        user_reg_path = None  # Not needed for Windows
    else:
        legacy_dir = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{legacy_launcher}/pfx/drive_c/Program Files/Legacy Games/"
        user_reg_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{legacy_launcher}/pfx/user.reg"

    if not os.path.exists(legacy_dir) or (user_reg_path and not os.path.exists(user_reg_path)):
        print("Path not found. Skipping Legacy Games Scanner.")
    else:
        print("Directory and user.reg file found.")
        if platform.system() == "Windows":
            user_reg = get_windows_registry_entries()
        else:
            with open(user_reg_path, 'r') as file:
                user_reg = file.read()

        for game_dir in os.listdir(legacy_dir):
            if game_dir == "Legacy Games Launcher":
                continue

            print(f"Processing game directory: {game_dir}")

            if game_dir == "100 Doors Escape from School":
                app_info_path = os.path.join(legacy_dir, "100 Doors Escape from School", "100 Doors Escape From School_Data", "app.info")
                exe_path = os.path.join(legacy_dir, "100 Doors Escape from School", "100 Doors Escape From School.exe")
            else:
                app_info_path = os.path.join(legacy_dir, game_dir, game_dir.replace(" ", "") + "_Data", "app.info")
                exe_path = os.path.join(legacy_dir, game_dir, game_dir.replace(" ", "") + ".exe")

            if os.path.exists(app_info_path):
                print("app.info file found.")
                with open(app_info_path, 'r') as file:
                    lines = file.read().split('\n')
                    game_name = lines[1].strip()
                    print(f"Game Name: {game_name}")
            else:
                print("No app.info file found.")

            if os.path.exists(exe_path):
                game_exe_reg = re.search(r'\[Software\\\\Legacy Games\\\\' + re.escape(game_dir) + r'\].*?"GameExe"="([^"]*)"', user_reg, re.DOTALL | re.IGNORECASE)
                if game_exe_reg and game_exe_reg.group(1).lower() == os.path.basename(exe_path).lower():
                    print(f"GameExe found in user.reg: {game_exe_reg.group(1)}")
                    start_dir = os.path.join(legacy_dir, game_dir)
                    if platform.system() == "Windows":
                        launch_options = f"\"{exe_path}\""
                    else:
                        launch_options = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{legacy_launcher}\" %command%"
                    create_new_entry(f'"{exe_path}"', game_name, launch_options, f'"{start_dir}"', "Legacy Games")
                else:
                    print(f"No matching .exe file found for game: {game_dir}")
            else:
                print(f"No .exe file found for game: {game_dir}")

def get_windows_registry_entries():
    registry_entries = ""
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Legacy Games") as key:
            i = 0
            while True:
                try:
                    subkey_name = winreg.EnumKey(key, i)
                    with winreg.OpenKey(key, subkey_name) as subkey:
                        game_exe = winreg.QueryValueEx(subkey, "GameExe")[0]
                        registry_entries += f"[Software\\\\Legacy Games\\\\{subkey_name}]\n\"GameExe\"=\"{game_exe}\"\n"
                    i += 1
                except OSError:
                    break
    except OSError:
        decky_plugin.logger.info("No Legacy Games entries found in the Windows registry. Skipping Legacy Games Scanner.")
    return registry_entries

# End of the Legacy Games Scanner
