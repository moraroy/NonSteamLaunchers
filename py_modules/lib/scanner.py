#!/usr/bin/env python3
import os, json, decky_plugin
from base64 import b64encode
import externals.requests as requests
import externals.vdf as vdf
from externals.steamgrid import SteamGridDB
from scanners.ea_scanner import ea_scanner
from scanners.epic_scanner import epic_games_scanner
from scanners.ubisoft_scanner import ubisoft_scanner
from scanners.gog_scanner import gog_scanner
from scanners.battle_net_scanner import battle_net_scanner
from scanners.amazon_scanner import amazon_scanner
from scanners.itchio_scanner import itchio_games_scanner
from scanners.legacy_scanner import legacy_games_scanner
from scanners.rpw_scanner import rpw_scanner
from get_env_vars import refresh_env_vars

env_vars_path = f"{os.environ['HOME']}/.config/systemd/user/env_vars"
env_vars = {}

def initialiseVariables(env_vars):
    # Variables from NonSteamLaunchers.sh
    global steamid3 
    steamid3 = env_vars.get('steamid3')
    global logged_in_home
    logged_in_home = env_vars.get('logged_in_home')
    global compat_tool_name
    compat_tool_name = env_vars.get('compat_tool_name')
    global controller_config_path
    controller_config_path = env_vars.get('controller_config_path')

    #Scanner Variables
    global epic_games_launcher
    epic_games_launcher = env_vars.get('epic_games_launcher', '')
    global ubisoft_connect_launcher
    ubisoft_connect_launcher = env_vars.get('ubisoft_connect_launcher', '')
    global ea_app_launcher
    ea_app_launcher = env_vars.get('ea_app_launcher', '')
    global gog_galaxy_launcher
    gog_galaxy_launcher = env_vars.get('gog_galaxy_launcher', '')
    global bnet_launcher
    bnet_launcher = env_vars.get('bnet_launcher', '')
    global amazon_launcher
    amazon_launcher = env_vars.get('amazon_launcher', '')
    global itchio_launcher
    itchio_launcher = env_vars.get('itchio_launcher', '')
    global legacy_launcher
    legacy_launcher = env_vars.get('legacy_launcher', '')

    #Variables of the Launchers
    # Define the path of the Launchers
    global epicshortcutdirectory
    epicshortcutdirectory = env_vars.get('epicshortcutdirectory')
    global gogshortcutdirectory
    gogshortcutdirectory = env_vars.get('gogshortcutdirectory')
    global uplayshortcutdirectory
    uplayshortcutdirectory = env_vars.get('uplayshortcutdirectory')
    global battlenetshortcutdirectory
    battlenetshortcutdirectory = env_vars.get('battlenetshortcutdirectory')
    global eaappshortcutdirectory
    eaappshortcutdirectory = env_vars.get('eaappshortcutdirectory')
    global amazonshortcutdirectory
    amazonshortcutdirectory = env_vars.get('amazonshortcutdirectory')
    global itchioshortcutdirectory
    itchioshortcutdirectory = env_vars.get('itchioshortcutdirectory')
    global legacyshortcutdirectory
    legacyshortcutdirectory = env_vars.get('legacyshortcutdirectory')
    global humbleshortcutdirectory
    humbleshortcutdirectory = env_vars.get('humbleshortcutdirectory')
    global indieshortcutdirectory
    indieshortcutdirectory = env_vars.get('indieshortcutdirectory')
    global rockstarshortcutdirectory
    rockstarshortcutdirectory = env_vars.get('rockstarshortcutdirectory')
    global glyphshortcutdirectory
    glyphshortcutdirectory = env_vars.get('glyphshortcutdirectory')
    global minecraftshortcutdirectory
    minecraftshortcutdirectory = env_vars.get('minecraftshortcutdirectory')
    global psplusshortcutdirectory
    psplusshortcutdirectory = env_vars.get('psplusshortcutdirectory')
    global vkplayhortcutdirectory
    vkplayhortcutdirectory = env_vars.get('vkplayhortcutdirectory')
    global hoyoplayshortcutdirectory
    hoyoplayshortcutdirectory = env_vars.get('hoyoplayshortcutfirectory')
    global repaireaappshortcutdirectory 
    repaireaappshortcutdirectory = env_vars.get('repaireaappshortcutdirectory')
    #Streaming
    global chromedirectory
    chromedirectory = env_vars.get('chromedirectory')

