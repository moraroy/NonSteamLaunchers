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
        return this.serverAPI.toaster.toast({
          title: title,
          body: message,
          duration: 5000,
          icon: iconUrl ? <img src={iconUrl} alt="icon" style={{ width: '20px', height: '20px' }} /> : undefined,
        });
      } catch (e) {
        console.log("Toaster Error", e);
      }
    })();
  }
}