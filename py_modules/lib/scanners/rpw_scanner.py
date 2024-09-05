import os, json, decky_plugin

def rpw_scanner(logged_in_home, create_new_entry):
    desktop_file_path = f"{logged_in_home}/.local/share/applications/RemotePlayWhatever.desktop"

    if os.path.exists(desktop_file_path):
        decky_plugin.logger.info(f"Found .desktop file at {desktop_file_path}")
        with open(desktop_file_path, 'r') as file:
            lines = file.readlines()

        # Extract necessary information from the .desktop file
        exec_path = ""
        name = ""
        icon_path = ""
        launch_options = ""
        for line in lines:
            line = line.strip()  # Remove leading and trailing whitespace
            if line.startswith("Exec="):
                exec_path = line.split("Exec=", 1)[1].strip()
                if " " in exec_path:
                    parts = exec_path.split(" ", 1)
                    exec_path = parts[0].strip('"')
                    launch_options = parts[1].strip()
                decky_plugin.logger.info(f"Extracted Exec Path: {exec_path}")
                decky_plugin.logger.info(f"Extracted Launch Options: {launch_options}")
            elif line.startswith("Name="):
                name = line.split("Name=", 1)[1].strip()
                decky_plugin.logger.info(f"Extracted Name: {name}")
            elif line.startswith("Icon="):
                icon_path = line.split("Icon=", 1)[1].strip()
                decky_plugin.logger.info(f"Extracted Icon Path: {icon_path}")

        # Create new entry
        if exec_path and name:
            start_dir = os.path.dirname(exec_path)
            exec_path = f'"{exec_path}"'
            start_dir = f'"{start_dir}/"'
            decky_plugin.logger.info(f"Creating new entry with exe={exec_path}, appname={name}, start_dir={start_dir}, launch_options={launch_options}")
            create_new_entry(exec_path, name, launch_options, start_dir, None)
            decky_plugin.logger.info(f"Added new entry for {name} to shortcuts.")
        else:
            decky_plugin.logger.info("Required fields missing in .desktop file. Skipping.")
    else:
        decky_plugin.logger.info("RemotePlayWhatever.desktop file not found. Skipping.")