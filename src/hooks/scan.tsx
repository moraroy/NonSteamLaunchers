import { createShortcut } from "./createShortcut";

async function setupWebSocket(url: string, onMessage: (data: any) => void) {
    const ws = new WebSocket(url);

    ws.onopen = () => {
        console.log('NSL WebSocket connection opened');
        if (ws.readyState === WebSocket.OPEN) {
            ws.send('something');
        } else {
            console.log('Cannot send message, NSL WebSocket connection is not open');
        }
    };

    ws.onmessage = (e) => {
        console.log(`Received data from NSL server: ${e.data}`);
        if (e.data[0] === '{' && e.data[e.data.length - 1] === '}') {
            try {
                const game = JSON.parse(e.data);
                onMessage(game);
            } catch (error) {
                console.error(`Error parsing data as JSON: ${error}`);
            }
        }
    };

    ws.onerror = (e) => {
        const errorEvent = e as ErrorEvent;
        console.error(`NSL WebSocket error: ${errorEvent.message}`);
    };

    ws.onclose = (e) => {
        console.log(`NSL WebSocket connection closed, code: ${e.code}, reason: ${e.reason}`);
        if (e.code !== 1000) {
            console.log(`Unexpected close of WS NSL connection, reopening`);
            setupWebSocket(url, onMessage);
        }
    };

    return ws;
}

export async function scan() {
    console.log('Starting NSL Scan');
    await setupWebSocket('ws://localhost:8675/scan', createShortcut);
}

export async function autoscan() {
    console.log('Starting NSL Autoscan');
    await setupWebSocket('ws://localhost:8675/autoscan', createShortcut);
}
