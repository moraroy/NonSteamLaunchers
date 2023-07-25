import {
  ButtonItem,
  definePlugin,
  findSP,
  Menu,
  MenuItem,
  ModalRoot,
  ModalRootProps,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showContextMenu,
  showModal,
  staticClasses,
  TextField,
  ToggleField
} from "decky-frontend-lib";
import { useEffect, useState, VFC } from "react";
import { FaRocket } from "react-icons/fa";

type SearchModalProps = ModalRootProps & {
  setModalResult?(result: string[]): void;
  promptText: string;
};


const SearchModal: VFC<SearchModalProps> = ({
  closeModal,
  setModalResult,
  promptText
}) => {
  console.log('SearchModal rendered');

  const [searchText, setSearchText] = useState('');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = () => {
    // Split the entered text by commas and trim any whitespace
    const websites = searchText.split(',').map((website) => website.trim());
    console.log(`websites: ${JSON.stringify(websites)}`);
    setModalResult && setModalResult(websites);
    closeModal && closeModal();
  };

  return (
    <ModalRoot closeModal={handleSubmit}>
      <form>
        <TextField
          focusOnMount={true}
          label="Websites"
          placeholder={promptText}
          onChange={handleTextChange}
        />
        <p>You can separate multiple websites by using commas.</p>
        <button type="button" onClick={handleSubmit}>Submit</button>
      </form>
    </ModalRoot>
  );
};

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  console.log('Content rendered');

