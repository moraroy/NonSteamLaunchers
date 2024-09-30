import {
  DialogHeader,
  DialogBodyText,
  DialogBody,
  ServerAPI,
  ModalRoot,
  SteamSpinner,
  ProgressBarWithInfo,
  ButtonItem
} from "decky-frontend-lib";
import { useState, VFC } from "react";
import { notify } from "../../hooks/notify";

type RestoreGameSavesModalProps = {
  closeModal?: () => void,
  serverAPI: ServerAPI
};

export const RestoreGameSavesModal: VFC<RestoreGameSavesModalProps> = ({ closeModal, serverAPI }) => {
  const [progress, setProgress] = useState({ percent: 0, status: '', description: '' });

  const handleRestoreClick = async () => {
    console.log('handleRestoreClick called');
    setProgress({ percent: 0, status: 'Restoring game saves...', description: '' });
    try {
      const result = await serverAPI.callPluginMethod("install", {
        selected_options: "NSLGameSaves",
        operation: "Install",
        install_chrome: false,
        separate_app_ids: false,
        start_fresh: false
      });

      if (result) {
        setProgress({ percent: 100, status: 'Game saves restored successfully!', description: '' });
        notify.toast("Game saves restored successfully!", "Your game saves have been restored.");
      } else {
        setProgress({ percent: 100, status: 'Restore failed.', description: '' });
        notify.toast("Restore failed", "Failed to restore game saves. Check your logs.");
      }
    } catch (error) {
      setProgress({ percent: 100, status: 'Restore failed.', description: '' });
      notify.toast("Restore Failed", "Failed to restore game saves. Check your logs.");
      console.error('Error calling restore method on server-side plugin:', error);
    }
    closeModal!();
  };

  return ((progress.status !== '' && progress.percent < 100) ?
    <ModalRoot>
      <DialogHeader>Restoring Game Saves</DialogHeader>
      <DialogBodyText>Restoring your game save backups...</DialogBodyText>
      <DialogBody>
        <SteamSpinner />
        <ProgressBarWithInfo
          layout="inline"
          bottomSeparator="none"
          sOperationText={progress.status}
          description={progress.description}
          nProgress={progress.percent}
        />
        <ButtonItem layout="below" onClick={closeModal}>
          Cancel
        </ButtonItem>
      </DialogBody>
    </ModalRoot> :
    <ModalRoot style={{ fontSize: '12px', width: '600px' }}>
      <DialogHeader>Restore Game Save Backups</DialogHeader>
      <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '10px' }}>
        <DialogBodyText>This feature will restore your game save backups all at once.</DialogBodyText>
        <DialogBodyText>
          <strong>Please ensure that all necessary launchers are installed first, but do not download the actual games.</strong> This will help avoid any local game conflicts. Only proceed if you have wiped everything using Start Fresh and have made sure your game saves were backed up at /home/deck/NSLGameSaves.
        </DialogBodyText>
        <DialogBodyText>Some games from their launchers don't have cloud save backups:</DialogBodyText>
        <ul>
          <li>NSL uses a program called Ludusavi to backup your local game saves and attempts to restore them for you.</li>
          <li>However, some games from their launchers won't have local game saves because the launchers themselves take care of the local save and cloud save. This varies on a game-to-game basis.</li>
          <li style={{ wordWrap: 'break-word' }}>Ludusavi may not pick up your game saves and may need to be configured manually here: /home/deck/.var/app/com.github.mtkennerly.ludusavi/config/ludusavi/NSLconfig/config.yaml</li>
        </ul>
        <DialogBodyText>Once ready, proceed to press restore.</DialogBodyText>
      </div>
      <DialogBody>
        <ButtonItem layout="below" onClick={handleRestoreClick}>
          Restore Game Saves
        </ButtonItem>
        <ButtonItem layout="below" onClick={closeModal}>
          Cancel
        </ButtonItem>
      </DialogBody>
    </ModalRoot>
  );
};
