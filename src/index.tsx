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
import { useState, VFC } from "react";
import { RxRocket } from "react-icons/rx";
import { notify } from "./hooks/notify";
import { CustomSiteModal } from "./components/modals/customSiteModal";
import { useSettings } from './hooks/useSettings'
import { LauncherInstallModal } from "./components/modals/launcherInstallModal";
import { StreamingInstallModal } from "./components/modals/streamingInstallModal";
import { StartFreshModal } from "./components/modals/startFreshModal";
import { autoscan, scan } from "./hooks/scan";

const initialOptions = [
  { name: 'epicGames', label: 'Epic Games', URL: '', streaming: false, enabled: false },
  { name: 'gogGalaxy', label: 'Gog Galaxy', URL: '', streaming: false, enabled: false },
  { name: 'uplay', label: 'Ubisoft Connect', URL: '', streaming: false, enabled: false },
  { name: 'battleNet', label: 'Battle.net', URL: '', streaming: false, enabled: false },
  { name: 'amazonGames', label: 'Amazon Games', URL: '', streaming: false, enabled: false },
  { name: 'eaApp', label: 'EA App', URL: '', streaming: false, enabled: false },
  { name: 'legacyGames', label: 'Legacy Games', URL: '', streaming: false, enabled: false },
  { name: 'humbleGames', label: 'Humble Games', URL: '', streaming: false, enabled: false },
  { name: 'indieGala', label: 'IndieGala Client', URL: '', streaming: false, enabled: false },
  { name: 'psPlus', label: 'Playstation Plus', URL: '', streaming: false, enabled: false },
  { name: 'xboxGamePass', label: 'Xbox Game Pass', URL: 'https://www.xbox.com/play', streaming: true, enabled: false },
  { name: 'fortnite', label: 'Fortnite (xCloud)', URL: 'https://www.xbox.com/en-US/play/games/fortnite/BT5P2X999VH2/', streaming: true, enabled: false },
  { name: 'geforceNow', label: 'GeForce Now', URL: 'https://play.geforcenow.com', streaming: true, enabled: false },
  { name: 'amazonLuna', label: 'Amazon Luna', URL: 'https://luna.amazon.com/', streaming: true, enabled: false },
  { name: 'movieweb', label: 'movie-web', URL: 'https://mw.lonelil.ru/', streaming: true, enabled: false },
  { name: 'netflix', label: 'Netflix', URL: 'https://www.netflix.com', streaming: true, enabled: false },
  { name: 'hulu', label: 'Hulu', URL: 'https://www.hulu.com/welcome', streaming: true, enabled: false },
  { name: 'disneyPlus', label: 'Disney+', URL: 'https://www.disneyplus.com', streaming: true, enabled: false },
  { name: 'amazonPrimeVideo', label: 'Amazon Prime Video', URL: 'https://www.amazon.com/primevideo', streaming: true, enabled: false },
  { name: 'youtube', label: 'Youtube', URL: 'https://www.youtube.com', streaming: true, enabled: false },
  { name: 'twitch', label: 'Twitch', URL: 'https://www.twitch.tv/', streaming: true, enabled: false }
];

   

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  console.log('Content rendered');
   
   const launcherOptions = initialOptions.filter((option) => option.streaming === false);
   const streamingOptions = initialOptions.filter((option) => option.streaming === true);
   
  const { settings, setAutoScan } = useSettings(serverAPI);

  //Random Greetings
  const greetings = ["Is it just me? Or does the Rog Ally kinda s... actually, nevermind.", "Welcome to NSL!", "Hello, happy gaming!", "Good to see you again!", "Wow! You look amazing today...is that a new haircut?", "Hey! Thinkin' of changing the name of NSL to 'Nasty Lawn Chairs'. What do you think?", "'A'... that other handheld is a little 'Sus' if you ask me. I don't trust him.", "What the heck is a Lenovo anyway? It needs to 'Go' and get outta here.", "Why couldn't Ubisoft access the servers?... Cuz it couldnt 'Connect'.", "Some said it couldnt be done, making a plugin like this... haters gonna hate, haters gonna marinate.", "Dont trust anyone named DarthUbi nor his Sythlinks.", "Just wanted to say, I love you to the sysmoon and back.", "Whats further? Half Life 3 or Gog Galaxy?", "I went on a date with a linux jedi once... it didnt work out cuz they kept kept trying to force compatability.", "NSL has updated succesfully. It now has more launchers than Elon Musk.", "You installed another launcher? ...pff, when are you going to learn bro?", "So how are we wasting our time today?"];

  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  //End of Random Greetings

  const [isFocused, setIsFocused] = useState(false);

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
      
      <PanelSection title= "Game Scanner">
        <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px" }}>
          NSL can automatically detect and add shortcuts for the games you install in your non steam launchers, below you can enable automatic scanning or trigger a manual scan.
        </PanelSectionRow>
        <ToggleField
          label="Auto Scan Games"
          checked= {settings.autoscan}
          onChange={(value) => {
            setAutoScan(value)
            if (value === true) {
              console.log(`Autoscan is ${settings.autoscan}`)
              autoscan();
            }
          }}
        />
        <ButtonItem layout="below" onClick={() => scan()} disabled={settings.autoscan}>
          Manual Scan
        </ButtonItem>
      </PanelSection>

      <Focusable
        focusWithinClassName="gpfocuswithin"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onActivate={() => { window.open('https://github.com/moraroy/NonSteamLaunchers-On-Steam-Deck', '_blank'); }}
      >
        <div
          style={{
            backgroundColor: "transparent",
            display: "flex",
            flexDirection: "column",
            padding: "0.5em",
            width: "95%",
            margin: 0,
            outline: isFocused ? '2px solid rgba(255, 255, 255, 0.5)' : 'none',
          }}
        >
          <span style={{ fontSize: "12px", marginBottom: "10px", textAlign: "center" }}>
            The NSLGameScanner currently supports Epic Games Launcher, Ubisoft Connect, Gog Galaxy, The EA App, Battle.net and Amazon Games.
          </span>
        </div>
      </Focusable>
    </div>
);
};

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