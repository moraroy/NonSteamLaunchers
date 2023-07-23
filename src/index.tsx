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
      </form>
    </ModalRoot>
  );
};

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  console.log('Content rendered');

  const [options, setOptions] = useState({
    epicGames: false,
    gogGalaxy: false,
    origin: false,
    uplay: false,
    xboxGamePass: false,
    geforceNow: false,
    amazonLuna: false,
    netflix: false,
    hulu: false,
    disneyPlus: false,
    amazonPrimeVideo: false,
    youtube: false
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
         separate_app_ids: separateAppIds
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

     showModal(
       <SearchModal
         promptText="Enter website"
         setModalResult={(result) => {
           console.log(`result: ${JSON.stringify(result)}`);
           if (clickedButton === 'createWebsiteShortcut') {
             // Handle result for createWebsiteShortcut button
             setCustomWebsites(result);
           }
         }}
       />,
       findSP()
     );
   };
   
   const optionsData = [
    { name: 'epicGames', label: 'Epic Games' },
    { name: 'gogGalaxy', label: 'Gog Galaxy' },
    { name: 'origin', label: 'Origin' },
    { name: 'uplay', label: 'Uplay' },
    { name: 'xboxGamePass', label: 'Xbox Game Pass' },
    { name: 'geforceNow', label: 'GeForce Now' },
    { name: 'amazonLuna', label: 'Amazon Luna' },
    { name: 'netflix', label: 'Netflix' },
    { name: 'hulu', label: 'Hulu' },
    { name: 'disneyPlus', label: 'Disney+' },
    { name: 'amazonPrimeVideo', label: 'Amazon Prime Video' },
    { name: 'youtube', label: 'Youtube' }
  ];

  const launcherOptions = optionsData.filter(({name}) => ['epicGames', 'gogGalaxy', 'origin', 'uplay'].includes(name));
  const streamingOptions = optionsData.filter(({name}) => ['xboxGamePass','geforceNow','amazonLuna','netflix','hulu','disneyPlus','amazonPrimeVideo','youtube'].includes(name));
 
 return (
   <>
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
         This section is for managing game launchers.
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

     <PanelSection title="Game Streaming">
       <PanelSectionRow style={{ fontSize: "12px", marginBottom: "10px" }}>
         This section is for managing game streaming services.
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
         ButtonItem {
           margin-bottom: 10px;
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