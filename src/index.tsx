import {
  ButtonItem,
  definePlugin,
  Menu,
  MenuItem,
  PanelSection,
  PanelSectionRow,
  ServerAPI,
  showContextMenu,
  staticClasses
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

        {/* Add a toggle switch for the "Separate App IDs" option here */}
        <PanelSectionRow>
          <label>
            <input
              type="checkbox"
              checked={separateAppIds}
              onChange={(e) => setSeparateAppIds(e.target.checked)}
            />
            Separate App IDs
          </label>
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

        {/* Render the options here */}
        <PanelSectionRow>
          <ButtonItem
            className={options.epicGames ? 'selected' : ''}
            layout="below"
            onClick={() => handleButtonClick('epicGames')}
          >
            <span className="checkmark">{options.epicGames ? '✓' : ''}</span>{' '}
            Epic Games
          </ButtonItem>

          <ButtonItem
            className={options.gogGalaxy ? 'selected' : ''}
            layout="below"
            onClick={() => handleButtonClick('gogGalaxy')}
          >
            <span className="checkmark">{options.gogGalaxy ? '✓' : ''}</span>{' '}
             Gog Galaxy
           </ButtonItem>

           <ButtonItem
             className={options.origin ? 'selected' : ''}
             layout="below"
             onClick={() => handleButtonClick('origin')}
           >
             <span className="checkmark">{options.origin ? '✓' : ''}</span>{' '}
             Origin
           </ButtonItem>

           <ButtonItem
             className={options.uplay ? 'selected' : ''}
             layout="below"
             onClick={() => handleButtonClick('uplay')}
           >
             <span className="checkmark">{options.uplay ? '✓' : ''}</span>{' '}
             Uplay
           </ButtonItem>

           <ButtonItem
             className={options.xboxGamePass ? 'selected' : ''}
             layout="below"
             onClick={() => handleButtonClick('xboxGamePass')}
           >
             <span className="checkmark">{options.xboxGamePass ? '✓' : ''}</span>{' '}
              Xbox Game Pass
            </ButtonItem>

            <ButtonItem
              className={options.geforceNow ? 'selected' : ''}
              layout="below"
              onClick={() => handleButtonClick('geforceNow')}
            >
              <span className="checkmark">{options.geforceNow ? '✓' : ''}</span>{' '}
              GeForce Now
            </ButtonItem>

            <ButtonItem
              className={options.amazonLuna ? 'selected' : ''}
              layout="below"
              onClick={() => handleButtonClick('amazonLuna')}
            >
              <span className="checkmark">{options.amazonLuna ? '✓' : ''}</span>{' '}
              Amazon Luna
            </ButtonItem>

            <ButtonItem
              className={options.netflix ? 'selected' : ''}
              layout="below"
              onClick={() => handleButtonClick('netflix')}
            >
              <span className="checkmark">{options.netflix ? '✓' : ''}</span>{' '}
              Netflix
            </ButtonItem>

            <ButtonItem
              className={options.hulu ? 'selected' : ''}
              layout="below"
              onClick={() => handleButtonClick('hulu')}
            >
              <span className="checkmark">{options.hulu ? '✓' : ''}</span>{' '}
              Hulu
            </ButtonItem>

            <ButtonItem
              className={options.disneyPlus ? 'selected' : ''}
              layout="below"
              onClick={() => handleButtonClick('disneyPlus')}
            >
              <span className="checkmark">{options.disneyPlus ? '✓' : ''}</span>{' '}
               Disney+
             </ButtonItem>

             <ButtonItem
               className={options.amazonPrimeVideo ? 'selected' : ''}
               layout="below"
               onClick={() => handleButtonClick('amazonPrimeVideo')}
             >
               <span className="checkmark">{options.amazonPrimeVideo ? '✓' : ''}</span>{' '}
                Amazon Prime Video
              </ButtonItem>

              <ButtonItem
                className={options.youtube ? 'selected' : ''}
                layout="below"
                onClick={() => handleButtonClick('youtube')}
              >
                <span className="checkmark">{options.youtube ? '✓' : ''}</span>{' '}
                Youtube
              </ButtonItem>
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