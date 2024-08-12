import {
    DialogHeader,
    ToggleField,
    DialogBodyText,
    DialogBody,
    DialogButton,
    Focusable,
    ServerAPI,
    ModalRoot,
    SteamSpinner,
    ProgressBarWithInfo
} from "decky-frontend-lib";
import { useState, VFC, useEffect } from "react";
import { notify } from "../../hooks/notify";
import { useSettings } from "../../hooks/useSettings";
import { scan, autoscan } from "../../hooks/scan";
import { useLogUpdates } from "../../hooks/useLogUpdates";

type LauncherInstallModalProps = {
    closeModal?: () => void,
    launcherOptions: {
        name: string;
        label: string;
        URL: string;
        streaming: boolean;
        enabled: boolean;
    }[],
    serverAPI: ServerAPI
};

// Mapping of launcher names to their respective image URLs
const launcherImages = {
    epicGames: 'https://cdn2.steamgriddb.com/hero_thumb/164fbf608021ece8933758ee2b28dd7d.jpg',
    gogGalaxy: 'https://cdn2.steamgriddb.com/hero_thumb/ce016f59ecc2366a43e1c96a4774d167.jpg',
    uplay: 'https://cdn2.steamgriddb.com/thumb/5070c1f86e4885d73865919ce537fd21.jpg', // Ubisoft Connect
    battleNet: 'https://cdn2.steamgriddb.com/hero_thumb/9f319422ca17b1082ea49820353f14ab.jpg',
    amazonGames: 'https://cdn2.steamgriddb.com/thumb/32846afc71fcbc30af34643123838c57.jpg',
    eaApp: 'https://cdn2.steamgriddb.com/thumb/61370213c90759696536e996a5a61bd4.jpg',
    legacyGames: 'https://cdn2.steamgriddb.com/thumb/86cfeb447e7f474a00adb7423c605875.jpg',
    itchIo: 'https://cdn2.steamgriddb.com/thumb/80f57a23cf01d17c0b65fa4e0d010aa2.jpg',
    humbleGames: 'https://cdn2.steamgriddb.com/thumb/4cb3ded67cb7a539395ab873354a01c1.jpg',
    indieGala: 'https://cdn2.steamgriddb.com/thumb/8348173ba70a643e9d0077c1605ce0ad.jpg',
    rockstarGamesLauncher: 'https://cdn2.steamgriddb.com/hero_thumb/60b4ddba6215df686ff6ab71d0c078e9.jpg',
    psPlus: 'https://cdn2.steamgriddb.com/thumb/6c037a13a7e2d089a0f88f86b6405daf.jpg',
    xboxGamePass: 'https://cdn2.steamgriddb.com/hero_thumb/167b7d08b38facb1c06185861a5845dd.jpg',
    fortnite: 'https://cdn2.steamgriddb.com/hero_thumb/560cc70f255b94b8408709e810914593.jpg',
    geforceNow: 'https://cdn2.steamgriddb.com/hero_thumb/5e7e6e76699ea804c65b0c37974c660c.jpg',
    amazonLuna: 'https://cdn2.steamgriddb.com/thumb/5966577c1d725b37c26c3f7aa493dd9c.jpg',
    netflix: 'https://cdn2.steamgriddb.com/hero_thumb/119f6887f5ebfd6d5b40213819263e68.jpg',
    hulu: 'https://cdn2.steamgriddb.com/thumb/4bbddbaea593148384a27a8dcf498d30.jpg',
    disneyPlus: 'https://cdn2.steamgriddb.com/hero_thumb/0dad24dc5419076f64f2ba93833b354e.png',
    amazonPrimeVideo: 'https://cdn2.steamgriddb.com/hero_thumb/5e7cefa9b606dcd7b0faa082d82cdb1d.jpg',
    youtube: 'https://cdn2.steamgriddb.com/thumb/786929ce1b2e187510aca9b04a0f7254.jpg',
    twitch: 'https://cdn2.steamgriddb.com/thumb/accbfd0ef1051b082dc4ae223cf07da7.jpg'
};


