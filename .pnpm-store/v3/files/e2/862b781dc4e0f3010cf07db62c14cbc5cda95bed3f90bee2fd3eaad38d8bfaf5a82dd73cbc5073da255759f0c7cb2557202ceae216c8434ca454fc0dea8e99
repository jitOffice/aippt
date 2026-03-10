/**
 * Unified logger for daemon server and client.
 *
 * To improve the overall readability of the logs, we categorize things by "trigger":
 *
 * - [REQUEST] meaning that the current set of actions were triggered by a client request to the server
 * - [WATCHER] meaning the current set of actions were triggered by handling changes to the workspace files
 *
 * We keep those two "triggers" left aligned at the top level and then indent subsequent logs so that there is a
 * logical hierarchy/grouping.
 */
type LogSource = 'Server' | 'Client';
declare class DaemonLogger {
    private source;
    constructor(source: LogSource);
    log(...s: unknown[]): void;
    requestLog(...s: unknown[]): void;
    watcherLog(...s: unknown[]): void;
    private writeToFile;
    private formatLogMessage;
    private getNow;
}
export declare const serverLogger: DaemonLogger;
export declare const clientLogger: DaemonLogger;
export {};
//# sourceMappingURL=logger.d.ts.map