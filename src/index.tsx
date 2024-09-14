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
import { autoscan, scan } from "./hooks/scan";

const initialOptions = [
  { name: 'epicGames', label: 'Epic Games', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/164fbf608021ece8933758ee2b28dd7d.jpg' },
  { name: 'gogGalaxy', label: 'Gog Galaxy', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/ce016f59ecc2366a43e1c96a4774d167.jpg' },
  { name: 'uplay', label: 'Ubisoft Connect', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/525d57e5f56f04be298e821454ced9bc.png' },
  { name: 'battleNet', label: 'Battle.net', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/9f319422ca17b1082ea49820353f14ab.jpg' },
  { name: 'amazonGames', label: 'Amazon Games', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/a70145bf8b173e4496b554ce57969e24.jpg' },
  { name: 'eaApp', label: 'EA App', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/6458ed5e1bb03b8da47c065c2f647b26.jpg' },
  { name: 'legacyGames', label: 'Legacy Games', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/86cfeb447e7f474a00adb7423c605875.jpg' },
  { name: 'itchIo', label: 'Itch.io', URL: '', streaming: false, enabled: false, urlimage: 'https://i.pcmag.com/imagery/reviews/044PXMK6FlED1dNwOXkecXV-4.fit_scale.size_1028x578.v1597354669.jpg' },
  { name: 'humbleGames', label: 'Humble Games', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/4cb3ded67cb7a539395ab873354a01c1.jpg' },
  { name: 'indieGala', label: 'IndieGala Client', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/8348173ba70a643e9d0077c1605ce0ad.jpg' },
  { name: 'rockstarGamesLauncher', label: 'Rockstar Games Launcher', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/60b4ddba6215df686ff6ab71d0c078e9.jpg' },
  { name: 'psPlus', label: 'Playstation Plus', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/6c037a13a7e2d089a0f88f86b6405daf.jpg' },
  { name: 'hoyoPlay', label: 'HoYoPlay', URL: '', streaming: false, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/3a4cffbfa1ae7220344b83ea754c46c4.jpg' },
  { name: 'remotePlayWhatever', label: 'RemotePlayWhatever', URL: '', streaming: false, enabled: false, urlimage: 'https://opengraph.githubassets.com/68a584618d805217b103796afb7b13309abf7f9199e7299c9d31d4402184e963/m4dEngi/RemotePlayWhatever' },
  { name: 'xboxGamePass', label: 'Xbox Game Pass', URL: 'https://www.xbox.com/play', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/167b7d08b38facb1c06185861a5845dd.jpg' },
  { name: 'fortnite', label: 'Fortnite (xCloud)', URL: 'https://www.xbox.com/en-US/play/games/fortnite/BT5P2X999VH2/', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/560cc70f255b94b8408709e810914593.jpg' },
  { name: 'geforceNow', label: 'GeForce Now', URL: 'https://play.geforcenow.com', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/5e7e6e76699ea804c65b0c37974c660c.jpg' },
  { name: 'amazonLuna', label: 'Amazon Luna', URL: 'https://luna.amazon.com/', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/5966577c1d725b37c26c3f7aa493dd9c.jpg' },
  { name: 'netflix', label: 'Netflix', URL: 'https://www.netflix.com', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/119f6887f5ebfd6d5b40213819263e68.jpg' },
  { name: 'hulu', label: 'Hulu', URL: 'https://www.hulu.com/welcome', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/4bbddbaea593148384a27a8dcf498d30.jpg' },
  { name: 'disneyPlus', label: 'Disney+', URL: 'https://www.disneyplus.com', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/0dad24dc5419076f64f2ba93833b354e.png' },
  { name: 'amazonPrimeVideo', label: 'Amazon Prime Video', URL: 'https://www.amazon.com/primevideo', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/hero_thumb/5e7cefa9b606dcd7b0faa082d82cdb1d.jpg' },
  { name: 'youtube', label: 'Youtube', URL: 'https://www.youtube.com', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/786929ce1b2e187510aca9b04a0f7254.jpg' },
  { name: 'twitch', label: 'Twitch', URL: 'https://www.twitch.tv/', streaming: true, enabled: false, urlimage: 'https://cdn2.steamgriddb.com/thumb/accbfd0ef1051b082dc4ae223cf07da7.jpg' }
];



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

  const handleScanClick = async () => {
    setIsLoading(true); // Set loading state to true
    await scan(() => setIsManualScanComplete(true)); // Perform the scan action and set completion state
    setIsLoading(false); // Set loading state to false
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
      </PanelSection>
      
      <PanelSection title="Game Scanner">
        <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px" }}>
          NSL can automatically detect and add shortcuts for the games you install in your non-steam launchers in real time. Below, you can enable automatic scanning or trigger a manual scan. During the scan, your game saves will be backed up here: /home/deck/NSLGameSaves.
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
            <a style={{ textDecoration: 'inherit', outline: isFocused ? '2px solid rgba(255, 255, 255, 0.5)' : 'none' }}>
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