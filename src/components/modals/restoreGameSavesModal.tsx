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
      const result = await serverAPI.callPluginMethod("NSLGameSaves", {});

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
    <ModalRoot>
      <DialogHeader>Restore Game Save Backups</DialogHeader>
      <DialogBodyText>
        This feature will restore your game save backups all at once. **Please ensure that all necessary launchers are installed first, but do not download the actual games.** This will help avoid any local game conflicts. Only proceed if you have wiped everything using Start Fresh and have made sure your game saves were backed up at /home/deck/NSLGameSaves. Once ready, proceed to press restore.
      </DialogBodyText>
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
