import { notify } from "./notify";

// Shortcut Creation Code
// Define the createShortcut function
export async function createShortcut(game: any) {
  const { appid, appname, exe, StartDir, LaunchOptions, CompatTool, Grid, WideGrid, Hero, Logo, Icon, LauncherIcon, Launcher } = game;
  
  // No need to format exe and StartDir here as it's already done in Python
  const formattedExe = exe;
  const formattedStartDir = StartDir;
  const launchOptions = LaunchOptions;

  console.log(`Creating shortcut ${appname}`);
  console.log(`Game details: Name= ${appname}, ID=${appid}, exe=${formattedExe}, StartDir=${formattedStartDir}, launchOptions=${launchOptions}`);

  // Use the addShortcut method directly
  const appId = await SteamClient.Apps.AddShortcut(appname, formattedExe, formattedStartDir, launchOptions);
  if (appId) {
    const defaultIconUrl = "https://raw.githubusercontent.com/moraroy/NonSteamLaunchersDecky/main/assets/logo.png";
    const gameIconUrl = Icon ? `data:image/x-icon;base64,${Icon}` : defaultIconUrl;  // Use the base64-encoded icon or default icon
    const launcherIconUrl = LauncherIcon ? `data:image/x-icon;base64,${LauncherIcon}` : null;  // Use the base64-encoded launcher icon or null

    // Pass both icons to the notification
    if (launcherIconUrl) {
      notify.toast("New Shortcut Created", `${appname} has been added to your library!`, { gameIconUrl, launcherIconUrl });
    } else {
      notify.toast("New Shortcut Created", `${appname} has been added to your library!`, { gameIconUrl });
    }
    
    console.log(`AppID for ${appname} = ${appId}`);
    SteamClient.Apps.SetShortcutName(appId, appname);
    SteamClient.Apps.SetAppLaunchOptions(appId, launchOptions);
    SteamClient.Apps.SetShortcutExe(appId, formattedExe);
    SteamClient.Apps.SetShortcutStartDir(appId, formattedStartDir);

    // Explicitly set the icon for the game shortcut
    if (Icon && !Launcher) {
      SteamClient.Apps.SetShortcutIcon(appId, `data:image/x-icon;base64,${Icon}`);
    }

    let AvailableCompatTools = await SteamClient.Apps.GetAvailableCompatTools(appId);
    let CompatToolExists: boolean = AvailableCompatTools.some((e: { strToolName: any; }) => e.strToolName === CompatTool);
    if (CompatTool && CompatToolExists) {
      SteamClient.Apps.SpecifyCompatTool(appId, CompatTool);
    } else if (CompatTool) {
      SteamClient.Apps.SpecifyCompatTool(appId, 'proton_experimental');
    }
    SteamClient.Apps.SetCustomArtworkForApp(appId, Hero, 'png', 1);
    SteamClient.Apps.SetCustomArtworkForApp(appId, Logo, 'png', 2);
    SteamClient.Apps.SetCustomArtworkForApp(appId, Grid, 'png', 0);
    SteamClient.Apps.SetCustomArtworkForApp(appId, WideGrid, 'png', 3);
    SteamClient.Apps.AddUserTagToApps([appId], "NonSteamLaunchers");
    return true;
  } else {
    console.log(`Failed to create shortcut for ${appname}`);
    return false;
  }
}
// End of Shortcut Creation Code
