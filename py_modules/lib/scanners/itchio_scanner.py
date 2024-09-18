import gzip
import os
import json
import sqlite3
import decky_plugin
import platform

def itchio_games_scanner(logged_in_home, itchio_launcher, create_new_entry):
    if platform.system() == "Windows":
        itch_db_location = f"{logged_in_home}\\AppData\\Roaming\\itch\\db\\butler.db"
    else:
        itch_db_location = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{itchio_launcher}/pfx/drive_c/users/steamuser/AppData/Roaming/itch/db/butler.db"

    decky_plugin.logger.info(f"Checking if {itch_db_location} exists...")
    if not os.path.exists(itch_db_location):
        decky_plugin.logger.info(f"Path not found: {itch_db_location}. Aborting Itch.io scan...")
        return

    decky_plugin.logger.info("Opening and reading the database file...")
    conn = sqlite3.connect(itch_db_location)
    cursor = conn.cursor()

    cursor.execute("SELECT install_folder_name, game_id FROM caves")
    rows = cursor.fetchall()

    paths = parse_butler_db(rows)

    decky_plugin.logger.info("Converting paths to games...")
    itchgames = [dbpath_to_game(logged_in_home, itchio_launcher, path) for path in paths if dbpath_to_game(logged_in_home, itchio_launcher, path) is not None]
    itchgames = list(set(itchgames))  # Remove duplicates
    decky_plugin.logger.info(f"Found {len(itchgames)} unique games.")
    for game in itchgames:
        linux_path, executable, game_title = game
        exe_path = f"\"{linux_path}/{executable}\""
        start_dir = f"\"{linux_path}\""
        if platform.system() == "Windows":
            launchoptions = ""
        else:
            launchoptions = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{itchio_launcher}/\" %command%"
        create_new_entry(exe_path, game_title, launchoptions, start_dir, "itch.io")

    conn.close()

def parse_butler_db(rows):
    decky_plugin.logger.info("Converting database rows to paths...")
    db_paths = []
    for row in rows:
        base_path = row[0]
        candidates_json = row[1]
        decky_plugin.logger.info(f"Candidates JSON: {candidates_json}")
        try:
            if isinstance(candidates_json, int):
                # Handle the case where candidates_json is an integer
                paths = [str(candidates_json)]
            else:
                candidates = json.loads(candidates_json)
                decky_plugin.logger.info(f"Parsed candidates: {candidates}")
                paths = [candidate['path'] for candidate in candidates]
            db_paths.append((base_path, paths))
        except json.JSONDecodeError as e:
            decky_plugin.logger.error(f"JSON decoding error: {e}. Skipping this entry and continuing...")
            continue
    decky_plugin.logger.info(f"Converted {len(rows)} rows to {len(db_paths)} database paths.")
    return db_paths

def dbpath_to_game(logged_in_home, itchio_launcher, paths):
    if platform.system() == "Windows":
        db_path = paths[0].replace("/", "\\").replace("\\c\\", "C:\\")
        linux_path = f"{logged_in_home}\\AppData\\Roaming\\itch\\apps\\{db_path}"
    else:
        db_path = paths[0].replace("\\\\", "/").replace("C:", "")
        linux_path = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{itchio_launcher}/pfx/drive_c/users/steamuser/AppData/Roaming/itch/apps/{db_path}"

    decky_plugin.logger.info(f"Constructed Linux path: {linux_path}")

    # Check the main game folder for the receipt JSON
    receipt_path = f"{linux_path}/.itch/receipt.json.gz"
    decky_plugin.logger.info(f"Checking if {receipt_path} exists...")
    if not os.path.exists(receipt_path):
        decky_plugin.logger.info(f"Receipt path not found: {receipt_path}. Skipping this game...")
        return None

    for executable in paths[1]:
        exe_path = f"{linux_path}/{executable}"
        if os.access(exe_path, os.X_OK):  # check if file is executable
            with gzip.open(receipt_path, 'rb') as f:
                receipt_str = f.read().decode()
                receipt = json.loads(receipt_str)
                return (linux_path, executable, receipt['game']['title'])

# End of Itchio Scanner