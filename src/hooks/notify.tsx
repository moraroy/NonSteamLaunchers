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

  static toast(title: string, message: string, iconUrl?: string): void {
    return (() => {
      try {
        const isValidIconUrl = iconUrl && iconUrl.trim() !== "";
        return this.serverAPI.toaster.toast({
          title: title,
          body: message,
          duration: 8000,
          icon: isValidIconUrl ? (
            <img
              src={iconUrl}
              alt="icon"
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
          ) : undefined,
        });
      } catch (e) {
        console.log("Toaster Error", e);
      }
    })();
  }
}  