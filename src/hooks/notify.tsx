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
          duration: 8000,
          icon: iconUrl ? (
            <img
              src={iconUrl}
              alt="icon"
              style={{
                width: '40px',  // Increase the width
                height: '40px', // Increase the height
                position: 'absolute', // Position it absolutely
                top: '0px', // Adjust the top position
                left: '0px', // Adjust the left position
                borderRadius: '50%', // Make it circular
                boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', // Add a shadow for emphasis
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