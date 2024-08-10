import { useEffect, useState } from 'react';

export const useLogUpdates = (start: boolean): string => {
  const [log, setLog] = useState<string>('');

  useEffect(() => {
    if (!start) return;

    const logWs = new WebSocket('ws://localhost:8675/logUpdates');

    logWs.onmessage = (e) => {
      setLog((prevLog) => `${prevLog}\n${e.data}`);
    };

    logWs.onerror = (e) => {
      console.error(`WebSocket error: ${e}`);
    };

    logWs.onclose = (e) => {
      console.log(`WebSocket closed: ${e.code} - ${e.reason}`);
    };

    return () => {
      logWs.close();
    };
  }, [start]);

  return log;
};