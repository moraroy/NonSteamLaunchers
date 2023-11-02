import {
  ButtonItem,
  definePlugin,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  staticClasses,
  ToggleField,
} from "decky-frontend-lib";
import { useState, VFC } from "react";
import { FaRocket } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
   console.log('Content rendered');

   const [options, setOptions] = useState({
     epicGames: false,
     gogGalaxy: false,
     origin: false,
     uplay: false,
     battleNet: false,
     amazonGames: false,
     eaApp: false,
     legacyGames: false,
     itchIo: false,
     humbleGames: false,
     indieGala: false,
     rockstar: false,
     glyph: false,
     minecraft: false,
     psPlus: false,
     dmm: false,
     xboxGamePass: false,
     geforceNow: false,
     amazonLuna:false,
     netflix:false,
     hulu:false,
     disneyPlus:false,
     amazonPrimeVideo:false,
     youtube:false,
     twitch:false
   });

   const [progress, setProgress] = useState({ percent:0, status:'' });

   const [separateAppIds, setSeparateAppIds] = useState(false);

   const handleButtonClick = (name:string) => {
       setOptions((prevOptions) => ({
           ...prevOptions,
           [name]: !prevOptions[name],
       }));
   };

   const handleInstallClick = async () => {
       console.log('handleInstallClick called');

       const selectedLaunchers = Object.entries(options)
           .filter(([_, isSelected]) => isSelected)
           .map(([name, _]) => name.charAt(0).toUpperCase() + name.slice(1))
           .join(', ');

       setProgress({ percent:0, status:`Calling serverAPI...please be patient...this can take some time... Downloading and Installing ${selectedLaunchers}... Steam will restart Automatically` });

       console.log(`Selected options:${JSON.stringify(options)}`);

       try {
           const result = await serverAPI.callPluginMethod("install", {
               selected_options: options
           });

           if (result) {
               setProgress({ percent:100, status:'Installation successful!' });
               alert('Installation successful!');
           } else {
               setProgress({ percent:100, status:'Installation failed.' });
               alert('Installation failed.');
           }
       } catch (error) {
           setProgress({ percent:100, status:'Installation failed.' });
           console.error('Error calling _main method on server-side plugin:', error);
       }
   };

   const handleStartFreshClick = async () => {
       console.log('handleStartFreshClick called');

       // Call the install method on the server-side plugin with the appropriate arguments
       try {
           const result = await serverAPI.callPluginMethod("install", {
               selected_options: options
           });

           if (result) {
               setProgress({ percent:100, status:'Installation successful!' });
               alert('Installation successful!');
           } else {
               setProgress({ percent:100, status:'Installation failed.' });
               alert('Installation failed.');
           }
       } catch (error) {
           setProgress({ percent:100, status:'Installation failed.' });
           console.error('Error calling _main method on server-side plugin:', error);
       }
   };

   const optionsData = [
    { name: 'epicGames', label: 'Epic Games' },
    { name: 'gogGalaxy', label: 'Gog Galaxy' },
    { name: 'origin', label: 'Origin' },
    { name: 'uplay', label: 'Ubisoft Connect' },
    { name: 'battleNet', label: 'Battle.net' },
    { name: 'amazonGames', label: 'Amazon Games' },
    { name: 'eaApp', label: 'EA App' },
    { name: 'legacyGames', label: 'Legacy Games' },
    { name: 'itchIo', label: 'Itch.io' },
    { name: 'humbleGames', label: 'Humble Games' },
    { name: 'indieGala', label: 'IndieGala Client' },
    { name: 'minecraft', label: 'Minecraft' },
    { name: 'psPlus', label: 'Playstation Plus' },
    { name:'xboxGamePass', label:'Xbox Game Pass'},
    { name:'geforceNow', label:'GeForce Now'},
    { name:'amazonLuna',label:'Amazon Luna'},
    { name:'netflix',label:'Netflix'},
    { name:'hulu',label:'Hulu'},
    { name:'disneyPlus',label:'Disney+'},
    { name:'amazonPrimeVideo',label:'Amazon Prime Video'},
    { name:'youtube',label:'Youtube'},
    { name:'twitch',label:'Twitch'}
  ];

  const launcherOptions = optionsData.filter(({name}) => ['epicGames', 'gogGalaxy', 'uplay', 'battleNet', 'amazonGames', 'eaApp', 'legacyGames', 'humbleGames', 'indieGala', 'minecraft', 'psPlus'].includes(name));
  const streamingOptions = optionsData.filter(({name}) => ['xboxGamePass','geforceNow','amazonLuna','netflix','hulu','disneyPlus','amazonPrimeVideo','youtube', 'twitch'].includes(name));
 
  return (
    <>
      <PanelSectionRow style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
        Welcome to the decky plugin version of NonSteamLaunchers! I hope it works...
      </PanelSectionRow>
      <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px" }}>
        Thank you for everyone's support and contributions on the script itself, this is the plugin we have all been waiting for... installing your favorite launchers in the easiest way possible. Enjoy! P.S. A couple notes... you may need to restart your steam deck even after steam restarts the first time. This is a known bug im trying to fix. Some launchers are not available due to user input, still looking for way around this, thank you and please be patient as i add more features from the original script!
      </PanelSectionRow>
  
      <PanelSectionRow>
        <ToggleField label="Separate App IDs" checked={separateAppIds} onChange={setSeparateAppIds} />
      </PanelSectionRow>
  
      <PanelSectionRow>
        <progress value={progress.percent} max={100} />
        <div>{progress.status}</div>
      </PanelSectionRow>
  
      <PanelSection>
        <ButtonItem layout="below" onClick={handleInstallClick}>
          Install
        </ButtonItem>
  
        <ButtonItem layout="below" onClick={handleStartFreshClick}>
          Start Fresh
        </ButtonItem>
      </PanelSection>
  
      <PanelSection title="Game Launchers">
        <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px" }}>
          Here you choose your launchers you want to install and let NSL do the rest. Once Steam restarts your launchers will be in your library!
        </PanelSectionRow>
        <PanelSectionRow>
          {launcherOptions.map(({ name, label }) => (
            <ButtonItem
              className={options[name] ? 'selected' : ''}
              layout="below"
              onClick={() => handleButtonClick(name)}
            >
              <span className="checkmark">{options[name] ? '✓' : ''}</span>{' '}
              {label}
            </ButtonItem>
          ))}
        </PanelSectionRow>
      </PanelSection>
  
      <PanelSection title="Game and Movie Streaming">
        <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px" }}>
          Please install Google Chrome via the Discover Store in desktop mode first. NSL uses Chrome to launch these sites. Do NOT "Force Compatability" on these they will not open with proton.
        </PanelSectionRow>
        <PanelSectionRow>
          {streamingOptions.map(({ name, label }) => (
            <ButtonItem
              className={options[name] ? 'selected' : ''}
              layout="below"
              onClick={() => handleButtonClick(name)}
            >
              <span className="checkmark">{options[name] ? '✓' : ''}</span>{' '}
              {label}
            </ButtonItem>
          ))}
        </PanelSectionRow>
      </PanelSection>

      <style>{`
        .checkmark {
          color: green;
        }
        .selected {
          background-color: #eee;
        }
        progress {
          display:block;
          width: 100%;
          margin-top: 5px;
          height: 20px;
        }
        pre {
          white-space: pre-wrap;
        }
        .decky-ButtonItem {
          margin-bottom: 10px;
          border-bottom: none;
        }
        .decky-PanelSection {
          border-bottom: none;
        }
      `}</style>

    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
  return {
   title: <div className={staticClasses.Title}>NonSteamLaunchers</div>,
   content: (
       <Content serverAPI={serverApi} />
   ),
   icon: <FaRocket />,
  };
});