import React, { useState } from 'react';
import { ButtonItem } from 'decky-frontend-lib';
import { ServerAPI } from 'decky-frontend-lib';

interface OptionsListProps {
  serverAPI: ServerAPI;
}

export const OptionsList: React.FC<OptionsListProps> = ({ serverAPI }) => {
  // Add the environment check code here
  if (typeof window !== 'undefined' && window.document) {
    console.log('Running in a web browser environment');
  } else {
    console.log('Not running in a web browser environment');
  }

  if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
    console.log('Running within an Electron app');
  } else {
    console.log('Not running within an Electron app');
  }

  const [options, setOptions] = useState({
    epicGames: false,
    gogGalaxy: false,
    origin: false,
    uplay: false,
  });

  const handleButtonClick = (name: string) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [name]: !prevOptions[name],
    }));
  };

  const handleInstallClick = async () => {
    // Access the current state of the options variable here
    console.log(options);
  
    // Set the selected options
    const selectedOptions = Object.keys(options).filter((key) => options[key]);
  
    // Convert the selected options to a mapping
    const selectedOptionsMapping = {};
    for (const option of selectedOptions) {
      selectedOptionsMapping[option] = true;
    }
  
    // Add a print statement before calling the install method on the serverAPI object
    console.log('Calling install method on serverAPI object with selected options:', selectedOptionsMapping);
  
    // Call a method in your backend with the selected options
    const response = await serverAPI.callPluginMethod('install', {selected_options: selectedOptionsMapping});
  
    // Handle the response from your backend here
    console.log(response);
    
    if (typeof response === 'string') {
      if (response === "Installation successful") {
        alert("Installation successful!");
      } else if (response === "Installation failed") {
        alert("Installation failed.");
      }
    }
  }

  return (
    <form>
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
        `}
      </style>
    </form>
  );
}