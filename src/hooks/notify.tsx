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

  static toast(title: string, message: string, icons?: { gameIconUrl: string, launcherIconUrl: string }): void {
    return (() => {
      try {
        return this.serverAPI.toaster.toast({
          title: title,
          body: message,
          duration: 8000,
          icon: icons ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={icons.gameIconUrl}
                alt="Game Icon"
                style={{
                  width: '30px',
                  height: '30px',
                  position: 'absolute',
                  top: '-12px',
                  left: '0px',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                }}
              />
              <div style={{ flexGrow: 1, textAlign: 'center', marginLeft: '35px', marginTop: '-10px' }}>
                <img
                  src={icons.launcherIconUrl}
                  alt="Launcher Icon"
                  style={{
                    width: '20px', // Smaller width
                    height: '20px', // Smaller height
                    borderRadius: '10%', // Rounded edges
                    boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
                  }}
                />
              </div>
            </div>
          ) : undefined,
        });
      } catch (e) {
        console.log("Toaster Error", e);
      }
    })();
  }
}  