const [options, setOptions] = useState({
  "Epic Games": false,
  "GOG Galaxy": false,
  "Origin": false,
  "Uplay": false,
  "Battle.net": false,
  "Amazon Games": false,
  "EA App": false,
  "Legacy Games": false,
  "itch.io": false,
  "Humble Games Collection": false,
  "IndieGala": false,
  "Rockstar Games Launcher": false,
  "Glyph Launcher": false,
  "Minecraft": false,
  "Playstation Plus": false,
  "DMM Games": false,
  "Xbox Game Pass": false,
  "GeForce Now": false,
  "Amazon Luna": false,
  "Netflix": false,
  "Hulu": false,
  "Disney+": false,
  "Amazon Prime Video": false,
  "Youtube": false
});

   const [progress, setProgress] = useState({ percent: 0, status: '' });

   const [separateAppIds, setSeparateAppIds] = useState(false);

   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

   const [clickedButton, setClickedButton] = useState('');

   const [customWebsites, setCustomWebsites] = useState<string[]>([]);
   useEffect(() => {
    console.log(`customWebsites updated: ${JSON.stringify(customWebsites)}`);
  }, [customWebsites]);

  const handleButtonClick = (name: string) => {
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

     setProgress({ percent: 0, status: `Calling serverAPI... Installing ${selectedLaunchers}` });

     console.log(`Selected options: ${JSON.stringify(options)}`);
     console.log(`customWebsites: ${JSON.stringify(customWebsites)}`);

     try {
       const result = await serverAPI.callPluginMethod("install", {
         selected_options: options,
         custom_websites: customWebsites,
         separate_app_ids: separateAppIds,
         start_fresh: true // Pass true for the start_fresh parameter
       });
   
       if (result) {
         setProgress({ percent: 100, status: 'Installation successful!' });
         alert('Installation successful!');
       } else {
         setProgress({ percent: 100, status: 'Installation failed.' });
         alert('Installation failed.');
       }
     } catch (error) {
       setProgress({ percent: 100, status: 'Installation failed.' });
       console.error('Error calling _main method on server-side plugin:', error);
     }
   };


   const handleStartFreshClick = async () => {
    console.log('handleStartFreshClick called');

    // Call the install method on the server-side plugin with the appropriate arguments
    try {
      const result = await serverAPI.callPluginMethod("install", {
        selected_options: options,
        custom_websites: customWebsites,
        separate_app_ids: separateAppIds,
        start_fresh: true // Pass true for the start_fresh parameter
      });

      if (result) {
        setProgress({ percent: 100, status: 'Installation successful!' });
        alert('Installation successful!');
      } else {
        setProgress({ percent: 100, status: 'Installation failed.' });
        alert('Installation failed.');
      }
    } catch (error) {
      setProgress({ percent: 100, status: 'Installation failed.' });
      console.error('Error calling _main method on server-side plugin:', error);
    }
  };

  const handleCreateWebsiteShortcutClick = async () => {
    console.log('handleCreateWebsiteShortcutClick called');
  
    setClickedButton('createWebsiteShortcut');
  
    const websites = await showModal(
      <SearchModal
        closeModal={() => setIsSearchModalOpen(false)}
        setModalResult={(result) => {
          console.log(`result: ${JSON.stringify(result)}`);
          if (clickedButton === 'createWebsiteShortcut') {
            // Handle result for createWebsiteShortcut button
            setCustomWebsites(result);
          }
          setIsSearchModalOpen(false);
        }}
        promptText={"Enter website"}
      />,
      findSP()
    );
  };
   
   const optionsData = [
    { name: "Epic Games", label: "Epic Games" },
    { name: "GOG Galaxy", label: "GOG Galaxy" },
    { name: "Origin", label: "Origin" },
    { name: "Uplay", label: "Uplay" },
    { name: "Battle.net", label: "Battle.net" },
    { name: "Amazon Games", label: "Amazon Games" },
    { name: "EA App", label: "EA App" },
    { name: "Legacy Games", label: "Legacy Games" },
    { name: "itch.io", label: "itch.io" },
    { name: "Humble Games Collection", label: "Humble Games Collection" },
    { name: "IndieGala", label: "IndieGala" },
    { name: "Rockstar Games Launcher", label: "Rockstar Games Launcher" },
    { name: "Glyph Launcher", label: "Glyph Launcher" },
    { name: "Minecraft", label: "Minecraft" },
    { name: "Playstation Plus", label: "Playstation Plus" },
    { name: "DMM Games", label: "DMM Games" },
    { name: "Xbox Game Pass", label: "Xbox Game Pass" },
    { name: "GeForce Now", label: "GeForce Now" },
    { name: "Amazon Luna", label: "Amazon Luna" },
    { name: "Netflix", label: "Netflix" },
    { name: "Hulu", label: "Hulu" },
    { name: "Disney+", label: "Disney+" },
    { name: "Amazon Prime Video", label: "Amazon Prime Video" },
    { name: "Youtube", label: "Youtube" }
  ];

  const launcherOptions = optionsData.filter(({ name }) =>
  [
    "Epic Games",
    "GOG Galaxy",
    "Origin",
    "Uplay",
    "Battle.net",
    "Amazon Games",
    "EA App",
    "Legacy Games",
    "itch.io",
    "Humble Games Collection",
    "IndieGala",
    "Rockstar Games Launcher",
    "Glyph Launcher",
    "Minecraft",
    "Playstation Plus",
    "DMM Games"
  ].includes(name)
);
const streamingOptions = optionsData.filter(({ name }) =>
  [
    "Xbox Game Pass",
    "GeForce Now",
    "Amazon Luna",
    "Netflix",
    "Hulu",
    "Disney+",
    "Amazon Prime Video",
    "Youtube"
  ].includes(name)
);
  return (
    <>
      <PanelSectionRow style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
        Welcome to the decky plugin version of NonSteamLaunchers! I hope it works... aka nasty lawn chairs
      </PanelSectionRow>
      <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px" }}>
        Thank you for everyone's support and contributions, this is the plugin we have all been waiting for... installing your favorite launchers in the easiest way possible. Enjoy!
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
  
        <ButtonItem layout="below" onClick={handleCreateWebsiteShortcutClick}>
          Create Website Shortcut
        </ButtonItem>
  
        <PanelSectionRow>
          <ButtonItem
            layout="below"
            onClick={(e: React.MouseEvent) =>
              showContextMenu(
                <Menu label="Menu" cancelText="CAAAANCEL" onCancel={() => {}}>
                  <MenuItem onSelected={() => {}}>Item #1</MenuItem>
                  <MenuItem onSelected={() => {}}>Item #2</MenuItem>
                  <MenuItem onSelected={() => {}}>Item #3</MenuItem>
                </Menu>,
                e.currentTarget ?? window
              )
            }
          >
            Find Games w/BoilR
          </ButtonItem>
        </PanelSectionRow>
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
  
      {isSearchModalOpen && (
       <SearchModal
         closeModal={() => setIsSearchModalOpen(false)}
         setModalResult={(result) => {
           console.log(`result: ${JSON.stringify(result)}`);
           if (clickedButton === 'createWebsiteShortcut') {
             // Handle result for createWebsiteShortcut button
             setCustomWebsites(result);
           }
           setIsSearchModalOpen(false);
         }}
         promptText={"Enter website"}
       />
     )}
  
  
      <style>
        {`
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
        `}
      </style>
    </>
  );
};

export default definePlugin((serverApi: ServerAPI) => {
 return {
   title: <div className={staticClasses.Title}>NonSteamLaunchers</div>,
   content: <Content serverAPI={serverApi} />,
   icon: <FaRocket />,
 };
});