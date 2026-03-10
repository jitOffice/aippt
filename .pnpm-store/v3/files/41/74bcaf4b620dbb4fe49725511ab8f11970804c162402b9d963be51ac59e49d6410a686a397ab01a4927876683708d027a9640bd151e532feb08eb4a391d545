"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientLogger = exports.serverLogger = void 0;
const fs_1 = require("fs");
const tmp_dir_1 = require("./tmp-dir");
const versions_1 = require("../utils/versions");
class DaemonLogger {
    constructor(source) {
        this.source = source;
    }
    log(...s) {
        const message = this.formatLogMessage(s
            .map((val) => {
            if (typeof val === 'string') {
                return val;
            }
            return JSON.stringify(val);
        })
            .join(' '));
        if (this.source === 'Server') {
            // Server's stdout is redirected to daemon.log
            console.log(message);
        }
        else {
            // Client writes directly to the log file
            this.writeToFile(message);
        }
    }
    requestLog(...s) {
        this.log(`[REQUEST]: ${s.join(' ')}`);
    }
    watcherLog(...s) {
        this.log(`[WATCHER]: ${s.join(' ')}`);
    }
    writeToFile(message) {
        try {
            if (!(0, fs_1.existsSync)(tmp_dir_1.DAEMON_DIR_FOR_CURRENT_WORKSPACE)) {
                (0, fs_1.mkdirSync)(tmp_dir_1.DAEMON_DIR_FOR_CURRENT_WORKSPACE, { recursive: true });
            }
            (0, fs_1.appendFileSync)(tmp_dir_1.DAEMON_OUTPUT_LOG_FILE, message + '\n');
        }
        catch {
            // Ignore write errors
        }
    }
    formatLogMessage(message) {
        return `[NX v${versions_1.nxVersion} Daemon ${this.source}] - ${this.getNow()} - ${message}`;
    }
    getNow() {
        return new Date(Date.now()).toISOString();
    }
}
exports.serverLogger = new DaemonLogger('Server');
exports.clientLogger = new DaemonLogger('Client');
