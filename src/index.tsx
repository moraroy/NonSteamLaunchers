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
} from 'decky-frontend-lib';
import { useState, VFC } from 'react';
import { FaRocket } from 'react-icons/fa';

const Content: VFC<{ serverAPI: ServerAPI }> = ({ serverAPI }) => {
  const [options, setOptions] = useState({
    epicGames: false,
    gogGalaxy: false,
    origin: false,
    uplay: false,
  });

  // Add a new state variable to keep track of the progress and status of the operation
  const [progress, setProgress] = useState({ percent: 0, status: '' });

  const handleButtonClick = (name: string) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: !prevOptions[name],
    }));
  };

  const handleInstallClick = async () => {
    // Update the progress state variable to indicate that the operation has started
    setProgress({ percent: 0, status: 'Calling serverAPI...' });

    // Access the current state of the options variable here
    console.log(options);
    setProgress((prevProgress) => ({
      ...prevProgress,
      status: prevProgress.status + '\nAccessing current state of options...',
    }));

    // Set the selected options
    const selectedOptions = Object.keys(options).filter((key) => options[key]);

    // Convert the selected options to a mapping
    const selectedOptionsMapping = {};
    for (const option of selectedOptions) {
      selectedOptionsMapping[option] = true;
    }

    // Add a print statement before calling the install method on the serverAPI object
    console.log(
      'Calling install method on serverAPI object with selected options:',
      selectedOptionsMapping
    );
    setProgress((prevProgress) => ({
      ...prevProgress,
      status:
        prevProgress.status +
        '\nCalling install method on serverAPI object with selected options: ' +
        JSON.stringify(selectedOptionsMapping),
    }));

    try {
      // Call a method in your backend with the selected options
      const response = await serverAPI.callPluginMethod('install', {
        selected_options: selectedOptionsMapping,
      });

      // Update the progress state variable to indicate that the operation has completed successfully
      setProgress({ percent: 100, status: 'Installation successful!' });

      // Handle the response from your backend here
      console.log(response);
      setProgress((prevProgress) => ({
        ...prevProgress,
        status: prevProgress.status + '\nResponse from backend: ' + response,
      }));

      if (typeof response === 'string') {
        if (response === 'Installation successful') {
          alert('Installation successful!');
        } else if (response === 'Installation failed') {
          alert('Installation failed.');
        }
      }
    } catch (error) {
      // Update the progress state variable to indicate that an error occurred
      setProgress({ percent: 100, status: 'Installation failed.' });
      console.error('Error calling install method on serverAPI object:', error);
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
          <br />

          <ButtonItem
            className={options.gogGalaxy ? 'selected' : ''}
            layout="below"
            onClick={() => handleButtonClick('gogGalaxy')}
          >
            <span className="checkmark">{options.gogGalaxy ? '✓' : ''}</span>{' '}
            Gog Galaxy
          </ButtonItem>
          <br />

          <ButtonItem
            className={options.origin ? 'selected' : ''}
            layout="below"
            onClick={() => handleButtonClick('origin')}
          >
            <span className="checkmark">{options.origin ? '✓' : ''}</span>{' '}
            Origin
          </ButtonItem>
          <br />

          <ButtonItem
            className={options.uplay ? 'selected' : ''}
            layout="below"
            onClick={() => handleButtonClick('uplay')}
          >
            <span className="checkmark">{options.uplay ? '✓' : ''}</span>{' '}
            Uplay
          </ButtonItem>
          <br />

          {/* Add an Install button here using a ButtonItem component */}
          <ButtonItem layout="below" onClick={handleInstallClick}>
            Install
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


