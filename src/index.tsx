import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  ToggleField,
  showModal,
  Focusable
} from "decky-frontend-lib";
import { useState, useEffect, VFC } from "react";
import { RxRocket } from "react-icons/rx";
import { notify } from "./hooks/notify";
import { CustomSiteModal } from "./components/modals/customSiteModal";
import { useSettings } from './hooks/useSettings'
import { LauncherInstallModal } from "./components/modals/launcherInstallModal";
import { StreamingInstallModal } from "./components/modals/streamingInstallModal";
import { StartFreshModal } from "./components/modals/startFreshModal";
import { RestoreGameSavesModal } from "./components/modals/restoreGameSavesModal";
import { sitesList } from "./hooks/siteList";
import { autoscan, scan } from "./hooks/scan";

const initialOptions = sitesList;

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  console.log('Content rendered');
   
  const launcherOptions = initialOptions.filter((option) => option.streaming === false);
  const streamingOptions = initialOptions.filter((option) => option.streaming === true);
   
  const { settings, setAutoScan } = useSettings(serverAPI);

  // Random Greetings
  const greetings = ["Is it just me? Or does the Rog Ally kinda s... actually, nevermind.", "Welcome to NSL!", "Hello, happy gaming!", "Good to see you again!", "Wow! You look amazing today...is that a new haircut?", "Hey! Thinkin' of changing the name of NSL to 'Nasty Lawn Chairs'. What do you think?", "'A'... that other handheld is a little 'Sus' if you ask me. I don't trust him.", "What the heck is a Lenovo anyway? It needs to 'Go' and get outta here.", "Why couldn't Ubisoft access the servers?... Cuz it couldnt 'Connect'.", "Some said it couldnt be done, making a plugin like this... haters gonna hate, haters gonna marinate.", "I hope you have a blessed day today!", "Just wanted to say, I love you to the sysmoon and back.", "Whats further? Half Life 3 or Gog Galaxy?", "I went on a date with a linux jedi once... it didnt work out cuz they kept kept trying to force compatability.", "NSL has updated succesfully. It now has more launchers than Elon Musk.", "You installed another launcher? ...pff, when are you going to learn bro?", "So how are we wasting our time today?"];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  // End of Random Greetings

  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isManualScanComplete, setIsManualScanComplete] = useState(false);
  const [isAutoScanDisabled, setIsAutoScanDisabled] = useState(false);


  const handleScanClick = async () => {
    setIsLoading(true); // Set loading state to true
    setIsAutoScanDisabled(true); // Disable the auto-scan toggle
    await scan(() => setIsManualScanComplete(true)); // Perform the scan action and set completion state
    setIsLoading(false); // Set loading state to false
    setIsAutoScanDisabled(false); // Re-enable the auto-scan toggle
  };
  

  useEffect(() => {
    if (isManualScanComplete) {
      setIsManualScanComplete(false); // Reset the completion state
    }
  }, [isManualScanComplete]);

  return (
    <div className="decky-plugin">
      <PanelSectionRow style={{ fontSize: "10px", fontStyle: "italic", fontWeight: "bold", marginBottom: "10px", textAlign: "center" }}>
        {randomGreeting}
      </PanelSectionRow>
      <PanelSection title="Install">
        <ButtonItem layout="below" onClick={() => showModal(<LauncherInstallModal serverAPI={serverAPI} launcherOptions={launcherOptions}  />)}>
          Game Launchers
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => showModal(<StreamingInstallModal serverAPI={serverAPI} streamingOptions={streamingOptions}/>)}>
          Streaming Sites
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => showModal(<CustomSiteModal serverAPI={serverAPI}/>)}>
          Custom Website Shortcut
        </ButtonItem>
        <ButtonItem layout="below" onClick={() => showModal(<StartFreshModal serverAPI={serverAPI} />)}>
          Start Fresh
        </ButtonItem>
        {/* <ButtonItem layout="below" onClick={() => showModal(<RestoreGameSavesModal serverAPI={serverAPI} />)}>
          Restore Game Saves
        </ButtonItem> */}
      </PanelSection>

      
      <PanelSection title="Game Scanner">
        <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px" }}>
          NSL can automatically detect and add shortcuts for the games you install in your non-steam launchers in real time. Below, you can enable automatic scanning or trigger a manual scan. During a manual scan only, your game saves will be backed up here: /home/deck/NSLGameSaves.
        </PanelSectionRow>
        <ToggleField
          label="Auto Scan Games"
          checked={settings.autoscan}
          onChange={(value) => {
            setAutoScan(value);
            if (value === true) {
              console.log(`Autoscan is ${settings.autoscan}`);
              autoscan();
            }
          }}
          disabled={isAutoScanDisabled}
        />
        <ButtonItem layout="below" onClick={handleScanClick} disabled={isLoading || settings.autoscan}>
          {isLoading ? 'Scanning...' : 'Manual Scan'}
        </ButtonItem>
      </PanelSection>


  
 
      <div
        style={{
          backgroundColor: "transparent",
          display: "flex",
          flexDirection: "column",
          padding: "0.5em",
          width: "95%",
          margin: 0,
        }}
      >
        <span style={{ fontSize: "12px", marginBottom: "10px", textAlign: "center" }}>
          The NSLGameScanner currently supports Epic Games Launcher, Ubisoft Connect, Gog Galaxy, The EA App, Battle.net, Amazon Games, Itch.io and Legacy Games.
          <Focusable
            focusWithinClassName="gpfocuswithin"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onActivate={() => { window.open('https://github.com/moraroy/NonSteamLaunchers-On-Steam-Deck', '_blank'); }}
          >
            <a style={{ textDecoration: 'underline', color: 'inherit', outline: isFocused ? '2px solid rgba(255, 255, 255, 0.5)' : 'none' }}>
              click here for more info!
            </a>
          </Focusable>
        </span>
      </div>






  
      <PanelSection title="Support and Donations vvv">
        <div
          style={{
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            padding: "0.5em",
            width: "95%",
            margin: 0,
          }}
        >
          <div style={{ marginTop: '5px', textAlign: 'center', fontSize: "12px" }}>
            <p>NSL will always be free and open source...but if you're so inclined, all sponsors & donations are humbly appreciated and accepted. Thank you so much!</p>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <ButtonItem layout="below" onClick={() => window.open('https://www.patreon.com/moraroy', '_blank')}>
                <img src="https://seeklogo.com/images/P/patreon-logo-C0B52F951B-seeklogo.com.png" alt="Patreon" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                Patreon
              </ButtonItem>
              <ButtonItem layout="below" onClick={() => window.open('https://ko-fi.com/moraroy#checkoutModal', '_blank')}>
                <img src="https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/64f1a9ddd0246590df69e9ef_ko-fi_logo_02-p-500.png" alt="Ko-fi" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                Ko-fi
              </ButtonItem>
              <ButtonItem layout="below" onClick={() => window.open('https://github.com/sponsors/moraroy', '_blank')}>
                <img src="https://cdn.pixabay.com/photo/2022/01/30/13/33/github-6980894_1280.png" alt="GitHub" style={{ width: '20px', height: '20px', marginRight: '10px' }} />
                GitHub
              </ButtonItem>
            </div>
          </div>
        </div>
      </PanelSection>
    </div>
  );
}  

export default definePlugin((serverApi: ServerAPI) => {
  autoscan();
  notify.setServer(serverApi);
  return {
    title: <div className={staticClasses.Title}>NonSteamLaunchers</div>,
    alwaysRender: true,
    content: (
        <Content serverAPI={serverApi} />
    ),
    icon: <RxRocket />,
  };
});