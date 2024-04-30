import gzip, os, re, json, decky_plugin

def itchio_games_scanner(logged_in_home, itchio_launcher, create_new_entry):
    itch_db_location = f"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{itchio_launcher}/pfx/drive_c/users/steamuser/AppData/Roaming/itch/db/butler.db-wal"
    decky_plugin.logger.info(f"Checking if {itch_db_location} exists...")
    if not os.path.exists(itch_db_location):
        decky_plugin.logger.info(f"Path not found: {itch_db_location}. Aborting Ichio scan...")
        return

    decky_plugin.logger.info("Opening and reading the database file...")
    with open(itch_db_location, 'rb') as f:
        shortcut_bytes = f.read()

    decky_plugin.logger.info("Parsing the database file...")
    paths = parse_butler_db(shortcut_bytes)

    decky_plugin.logger.info("Converting paths to games...")
    itchgames = [dbpath_to_game(path) for path in paths if dbpath_to_game(path) is not None]
    # Remove duplicates
    itchgames = list(set(itchgames))
    decky_plugin.logger.info(f"Found {len(itchgames)} unique games.")
    for game in itchgames:
        linux_path, executable, game_title = game
        exe_path = f"\"{os.path.join(linux_path, executable)}\""
        start_dir = f"\"{linux_path}\""
        launchoptions = f"STEAM_COMPAT_DATA_PATH=\"{logged_in_home}/.local/share/Steam/steamapps/compatdata/{itchio_launcher}/\" %command%"
        create_new_entry(exe_path, game_title, launchoptions, start_dir)

def parse_butler_db(content):
    decky_plugin.logger.info("Finding matches in the database content...")
    pattern = rb'\{"basePath":"(.*?)","totalSize".*?"candidates":\[(.*?)\]\}'
    matches = re.findall(pattern, content)
    decky_plugin.logger.info(f"Found {len(matches)} matches.")

    decky_plugin.logger.info("Converting matches to database paths...")
    db_paths = []
    for match in matches:
        base_path = match[0].decode(errors='ignore')
        candidates_json = b'[' + match[1] + b']'
        candidates = json.loads(candidates_json.decode(errors='ignore'))
        paths = [candidate['path'] for candidate in candidates]
        db_paths.append((base_path, paths))
    decky_plugin.logger.info(f"Converted {len(matches)} matches to {len(db_paths)} database paths.")
    return db_paths

def dbpath_to_game(paths):
    # Convert the Windows-style path from the database to a Unix-style path
    db_path = paths[0].replace("\\\\", "/").replace("C:", "")
    linux_path = "/home/deck/.local/share/Steam/steamapps/compatdata/NonSteamLaunchers/pfx/drive_c" + db_path
    receipt_path = os.path.join(linux_path, ".itch", "receipt.json.gz")
    if not os.path.exists(receipt_path):
        return None
    for executable in paths[1]:
        exe_path = os.path.join(linux_path, executable)
        if os.access(exe_path, os.X_OK):  # check if file is executable
            with gzip.open(receipt_path, 'rb') as f:
                receipt_str = f.read().decode()
                receipt = json.loads(receipt_str)
                return (linux_path, executable, receipt['game']['title'])

#End of Itchio Scanner