import { Socket } from 'net';
export interface Message extends Record<string, any> {
    type: string;
    data?: any;
}
export declare class VersionMismatchError extends Error {
    constructor();
}
export declare class DaemonSocketMessenger {
    private socket;
    constructor(socket: Socket);
    sendMessage(messageToDaemon: Message, force?: 'v8' | 'json'): void;
    listen(onData: (message: string) => void, onClose?: () => void, onError?: (err: Error) => void): DaemonSocketMessenger;
    close(): void;
}
//# sourceMappingURL=daemon-socket-messenger.d.ts.map