import os
import gzip
import json
import sqlite3
import decky_plugin
import platform

def convert_to_windows_path(unix_path):
    # Convert Unix-style path to Windows-style path
    windows_path = unix_path.replace("/", "\\").replace("\\c\\", "C:\\")
    return windows_path

def itchio_games_scanner(logged_in_home, itchio_launcher, create_new_entry):
    if platform.system() == "Windows":
        logged_in_home_windows = convert_to_windows_path(logged_in_home)
        itch_db_location = f"{logged_in_home_windows}\\AppData\\Roaming\\itch\\db\\butler.db"
    else:
        itch_db_location = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{itchio_launcher}/pfx/drive_c/users/steamuser/AppData/Roaming/itch/db/butler.db-wal"

    decky_plugin.logger.info(f"Checking if {itch_db_location} exists...")
    if not os.path.exists(itch_db_location):
        decky_plugin.logger.info(f"Path not found: {itch_db_location}. Aborting Itch.io scan...")
        return

    conn = sqlite3.connect(itch_db_location)
    cursor = conn.cursor()

    cursor.execute("SELECT install_folder_name, game_id FROM caves")
    rows = cursor.fetchall()

    paths = parse_butler_db(rows, logged_in_home_windows)

    itchgames = [dbpath_to_game(logged_in_home_windows, itchio_launcher, path) for path in paths if dbpath_to_game(logged_in_home_windows, itchio_launcher, path) is not None]
    itchgames = list(set(itchgames))
    for game in itchgames:
        linux_path, executable, game_title = game
        exe_path = f"{linux_path}\\{executable}"
        start_dir = f"{linux_path}"
        if platform.system() == "Windows":
            launchoptions = ""
        else:
            launchoptions = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{itchio_launcher}/\" %command%"
        create_new_entry(exe_path, game_title, launchoptions, start_dir, "itch.io")

    conn.close()

def parse_butler_db(rows, logged_in_home_windows):
    db_paths = []
    for row in rows:
        base_path = row[0]
        game_id = row[1]
        db_paths.append((f"{logged_in_home_windows}\\AppData\\Roaming\\itch\\apps\\{base_path}", [game_id]))
    return db_paths

def dbpath_to_game(logged_in_home_windows, itchio_launcher, paths):
    db_path = paths[0]
    windows_path = db_path
    receipt_path = f"{windows_path}\\.itch\\receipt.json.gz"
    if not os.path.exists(receipt_path):
        return None
    with gzip.open(receipt_path, 'rb') as f:
        receipt_str = f.read().decode()
        receipt = json.loads(receipt_str)
        if 'files' in receipt:
            executable = receipt['files'][0]
            game_title = receipt['game']['title']
            exe_path = f"{windows_path}\\{executable}"
            if os.access(exe_path, os.X_OK):
                return (windows_path, executable, game_title)
