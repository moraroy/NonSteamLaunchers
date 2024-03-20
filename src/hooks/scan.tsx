import { createShortcut } from "./createShortcut";

let scanws: WebSocket;

export async function scan() {
    scanws = new WebSocket('ws://localhost:8675/scan');
  
    scanws.onopen = () => {
      console.log('NSL WebSocket connection opened');
      if (scanws.readyState === WebSocket.OPEN) {
        scanws.send('something');
      } else {
        console.log('Cannot send message, NSL WebSocket connection is not open');
      }
    };
  
    scanws.onmessage = (e) => {
      console.log(`Received data from NSL server: ${e.data}`);
      if (e.data[0] === '{' && e.data[e.data.length - 1] === '}') {
        try {
          const game = JSON.parse(e.data);
          createShortcut(game);
        } catch (error) {
          console.error(`Error parsing data as JSON: ${error}`);
        }
      }
    };
  
    scanws.onerror = (e) => {
      const errorEvent = e as ErrorEvent;
      console.error(`NSL WebSocket error: ${errorEvent.message}`);
    };
  
    scanws.onclose = (e) => {
      console.log(`NSL WebSocket connection closed, code: ${e.code}, reason: ${e.reason}`);
    };
  }
  
export async function autoscan() {
    console.log('Starting NSL Autoscan');
  
    scanws = new WebSocket('ws://localhost:8675/autoscan');
  
    scanws.onopen = () => {
      console.log('NSL WebSocket connection opened');
      if (scanws.readyState === WebSocket.OPEN) {
        scanws.send('something');
      } else {
        console.log('Cannot send message, NSL WebSocket connection is not open');
      }
    };
  
    scanws.onmessage = (e) => {
      console.log(`Received data from NSL server: ${e.data}`);
      if (e.data[0] === '{' && e.data[e.data.length - 1] === '}') {
        try {
          const game = JSON.parse(e.data);
          createShortcut(game);
        } catch (error) {
          console.error(`Error parsing data as JSON: ${error}`);
        }
      }
    };
  
    scanws.onerror = (e) => {
      const errorEvent = e as ErrorEvent;
      console.error(`NSL WebSocket error: ${errorEvent.message}`);
    };
  
    scanws.onclose = (e) => {
      console.log(`NSL WebSocket connection closed, code: ${e.code}, reason: ${e.reason}`);
      if (e.code != 1000) {
        console.log(`Unexpected close of autoscan WS NSL connection, reopening`)
        autoscan();
      }
    };
  }