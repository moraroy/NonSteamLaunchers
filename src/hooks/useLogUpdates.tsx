import { useEffect, useState, useRef } from 'react';

export const useLogUpdates = (trigger: boolean): string[] => {
  const [log, setLog] = useState<string[]>([]);
  const logWsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (trigger && !logWsRef.current) {
      logWsRef.current = new WebSocket('ws://localhost:8675/logUpdates');

      logWsRef.current.onmessage = (e) => {
        setLog((prevLog) => [...prevLog, e.data]);
      };

      logWsRef.current.onerror = (e) => {
        console.error(`WebSocket error: ${e}`);
      };

      logWsRef.current.onclose = (e) => {
        console.log(`WebSocket closed: ${e.code} - ${e.reason}`);
        // Attempt to reconnect after a delay
        setTimeout(() => {
          logWsRef.current = new WebSocket('ws://localhost:8675/logUpdates');
        }, 5000);
      };
    }

    return () => {
      if (logWsRef.current) {
        logWsRef.current.close();
        logWsRef.current = null;
      }
    };
  }, [trigger]);

  return log;
};
