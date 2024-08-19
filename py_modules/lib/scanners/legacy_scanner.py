import os, re, decky_plugin

def legacy_games_scanner(logged_in_home, legacy_launcher, create_new_entry):
    legacy_dir = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{legacy_launcher}/pfx/drive_c/Program Files/Legacy Games/"
    user_reg_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{legacy_launcher}/pfx/user.reg"

    if not os.path.exists(legacy_dir) or not os.path.exists(user_reg_path):
        print("Path not found. Skipping Legacy Games Scanner.")
    else:
        print("Directory and user.reg file found.")
        with open(user_reg_path, 'r') as file:
            user_reg = file.read()

        for game_dir in os.listdir(legacy_dir):
            if game_dir == "Legacy Games Launcher":
                continue

            print(f"Processing game directory: {game_dir}")

            if game_dir == "100 Doors Escape from School":
                app_info_path = f"{legacy_dir}/100 Doors Escape from School/100 Doors Escape From School_Data/app.info"
                exe_path = f"{legacy_dir}/100 Doors Escape from School/100 Doors Escape From School.exe"
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
                    start_dir = f"{legacy_dir}{game_dir}"
                    launch_options = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{legacy_launcher}\" %command%"
                    create_new_entry(f'"{exe_path}"', game_name, launch_options, f'"{start_dir}"', "Legacy Games")
                else:
                    print(f"No matching .exe file found for game: {game_dir}")
            else:
                print(f"No .exe file found for game: {game_dir}")

# End of the Legacy Games Scanner
