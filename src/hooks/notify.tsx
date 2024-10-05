import { ServerAPI } from "decky-frontend-lib";

export class notify {
  private static serverAPI: ServerAPI;

  /**
   * Sets the interop's serverAPI.
   * @param serv The ServerAPI for the interop to use.
   */
  static setServer(serv: ServerAPI): void {
    this.serverAPI = serv;
  }

  static toast(title: string, message: string, icons?: { gameIconUrl: string, launcherIconUrl?: string }): void {
    return (() => {
      try {
        const gameIcon = icons ? (
          <img
            src={icons.gameIconUrl}
            alt="Game Icon"
            style={{
              width: '26px', // Increased width
              height: '26px', // Increased height
              borderRadius: '50%',
              boxShadow: '0 0 15px rgba(0, 0, 0, 0.7)', // Increased shadow
              border: '2px solid #fff', // Added border
            }}
          />
        ) : null;

        const launcherIcon = icons?.launcherIconUrl ? (
          <div style={{ flexGrow: 1, textAlign: 'center', marginLeft: '0px', marginTop: '-16px' }}>
            <img
              src={icons.launcherIconUrl}
              alt="Launcher Icon"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '10%',
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
              }}
            />
          </div>
        ) : null;

        return this.serverAPI.toaster.toast({
          title: icons ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '25px', width: '500px' }}>
              {title}
            </div>
          ) : title,
          body: icons ? (
            <div style={{ display: 'flex', justifyContent: 'flex-start', paddingLeft: '35px', width: '0px' }}>
              {message}
            </div>
          ) : message,
          duration: 8000,
          icon: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {gameIcon}
              {launcherIcon}
            </div>
          ),
        });
      } catch (e) {
        console.log("Toaster Error", e);
      }
    })();
  }
}
