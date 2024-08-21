import { useEffect, useState, useRef } from 'react';

export const useLogUpdates = (trigger: boolean): string[] => {
  const [log, setLog] = useState<string[]>([]);
  const logWsRef = useRef<WebSocket | null>(null);
  const logBufferRef = useRef<string[]>([]);

  useEffect(() => {
    if (trigger) {
      logWsRef.current = new WebSocket('ws://localhost:8675/logUpdates');

      logWsRef.current.onmessage = (e) => {
        logBufferRef.current.push(e.data);
        // Debounce log updates
        setTimeout(() => {
          if (logBufferRef.current.length > 0) {
            setLog((prevLog) => [...prevLog, ...logBufferRef.current]);
            logBufferRef.current = [];
          }
        }, 100);
      };

      logWsRef.current.onerror = (e) => {
        console.error(`WebSocket error: ${e}`);
      };

      logWsRef.current.onclose = (e) => {
        console.log(`WebSocket closed: ${e.code} - ${e.reason}`);
        // Attempt to reconnect after a delay
        setTimeout(() => {
          if (trigger) {
            logWsRef.current = new WebSocket('ws://localhost:8675/logUpdates');
          }
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