#Vars
proxy_url = 'https://myproxycache-203e9b0bbe5b.herokuapp.com/api'
decky_shortcuts = {}

def scan():
    global decky_shortcuts
    global env_vars
    decky_shortcuts = {}
    if os.path.exists(env_vars_path):
        env_vars = refresh_env_vars()
        initialiseVariables(env_vars)
        add_launchers()
        epic_games_scanner(logged_in_home, epic_games_launcher, create_new_entry)
        ubisoft_scanner(logged_in_home, ubisoft_connect_launcher, create_new_entry)
        ea_scanner(logged_in_home, ea_app_launcher, create_new_entry)
        gog_scanner(logged_in_home, gog_galaxy_launcher, create_new_entry)
        battle_net_scanner(logged_in_home, bnet_launcher, create_new_entry)
        amazon_scanner(logged_in_home, amazon_launcher, create_new_entry)
        itchio_games_scanner(logged_in_home, itchio_launcher, create_new_entry)
        legacy_games_scanner(logged_in_home, legacy_launcher, create_new_entry)
        rpw_scanner(logged_in_home, create_new_entry)
    return decky_shortcuts

def addCustomSite(customSiteJSON):
    global decky_shortcuts
    decky_shortcuts = {}
    customSites = json.loads(customSiteJSON)
    decky_plugin.logger.info(customSites)
    refresh_env_vars()
    for site in customSites:
        customSiteName = site['siteName']
        customSiteURL = site['siteURL'].strip()
        cleanSiteURL = customSiteURL.replace('http://', '').replace('https://', '').replace('www.', '')
        chromelaunch_options = f'run --branch=stable --arch=x86_64 --command=/app/bin/chrome --file-forwarding com.google.Chrome @@u @@ --window-size=1280,800 --force-device-scale-factor=1.00 --device-scale-factor=1.00 --kiosk https://{cleanSiteURL}/ --chrome-kiosk-type=fullscreen --no-first-run --enable-features=OverlayScrollbar'
        create_new_entry(env_vars.get('chromedirectory'), customSiteName, chromelaunch_options, env_vars.get('chrome_startdir'), None)
    return decky_shortcuts


def check_if_shortcut_exists(display_name, exe_path, start_dir, launch_options):
    # Load the existing shortcuts
    vdf_path = f"{logged_in_home}/.steam/root/userdata/{steamid3}/config/shortcuts.vdf"
    
    # Check if the shortcuts file exists
    if os.path.exists(vdf_path):
        # If the file is not executable, write the shortcuts dictionary and make it executable
        if not os.access(vdf_path, os.X_OK):
            print("The file is not executable. Writing an empty shortcuts dictionary and making it executable.")
            with open(vdf_path, 'wb') as file:
                vdf.binary_dumps({'shortcuts': {}}, file)
            os.chmod(vdf_path, 0o755)
        else:
            # If the file exists, try to load it
            try:
                with open(vdf_path, 'rb') as file:
                    shortcuts = vdf.binary_loads(file.read())

                if any((s.get('appname') == display_name or s.get('AppName') == display_name) and (s.get('exe') == exe_path or s.get('Exe') == exe_path) and s.get('StartDir') == start_dir and s.get('LaunchOptions') == launch_options for s in shortcuts['shortcuts'].values()):
                    decky_plugin.logger.info(f"Existing shortcut found based on matching fields for game {display_name}. Skipping creation.")
                    return True
                else:
                    shortcuts = ''
            except Exception as e:
                print(f"Error reading shortcuts file: {e}")



# Add or update the proton compatibility settings
def add_compat_tool(launchoptions):
    if 'chrome' in launchoptions or '--appid 0' in launchoptions:
        return False
    else:
        return compat_tool_name


