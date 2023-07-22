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
import { useState, VFC } from "react";
import { FaRocket } from "react-icons/fa";

type SearchModalProps = ModalRootProps & {
  setModalResult?(result: string[]): void;
  promptText: string;
  initialWebsites: string[];
};

const SearchModal: VFC<SearchModalProps> = ({
  closeModal,
  setModalResult,
  promptText,
  initialWebsites
}) => {
  console.log('SearchModal rendered');

  const [searchTexts, setSearchTexts] = useState(initialWebsites);

  const handleTextChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTexts((prevSearchTexts) => {
      const newSearchTexts = [...prevSearchTexts];
      newSearchTexts[index] = e.target.value;
      return newSearchTexts;
    });
  };

  const handleAddClick = () => {
    setSearchTexts((prevSearchTexts) => [...prevSearchTexts, '']);
  };

  const handleSubmit = () => {
    setModalResult && setModalResult(searchTexts);
    closeModal && closeModal();
  };

  return (
    <ModalRoot closeModal={handleSubmit}>
      <form>
        {searchTexts.map((searchText, index) => (
          <TextField
            key={index}
            focusOnMount={index === searchTexts.length - 1}
            label="Website"
            placeholder={promptText}
            value={searchText}
            onChange={handleTextChange(index)}
          />
        ))}
        <ButtonItem onClick={handleAddClick}>Add Website</ButtonItem>
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
         initialWebsites={customWebsites}
         setModalResult={(result) => {
           if (clickedButton === 'createWebsiteShortcut') {
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
   
   return (
     <>
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
           <ToggleField label="Separate App IDs" checked={separateAppIds} onChange={setSeparateAppIds} />
         </PanelSectionRow>

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

         <PanelSectionRow>
           {optionsData.map(({ name, label }) => (
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
             if (clickedButton === 'createWebsiteShortcut') {
               setCustomWebsites(result);
             }
             setIsSearchModalOpen(false);
           }}
           promptText={"Enter website"}
           initialWebsites={customWebsites}
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