export const LauncherInstallModal: VFC<LauncherInstallModalProps> = ({ closeModal, launcherOptions, serverAPI }) => {
    const [progress, setProgress] = useState({ percent: 0, status: '', description: '' });
    const { settings, setAutoScan } = useSettings(serverAPI);
    const [options, setOptions] = useState(launcherOptions);
    const [separateAppIds, setSeparateAppIds] = useState(false);
    const [operation, setOperation] = useState("");
    const [showLog, setShowLog] = useState(false);
    const [triggerLogUpdates, setTriggerLogUpdates] = useState(false);
    const log = useLogUpdates(triggerLogUpdates);
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const selectedLauncher = options.find(option => option.enabled && !option.streaming);
        if (selectedLauncher) {
            setImageUrl(launcherImages[selectedLauncher.name]);
        }
    }, [options]);

    const handleToggle = (changeName: string, changeValue: boolean) => {
        const newOptions = options.map(option => {
            if (option.name === changeName) {
                return {
                    ...option,
                    enabled: changeValue,
                };
            } else {
                return option;
            }
        });
        setOptions(newOptions);
    };

    const handleSeparateAppIdsToggle = (value: boolean) => {
        setSeparateAppIds(value);
    };

    const handleInstallClick = async (operation: string) => {
        setOperation(operation);
        setShowLog(true);
        setTriggerLogUpdates(true);
        const selectedLaunchers = options.filter(option => option.enabled && !option.streaming);
        let i = 0;
        let previousAutoScan = settings.autoscan;
        for (const launcher of selectedLaunchers) {
            if (!launcher.streaming) {
                setAutoScan(false);
                const launcherParam: string = (launcher.name.charAt(0).toUpperCase() + launcher.name.slice(1));
                await installLauncher(launcherParam, launcher.label, i, operation);
            }
            i++;
        }
        scan();
        setAutoScan(previousAutoScan);
        if (settings.autoscan) { autoscan(); }
    };

    const installLauncher = async (launcher: string, launcherLabel: string, index: number, operation: string) => {
        const total = options.filter(option => option.enabled).length;
        const startPercent = index === 0 ? 0 : index / total * 100;
        const endPercent = (index + 1) / total * 100;
        setProgress({
            percent: startPercent,
            status: `${operation}ing Launcher ${index + 1} of ${total}`,
            description: `${launcherLabel}`
        });
        try {
            const result = await serverAPI.callPluginMethod("install", {
                selected_options: launcher,
                operation: operation,
                install_chrome: false,
                separate_app_ids: separateAppIds,
                start_fresh: false
            });

            if (result) {
                setProgress({ percent: endPercent, status: `${operation} Selection ${index + 1} of ${total}`, description: `${launcher}` });
                notify.toast(`Launcher ${operation}ed`, `${launcherLabel} was ${operation.toLowerCase()}ed successfully!`);
            } else {
                setProgress({ percent: endPercent, status: `${operation} selection ${index + 1} of ${total} failed`, description: `${operation} ${launcher} failed. See logs.` });
                notify.toast(`${operation} Failed`, `${launcherLabel} was not ${operation.toLowerCase()}ed.`);
            }
        } catch (error) {
            setProgress({ percent: endPercent, status: `Installing selection ${index + 1} of ${total} failed`, description: `Installing ${launcher} failed. See logs.` });
            notify.toast("Install Failed", `${launcherLabel} was not installed.`);
            console.error('Error calling _main method on server-side plugin:', error);
        }
    };

    const fadeStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 1,
        pointerEvents: 'none',
        transition: 'opacity 1s ease-in-out'
    };
    
    return ((progress.status != '' && progress.percent < 100) ?
        <ModalRoot>
            <DialogHeader>
                {`${operation}ing Game Launchers`}
            </DialogHeader>
            <DialogBodyText>Selected options: {options.filter(option => option.enabled).map(option => option.label).join(', ')}</DialogBodyText>
            <DialogBody>
                <SteamSpinner />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ flex: 1, marginRight: '10px', fontSize: 'small', whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: '50px', height:'25px' }}>
                        {showLog && log}
                    </div>
                    <ProgressBarWithInfo
                        layout="inline"
                        bottomSeparator="none"
                        sOperationText={progress.status}
                        description={progress.description}
                        nProgress={progress.percent}
                    />
                </div>
                {imageUrl && (
                    <img src={imageUrl} alt="Overlay" style={{ ...fadeStyle, opacity: 0.5 }} />
                )}
            </DialogBody>
        </ModalRoot> :
        <ModalRoot onCancel={closeModal}>
            <DialogHeader>
                Select Game Launchers
            </DialogHeader>
            <DialogBodyText>Here you choose your launchers you want to install and let NSL do the rest. Once installed, they will be added your library!</DialogBodyText>
            <DialogBody>
                {launcherOptions.map(({ name, label }) => (
                    <ToggleField
                        key={name}
                        label={label}
                        checked={options.find(option => option.name === name)?.enabled ? true : false}
                        onChange={(value) => handleToggle(name, value)}
                    />
                ))}
            </DialogBody>
            <p style={{ fontSize: 'small', marginTop: '20px' }}>
                Note: If your launchers dont start, make sure force compatability is checked, shortcut properties are right and your steam files are updated. Remember to also edit your controller layout configurations if necessary! If all else fails, restart your steam deck manually.
            </p>
            <Focusable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <DialogButton
                            style={{ width: "fit-content" }}
                            onClick={() => handleInstallClick("Install")}
                            disabled={options.every(option => option.enabled === false)}
                        >
                            Install
                        </DialogButton>
                        <DialogButton
                            style={{ width: "fit-content", marginLeft: "10px", marginRight: "10px" }}
                            onClick={() => handleInstallClick("Uninstall")}
                            disabled={options.every(option => option.enabled === false)}
                        >
                            Uninstall
                        </DialogButton>
                    </div>
                    <ToggleField label="Separate Launcher Folders" checked={separateAppIds} onChange={handleSeparateAppIdsToggle} />
                </div>
            </Focusable>
        </ModalRoot>
    )    
};