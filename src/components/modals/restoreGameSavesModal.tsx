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
    <ModalRoot style={{ width: '600px' }}>
      <DialogHeader>Restore Game Save Backups</DialogHeader>
      <DialogBody>
        <DialogBodyText style={{ fontSize: '12px' }}>This feature will restore all your game save backups at once.</DialogBodyText>
        <DialogBodyText style={{ fontSize: '12px' }}>
          <strong>Ensure all necessary launchers are installed, but do not download the games.</strong> This will avoid local conflicts. Only continue if you have wiped everything using Start Fresh and backed up your game saves at /home/deck/NSLGameSaves.
        </DialogBodyText>
        <DialogBodyText style={{ fontSize: '12px' }}>Some games don't have local save backups:</DialogBodyText>
        <ul>
          <li style={{ fontSize: '11px' }}>NSL uses Ludusavi to backup and restore your local game saves.</li>
          <li style={{ fontSize: '11px' }}>Some launchers handle local and cloud saves themselves so this will vary on a game to game basis.</li>
          <li style={{ fontSize: '11px', wordWrap: 'break-word' }}>Ludusavi may need manual configuration here if more paths are needed: /home/deck/.var/app/com.github.mtkennerly.ludusavi/config/ludusavi/NSLconfig/config.yaml</li>
        </ul>
        <DialogBodyText style={{ fontSize: '12px' }}>Press restore when ready.</DialogBodyText>
      </DialogBody>
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
