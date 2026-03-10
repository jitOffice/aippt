"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeChildProcessWithDirectOutput = exports.NodeChildProcessWithNonDirectOutput = void 0;
const pc = require("picocolors");
const fs_1 = require("fs");
const stream_1 = require("stream");
const treeKill = require("tree-kill");
const exit_codes_1 = require("../../utils/exit-codes");
class NodeChildProcessWithNonDirectOutput {
    constructor(childProcess, { streamOutput, prefix }) {
        this.childProcess = childProcess;
        this.terminalOutputChunks = [];
        this.exitCallbacks = [];
        this.outputCallbacks = [];
        if (streamOutput) {
            if (process.env.NX_PREFIX_OUTPUT === 'true') {
                const color = getColor(prefix);
                const prefixText = `${prefix}:`;
                this.childProcess.stdout
                    .pipe(logClearLineToPrefixTransformer(pc.bold(color(prefixText)) + ' '))
                    .pipe(addPrefixTransformer(pc.bold(color(prefixText))))
                    .pipe(process.stdout);
                this.childProcess.stderr
                    .pipe(logClearLineToPrefixTransformer(color(prefixText) + ' '))
                    .pipe(addPrefixTransformer(color(prefixText)))
                    .pipe(process.stderr);
            }
            else {
                this.childProcess.stdout
                    .pipe(addPrefixTransformer())
                    .pipe(process.stdout);
                this.childProcess.stderr
                    .pipe(addPrefixTransformer())
                    .pipe(process.stderr);
            }
        }
        this.childProcess.on('exit', (code, signal) => {
            if (code === null)
                code = (0, exit_codes_1.signalToCode)(signal);
            this.exitCode = code;
            // Join once and cache before notifying exit callbacks
            this.joinedTerminalOutput = this.terminalOutputChunks.join('');
            this.terminalOutputChunks = [];
            for (const cb of this.exitCallbacks) {
                cb(code, this.joinedTerminalOutput);
            }
        });
        // Re-emit any messages from the task process
        this.childProcess.on('message', (message) => {
            if (process.send) {
                process.send(message);
            }
        });
        this.childProcess.stdout.on('data', (chunk) => {
            const output = chunk.toString();
            this.terminalOutputChunks.push(output);
            // Stream output to TUI via callbacks
            for (const cb of this.outputCallbacks) {
                cb(output);
            }
        });
        this.childProcess.stderr.on('data', (chunk) => {
            const output = chunk.toString();
            this.terminalOutputChunks.push(output);
            // Stream output to TUI via callbacks
            for (const cb of this.outputCallbacks) {
                cb(output);
            }
        });
    }
    onExit(cb) {
        this.exitCallbacks.push(cb);
    }
    onOutput(cb) {
        this.outputCallbacks.push(cb);
    }
    async getResults() {
        if (typeof this.exitCode === 'number') {
            return {
                code: this.exitCode,
                terminalOutput: this.joinedTerminalOutput ?? this.terminalOutputChunks.join(''),
            };
        }
        return new Promise((res) => {
            this.onExit((code, terminalOutput) => {
                res({ code, terminalOutput });
            });
        });
    }
    send(message) {
        if (this.childProcess.connected) {
            this.childProcess.send(message);
        }
    }
    kill(signal) {
        if (this.childProcess?.pid) {
            treeKill(this.childProcess.pid, signal, () => {
                // Ignore errors - process may have already exited
            });
        }
    }
}
exports.NodeChildProcessWithNonDirectOutput = NodeChildProcessWithNonDirectOutput;
function addPrefixTransformer(prefix) {
    const newLineSeparator = process.platform.startsWith('win') ? '\r\n' : '\n';
    return new stream_1.Transform({
        transform(chunk, _encoding, callback) {
            const list = chunk.toString().split(/\r\n|[\n\v\f\r\x85\u2028\u2029]/g);
            list
                .filter(Boolean)
                .forEach((m) => this.push(prefix ? prefix + ' ' + m + newLineSeparator : m + newLineSeparator));
            callback();
        },
    });
}
const colors = [
    pc.green,
    pc.greenBright,
    pc.blue,
    pc.blueBright,
    pc.cyan,
    pc.cyanBright,
    pc.yellow,
    pc.yellowBright,
    pc.magenta,
    pc.magentaBright,
];
function getColor(projectName) {
    let code = 0;
    for (let i = 0; i < projectName.length; ++i) {
        code += projectName.charCodeAt(i);
    }
    const colorIndex = code % colors.length;
    return colors[colorIndex];
}
/**
 * Prevents terminal escape sequence from clearing line prefix.
 */
function logClearLineToPrefixTransformer(prefix) {
    let prevChunk = null;
    return new stream_1.Transform({
        transform(chunk, _encoding, callback) {
            if (prevChunk && prevChunk.toString() === '\x1b[2K') {
                chunk = chunk.toString().replace(/\x1b\[1G/g, (m) => m + prefix);
            }
            this.push(chunk);
            prevChunk = chunk;
            callback();
        },
    });
}
class NodeChildProcessWithDirectOutput {
    constructor(childProcess, temporaryOutputPath) {
        this.childProcess = childProcess;
        this.temporaryOutputPath = temporaryOutputPath;
        this.exitCallbacks = [];
        this.exited = false;
        // Re-emit any messages from the task process
        this.childProcess.on('message', (message) => {
            if (process.send) {
                process.send(message);
            }
        });
        this.childProcess.on('exit', (code, signal) => {
            if (code === null)
                code = (0, exit_codes_1.signalToCode)(signal);
            this.exited = true;
            this.exitCode = code;
            for (const cb of this.exitCallbacks) {
                cb(code, signal);
            }
        });
    }
    send(message) {
        if (this.childProcess.connected) {
            this.childProcess.send(message);
        }
    }
    onExit(cb) {
        this.exitCallbacks.push(cb);
    }
    async getResults() {
        if (!this.exited) {
            await this.waitForExit();
        }
        const terminalOutput = this.getTerminalOutput();
        return { code: this.exitCode, terminalOutput };
    }
    waitForExit() {
        return new Promise((res) => {
            this.onExit(() => res());
        });
    }
    getTerminalOutput() {
        this.terminalOutput ??= (0, fs_1.readFileSync)(this.temporaryOutputPath).toString();
        return this.terminalOutput;
    }
    kill(signal) {
        if (this.childProcess?.pid) {
            treeKill(this.childProcess.pid, signal, () => {
                // Ignore errors - process may have already exited
            });
        }
    }
}
exports.NodeChildProcessWithDirectOutput = NodeChildProcessWithDirectOutput;
