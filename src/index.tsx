import {
  ButtonItem,
  definePlugin,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showContextMenu,
  staticClasses,
  ToggleField
} from "decky-frontend-lib";
import { useState, VFC } from "react";
import { FaRocket } from "react-icons/fa";

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
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

  // Add a new state variable to keep track of the progress and status of the operation
  const [progress, setProgress] = useState({ percent: 0, status: '' });

  // Add a new state variable to keep track of whether the "Separate App IDs" option is selected or not
  const [separateAppIds, setSeparateAppIds] = useState(false);

  const handleButtonClick = (name: string) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: !prevOptions[name],
    }));
  };

  const handleInstallClick = async () => {
    // Display a pop-up window for entering custom websites
    const customWebsite = window.prompt('Enter custom websites (separated by commas)');
  
    // Check if customWebsite is not null before calling the split method on it
    const customWebsites = customWebsite ? customWebsite.split(',').map((website: string) => website.trim()) : [];
  
    // Construct a string that lists the selected launchers
    const selectedLaunchers = Object.entries(options)
      .filter(([_, isSelected]) => isSelected)
      .map(([name, _]) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(', ');
  
    // Update the progress state variable to indicate that the operation has started
    setProgress({ percent: 0, status: `Calling serverAPI... Installing ${selectedLaunchers}` });
  
    // Log the selected options for debugging
    console.log(`Selected options: ${JSON.stringify(options)}`);
  
    try {
      const result = await serverAPI.callPluginMethod("install", {
        selected_options: options,
        custom_websites: customWebsites,
        separate_app_ids: separateAppIds
      });
  
      if (result) {
        // Update the progress state variable to indicate that the operation has completed successfully
        setProgress({ percent: 100, status: 'Installation successful!' });
        alert('Installation successful!');
      } else {
        // Update the progress state variable to indicate that an error occurred
        setProgress({ percent: 100, status: 'Installation failed.' });
        alert('Installation failed.');
      }
    } catch (error) {
      // Update the progress state variable to indicate that an error occurred
      setProgress({ percent: 100, status: 'Installation failed.' });
      console.error('Error calling _main method on server-side plugin:', error);
    }
  };

  const handleCreateWebsiteShortcutClick = async () => {
    // Display a pop-up window for entering a website
    const website = window.prompt('Enter website');
  
    if (website) {
      try {
        await serverAPI.callPluginMethod("createWebsiteShortcut", website);
        alert('Website shortcut created successfully!');
      } catch (error) {
        console.error('Error calling createWebsiteShortcut method on server-side plugin:', error);
        alert('Failed to create website shortcut.');
      }
    }
  };
  
  // Create an array of objects representing each option, with properties for the option name and label
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
      {/* Render the progress bar and status message */}
      <PanelSectionRow>
        <progress value={progress.percent} max={100} />
        <div>{progress.status}</div>
      </PanelSectionRow>

      <PanelSection>
        {/* Add an Install button here using a ButtonItem component */}
        <ButtonItem layout="below" onClick={handleInstallClick}>
          Install
        </ButtonItem>

        {/* Add a Create Website Shortcut button here using a ButtonItem component */}
        <ButtonItem layout="below" onClick={handleCreateWebsiteShortcutClick}>
          Create Website Shortcut
        </ButtonItem>

        {/* Add a toggle switch for the "Separate App IDs" option here */}
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

        {/* Render the options here using a loop to generate the ButtonItem components for each option */}
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

      <style>
        {`
          .checkmark {
            color: green;
          }
          .selected {
            background-color: #eee;
          }
          progress {
            display: block;
            width: 100%;
            margin-top: 5px;
            height: 20px; /* Change the height of the progress bar here */
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