def create_new_entry(exe, appname, launchoptions, startingdir, launcher):
    global decky_shortcuts
    # Check if the launcher is installed
    if not exe or not appname or not startingdir:
        decky_plugin.logger.info(f"Skipping creation for {appname}. Missing fields: exe={exe}, appname={appname}, startingdir={startingdir}")
        return
    if check_if_shortcut_exists(appname, exe, startingdir, launchoptions):
        return

    # Initialize artwork variables
    icon, logo64, hero64, gridp64, grid64, launcher_icon = None, None, None, None, None, None

    # Skip artwork fetching for specific shortcuts
    if appname not in ["NonSteamLaunchers", "Repair EA App", "RemotePlayWhatever"]:
        # Get artwork
        game_id = get_game_id(appname)
        if game_id is not None:
            icon, logo64, hero64, gridp64, grid64, launcher_icon = get_sgdb_art(game_id, launcher)

    # Create a new entry for the Steam shortcut
    compatTool = add_compat_tool(launchoptions)
    decky_entry = {
        'appname': appname,
        'exe': exe,
        'StartDir': startingdir,
        'LaunchOptions': launchoptions,
        'CompatTool': compatTool,
        'WideGrid': grid64,
        'Grid': gridp64,
        'Hero': hero64,
        'Logo': logo64,
        'Icon': icon,
        'LauncherIcon': launcher_icon,  # Add launcher icon
        'Launcher': launcher,  # Add launcher information
    }
    decky_shortcuts[appname] = decky_entry
    decky_plugin.logger.info(f"Added new entry for {appname} to shortcuts.")


def add_launchers():
    create_new_entry(env_vars.get('epicshortcutdirectory'), 'Epic Games', env_vars.get('epiclaunchoptions'), env_vars.get('epicstartingdir'), None)
    create_new_entry(env_vars.get('gogshortcutdirectory'), 'GOG Galaxy', env_vars.get('goglaunchoptions'), env_vars.get('gogstartingdir'), None)
    create_new_entry(env_vars.get('uplayshortcutdirectory'), 'Ubisoft Connect', env_vars.get('uplaylaunchoptions'), env_vars.get('uplaystartingdir'), None)
    create_new_entry(env_vars.get('battlenetshortcutdirectory'), 'Battle.net', env_vars.get('battlenetlaunchoptions'), env_vars.get('battlenetstartingdir'), None)
    create_new_entry(env_vars.get('eaappshortcutdirectory'), 'EA App', env_vars.get('eaapplaunchoptions'), env_vars.get('eaappstartingdir'), None)
    create_new_entry(env_vars.get('amazonshortcutdirectory'), 'Amazon Games', env_vars.get('amazonlaunchoptions'), env_vars.get('amazonstartingdir'), None)
    create_new_entry(env_vars.get('itchioshortcutdirectory'), 'itch.io', env_vars.get('itchiolaunchoptions'), env_vars.get('itchiostartingdir'), None)
    create_new_entry(env_vars.get('legacyshortcutdirectory'), 'Legacy Games', env_vars.get('legacylaunchoptions'), env_vars.get('legacystartingdir'), None)
    create_new_entry(env_vars.get('humbleshortcutdirectory'), 'Humble Bundle', env_vars.get('humblelaunchoptions'), env_vars.get('humblestartingdir'), None)
    create_new_entry(env_vars.get('indieshortcutdirectory'), 'IndieGala Client', env_vars.get('indielaunchoptions'), env_vars.get('indiestartingdir'), None)
    create_new_entry(env_vars.get('rockstarshortcutdirectory'), 'Rockstar Games Launcher', env_vars.get('rockstarlaunchoptions'), env_vars.get('rockstarstartingdir'), None)
    create_new_entry(env_vars.get('glyphshortcutdirectory'), 'Glyph', env_vars.get('glyphlaunchoptions'), env_vars.get('glyphstartingdir'), "Glyph")
    create_new_entry(env_vars.get('minecraftshortcutdirectory'), 'Minecraft: Java Edition', env_vars.get('minecraftlaunchoptions'), env_vars.get('minecraftstartingdir'), None)
    create_new_entry(env_vars.get('psplusshortcutdirectory'), 'Playstation Plus', env_vars.get('pspluslaunchoptions'), env_vars.get('psplusstartingdir'), None)
    create_new_entry(env_vars.get('vkplayhortcutdirectory'), 'VK Play', env_vars.get('vkplaylaunchoptions'), env_vars.get('vkplaystartingdir'), None)
    create_new_entry(env_vars.get('hoyoplayshortcutdirectory'), 'HoYoPlay', env_vars.get('hoyoplaylaunchoptions'), env_vars.get('hoyoplaystartingdir'), None)
    create_new_entry(env_vars.get('repaireaappshortcutdirectory'), 'Repair EA App', env_vars.get('repaireaapplaunchoptions'), env_vars.get('repaireaappstartingdir'), None)



