interface Window {
  ipcHandler: {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    send: (channel: string, ...args: any[]) => void;
    sendSync: (channel: string, ...args: any[]) => any;
    receive: (channel: string, callback: (...args: any[]) => void) => void;
    receiveOnce: (channel: string, callback: (...args: any[]) => void) => void;
    invoke: (channel: string, ...args: any[]) => Promise<any>;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    createTitleBar: () => void;
    updateTitleBarTitle? (newTitle: string) => void;
    logger?: {
      silly(...args: string[]): void;
      info(...args: string[]): void;
      warn(...args: string[]): void;
      error(...args: string[]): void;
    };
  };
}