def get_sgdb_art(game_id, launcher):
    decky_plugin.logger.info(f"Downloading icon artwork...")
    icon = download_artwork(game_id, "icons")
    decky_plugin.logger.info(f"Downloading logo artwork...")
    logo64 = download_artwork(game_id, "logos")
    decky_plugin.logger.info(f"Downloading hero artwork...")
    hero64 = download_artwork(game_id, "heroes")
    decky_plugin.logger.info("Downloading grids artwork of size 600x900...")
    gridp64 = download_artwork(game_id, "grids", "600x900")
    decky_plugin.logger.info("Downloading grids artwork of size 920x430...")
    grid64 = download_artwork(game_id, "grids", "920x430")
    
    # Fetch launcher icon based on the launcher type
    launcher_icons = {
        "Epic Games": "5255885",
        "Amazon Games": "5255884",
        "GOG Galaxy": "34605",
        "Battle.net": "5248250",
        "EA App": "5306742",
        "itch.io": "5259585",
        "Legacy Games": "5438208",
        "Ubisoft Connect": "5270094"
    }
    
    launcher_icon = download_artwork(launcher_icons.get(launcher, ""), "icons")
    
    return icon, logo64, hero64, gridp64, grid64, launcher_icon




def download_artwork(game_id, art_type, dimensions=None):
    # If the result is not in the cache, make the API call
    decky_plugin.logger.info(f"Game ID: {game_id}")
    url = f"{proxy_url}/{art_type}/game/{game_id}"
    if dimensions:
        url += f"?dimensions={dimensions}"
    decky_plugin.logger.info(f"Sending request to: {url}")

    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        decky_plugin.logger.info(f"Error making API call: {e}")
        return None

    # Continue with the rest of your function using `data`
    for artwork in data['data']:
        if game_id == 5297303 and dimensions == "600x900":  # get a better poster for Xbox Game Pass
            image_url = "https://cdn2.steamgriddb.com/thumb/eea5656d3244578f512f32cb4043792a.jpg"
        else:
            image_url = artwork['thumb']
        decky_plugin.logger.info(f"Downloading image from: {image_url}")
        try:
            response = requests.get(image_url, stream=True)
            response.raise_for_status()
            if response.status_code == 200:
                return b64encode(response.content).decode('utf-8')
        except requests.exceptions.RequestException as e:
            decky_plugin.logger.info(f"Error downloading image: {e}")
            if art_type == 'icons':
                return download_artwork(game_id, 'icons_ico', dimensions)
    return None

def get_game_id(game_name):
    if game_name == "Disney+":  # hardcode disney+ game ID
        return 5260961
    decky_plugin.logger.info(f"Searching for game ID for: {game_name}")
    try:
        url = f"{proxy_url}/search/{game_name}"
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        if data['data']:
            game_id = data['data'][0]['id']
            decky_plugin.logger.info(f"Found game ID: {game_id}")
            return game_id
        decky_plugin.logger.info("No game ID found")
        return "default_game_id"  # Return a default value when no games are found
    except requests.exceptions.RequestException as e:
        decky_plugin.logger.info(f"Error searching for game ID: {e}")
        return "default_game_id"  # Return a default value in case of an error