"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsolatedPlugin = void 0;
const child_process_1 = require("child_process");
const net_1 = require("net");
const path = require("path");
const socket_utils_1 = require("../../../daemon/socket-utils");
const consume_messages_from_socket_1 = require("../../../utils/consume-messages-from-socket");
const installation_directory_1 = require("../../../utils/installation-directory");
const logger_1 = require("../../../utils/logger");
const resolve_plugin_1 = require("../resolve-plugin");
const messaging_1 = require("./messaging");
const plugin_lifecycle_manager_1 = require("./plugin-lifecycle-manager");
const PLUGIN_TIMEOUT_HINT_TEXT = 'As a last resort, you can set NX_PLUGIN_NO_TIMEOUTS=true to bypass this timeout.';
const MINUTES = 10;
const MAX_MESSAGE_WAIT = process.env.NX_PLUGIN_NO_TIMEOUTS === 'true'
    ? // Registering a timeout prevents the process from exiting
        // if the call to a plugin happens to be the only thing
        // keeping the process alive. As such, even if timeouts are disabled
        // we need to register one. 2147483647 is the max timeout
        // that Node.js allows, and is equivalent to 24.8 days.
        2147483647
    : 1000 * 60 * MINUTES;
class IsolatedPlugin {
    /**
     * Creates and loads an isolated plugin worker.
     */
    static async load(plugin, root, index) {
        const moduleName = typeof plugin === 'string' ? plugin : plugin.plugin;
        const { name, pluginPath, shouldRegisterTSTranspiler } = await (0, resolve_plugin_1.resolveNxPlugin)(moduleName, root, (0, installation_directory_1.getNxRequirePaths)(root));
        const instance = new IsolatedPlugin(plugin, root, name, pluginPath, shouldRegisterTSTranspiler, index);
        const loadResult = await instance.spawnAndConnect();
        instance.setupHooks(loadResult);
        return instance;
    }
    constructor(plugin, root, name, pluginPath, shouldRegisterTSTranspiler, index) {
        this.index = index;
        // Worker state
        this.worker = null;
        this.socket = null;
        this._alive = false;
        this._connectPromise = null;
        this.txId = 0;
        this.pendingCount = 0;
        // Typed response handlers keyed by transaction ID
        this.responseHandlers = new Map();
        this.exitHandler = null;
        this.handleSocketData = (raw) => {
            const message = JSON.parse(raw);
            if (!(0, messaging_1.isPluginWorkerResult)(message)) {
                return;
            }
            const pending = this.responseHandlers.get(message.tx);
            if (pending) {
                this.responseHandlers.delete(message.tx);
                pending.onMessage(message);
            }
        };
        this.plugin = plugin;
        this.root = root;
        this.name = name;
        this.pluginPath = pluginPath;
        this.shouldRegisterTSTranspiler = shouldRegisterTSTranspiler;
    }
    async spawnAndConnect() {
        const { worker, socket } = await startPluginWorker(this.name);
        this.worker = worker;
        this.socket = socket;
        this.registerProcessMetrics();
        this.exitHandler = () => {
            this._alive = false;
            this._connectPromise = null;
            if (this.worker?.stdout) {
                this.worker.stdout.unpipe(process.stdout);
            }
            if (this.worker?.stderr) {
                this.worker.stderr.unpipe(process.stderr);
            }
            // Reject all pending requests
            const error = new Error(`Plugin worker "${this.name}" exited unexpectedly.`);
            for (const { onError } of this.responseHandlers.values()) {
                onError(error);
            }
            this.responseHandlers.clear();
        };
        worker.on('exit', this.exitHandler);
        socket.on('data', (0, consume_messages_from_socket_1.consumeMessagesFromSocket)(this.handleSocketData));
        return this.sendLoadMessage();
    }
    /**
     * Ensures the worker is alive, restarting it if necessary.
     * Called before each hook execution to handle plugins that were
     * eagerly shutdown (e.g., post-task-only plugins).
     *
     * Uses a stored promise to coalesce concurrent restart attempts
     * so that only one worker is ever spawned at a time.
     */
    async ensureAlive() {
        if (this._alive) {
            return;
        }
        if (!this._connectPromise) {
            logger_1.logger.verbose(`[plugin-client] restarting worker for "${this.name}"`);
            this._connectPromise = this.spawnAndConnect();
        }
        await this._connectPromise;
    }
    sendLoadMessage() {
        return new Promise((resolve, reject) => {
            const tx = this.generateTxId('load');
            const timeout = setTimeout(() => {
                this.responseHandlers.delete(tx);
                reject(new Error(`Loading "${typeof this.plugin === 'string' ? this.plugin : this.plugin.plugin}" timed out after ${MINUTES} minutes. ${PLUGIN_TIMEOUT_HINT_TEXT}`));
            }, MAX_MESSAGE_WAIT);
            this.responseHandlers.set(tx, {
                onMessage: (msg) => {
                    clearTimeout(timeout);
                    if (msg.type !== 'loadResult') {
                        reject(new Error(`Expected loadResult, got ${msg.type}`));
                        return;
                    }
                    const payload = msg.payload;
                    if (payload.success === false) {
                        reject(payload.error);
                    }
                    else {
                        this._alive = true;
                        resolve(payload);
                    }
                },
                onError: (error) => {
                    clearTimeout(timeout);
                    reject(error);
                },
            });
            (0, messaging_1.sendMessageOverSocket)(this.socket, {
                type: 'load',
                payload: {
                    plugin: this.plugin,
                    root: this.root,
                    name: this.name,
                    pluginPath: this.pluginPath,
                    shouldRegisterTSTranspiler: this.shouldRegisterTSTranspiler,
                },
                tx,
            });
        });
    }
    setupHooks(loadResult) {
        // These are set via Object.defineProperty to work around readonly
        this.name = loadResult.name;
        this.include = loadResult.include;
        this.exclude = loadResult.exclude;
        const registeredHooks = hooks(loadResult.createNodesPattern && 'createNodes', loadResult.hasCreateDependencies && 'createDependencies', loadResult.hasCreateMetadata && 'createMetadata', loadResult.hasPreTasksExecution && 'preTasksExecution', loadResult.hasPostTasksExecution && 'postTasksExecution');
        this.lifecycle = new plugin_lifecycle_manager_1.PluginLifecycleManager(registeredHooks);
        const shutdown = () => this.shutdownIfInactive();
        const wrap = (hook, hookFn) => this.lifecycle.wrapHook(hook, async (...args) => {
            await this.ensureAlive();
            return hookFn(...args);
        }, shutdown);
        if (loadResult.createNodesPattern) {
            this.createNodes = [
                loadResult.createNodesPattern,
                wrap('createNodes', async (configFiles, ctx) => {
                    const result = await this.sendRequest('createNodes', {
                        configFiles,
                        context: ctx,
                    });
                    if (result.success === false) {
                        throw result.error;
                    }
                    return result.result;
                }),
            ];
        }
        if (loadResult.hasCreateDependencies) {
            this.createDependencies = wrap('createDependencies', async (ctx) => {
                const result = await this.sendRequest('createDependencies', {
                    context: ctx,
                });
                if (result.success === false) {
                    throw result.error;
                }
                return result.dependencies;
            });
        }
        if (loadResult.hasCreateMetadata) {
            this.createMetadata = wrap('createMetadata', async (graph, ctx) => {
                const result = await this.sendRequest('createMetadata', {
                    graph,
                    context: ctx,
                });
                if (result.success === false) {
                    throw result.error;
                }
                return result.metadata;
            });
        }
        if (loadResult.hasPreTasksExecution) {
            this.preTasksExecution = wrap('preTasksExecution', async (context) => {
                const result = await this.sendRequest('preTasksExecution', {
                    context,
                });
                if (result.success === false) {
                    throw result.error;
                }
                return result.mutations;
            });
        }
        if (loadResult.hasPostTasksExecution) {
            this.postTasksExecution = wrap('postTasksExecution', async (context) => {
                const result = await this.sendRequest('postTasksExecution', {
                    context,
                });
                if (result.success === false) {
                    throw result.error;
                }
            });
        }
        // Shut down immediately if no graph phase hooks
        if (this.lifecycle.shouldShutdownImmediately()) {
            this.shutdown();
        }
    }
    generateTxId(type) {
        return `${this.name}:${this.worker?.pid ?? ''}:${type}:${this.txId++}`;
    }
    sendRequest(type, payload) {
        const tx = this.generateTxId(type);
        this.pendingCount++;
        return new Promise((resolve, reject) => {
            const expectedResultType = `${type}Result`;
            const timeout = setTimeout(() => {
                this.responseHandlers.delete(tx);
                this.pendingCount--;
                reject(new Error(`${this.name} timed out after ${MINUTES} minutes during ${type}. ${PLUGIN_TIMEOUT_HINT_TEXT}`));
            }, MAX_MESSAGE_WAIT);
            this.responseHandlers.set(tx, {
                onMessage: (msg) => {
                    clearTimeout(timeout);
                    this.pendingCount--;
                    if (msg.type !== expectedResultType) {
                        reject(new Error(`Expected ${expectedResultType}, got ${msg.type}`));
                        return;
                    }
                    resolve(msg.payload);
                },
                onError: (error) => {
                    clearTimeout(timeout);
                    this.pendingCount--;
                    reject(error);
                },
            });
            (0, messaging_1.sendMessageOverSocket)(this.socket, {
                type,
                payload,
                tx,
            });
        });
    }
    shutdownIfInactive() {
        if (this.pendingCount > 0) {
            logger_1.logger.verbose(`[isolated-plugin] worker for "${this.name}" has ${this.pendingCount} pending request(s), not shutting down yet`);
            return;
        }
        logger_1.logger.verbose(`[isolated-plugin] shutting down worker for "${this.name}" after last hook`);
        this.shutdown();
    }
    shutdown() {
        if (!this._alive)
            return;
        this._alive = false;
        this._connectPromise = null;
        if (this.worker && this.exitHandler) {
            this.worker.off('exit', this.exitHandler);
        }
        if (this.worker?.stdout) {
            this.worker.stdout.unpipe(process.stdout);
            this.worker.stdout.destroy();
        }
        if (this.worker?.stderr) {
            this.worker.stderr.unpipe(process.stderr);
            this.worker.stderr.destroy();
        }
        if (this.socket) {
            this.socket.end();
        }
        this.worker = null;
        this.socket = null;
        this.exitHandler = null;
    }
    registerProcessMetrics() {
        if (!this.worker?.pid)
            return;
        (async () => {
            try {
                const { isOnDaemon } = await Promise.resolve().then(() => require('../../../daemon/is-on-daemon'));
                if (!isOnDaemon()) {
                    const { getProcessMetricsService } = await Promise.resolve().then(() => require('../../../tasks-runner/process-metrics-service'));
                    getProcessMetricsService().registerMainCliSubprocess(this.worker.pid, `${this.name}${this.index !== undefined ? ` (${this.index})` : ''}`);
                }
            }
            catch {
                // Silently ignore - metrics collection is optional
            }
        })();
    }
}
exports.IsolatedPlugin = IsolatedPlugin;
// --- Worker Spawning Utilities ---
global.nxPluginWorkerCount ??= 0;
async function startPluginWorker(name) {
    performance.mark(`start-plugin-worker:${name}`);
    const isWorkerTypescript = path.extname(__filename) === '.ts';
    const workerPath = path.join(__dirname, 'plugin-worker');
    const env = {
        ...process.env,
        ...(isWorkerTypescript
            ? {
                TS_NODE_PROJECT: path.join(__dirname, '../../../../tsconfig.lib.json'),
            }
            : {}),
    };
    const ipcPath = (0, socket_utils_1.getPluginOsSocketPath)([process.pid, global.nxPluginWorkerCount++, performance.now()].join('-'));
    const worker = (0, child_process_1.spawn)(process.execPath, [
        ...(isWorkerTypescript ? ['--require', 'ts-node/register'] : []),
        workerPath,
        ipcPath,
        name,
    ], {
        stdio: ['ignore', 'pipe', 'pipe'],
        env,
        detached: true,
        shell: false,
        windowsHide: true,
    });
    logger_1.logger.verbose(`[isolated-plugin] spawned worker for "${name}" (pid: ${worker.pid}, socket: ${ipcPath})`);
    const stdoutMaxListeners = process.stdout.getMaxListeners();
    const stderrMaxListeners = process.stderr.getMaxListeners();
    if (stdoutMaxListeners !== 0) {
        process.stdout.setMaxListeners(stdoutMaxListeners + 1);
    }
    if (stderrMaxListeners !== 0) {
        process.stderr.setMaxListeners(stderrMaxListeners + 1);
    }
    pipeAndUnrefChildStream(worker.stdout, process.stdout, 'stdout');
    pipeAndUnrefChildStream(worker.stderr, process.stderr, 'stderr');
    worker.unref();
    let attempts = 0;
    return new Promise((resolve, reject) => {
        const id = setInterval(async () => {
            const socket = await isServerAvailable(ipcPath);
            if (socket) {
                socket.unref();
                clearInterval(id);
                logger_1.logger.verbose(`[isolated-plugin] connected to worker for "${name}" (pid: ${worker.pid}) after ${attempts} attempt(s)`);
                resolve({ worker, socket });
            }
            else if (attempts > 10000) {
                clearInterval(id);
                reject(new Error(`Failed to start plugin worker for plugin ${name}`));
            }
            else {
                attempts++;
            }
        }, 10);
    }).finally(() => {
        performance.mark(`start-plugin-worker-end:${name}`);
        performance.measure(`start-plugin-worker:${name}`, `start-plugin-worker:${name}`, `start-plugin-worker-end:${name}`);
    });
}
function isServerAvailable(ipcPath) {
    return new Promise((resolve) => {
        try {
            const socket = (0, net_1.connect)(ipcPath, () => {
                resolve(socket);
            });
            socket.once('error', () => {
                resolve(false);
            });
        }
        catch {
            resolve(false);
        }
    });
}
function getTypeName(u) {
    if (u === null)
        return 'null';
    if (u === undefined)
        return 'undefined';
    if (typeof u !== 'object')
        return typeof u;
    if (Array.isArray(u)) {
        const innerTypes = u.map((el) => getTypeName(el));
        return `Array<${Array.from(new Set(innerTypes)).join('|')}>`;
    }
    return u.constructor?.name ?? 'unknown object';
}
function detectAlternativeRuntime() {
    if ('Bun' in globalThis && typeof globalThis.Bun !== 'undefined') {
        return 'bun';
    }
    if ('Deno' in globalThis && typeof globalThis.Deno !== 'undefined') {
        return 'deno';
    }
    return null;
}
function pipeAndUnrefChildStream(source, destination, streamName) {
    if (!source) {
        return;
    }
    source.pipe(destination);
    if (source instanceof net_1.Socket) {
        source.unref();
        return;
    }
    if (typeof source.unref === 'function') {
        source.unref();
        return;
    }
    const runtime = detectAlternativeRuntime();
    if (runtime) {
        console.warn(`[NX] worker.${streamName} does not support unref() in ${runtime}. ` +
            `This may cause the process to hang when waiting for plugin workers to exit. ` +
            `This is a known limitation of ${runtime}'s Node.js compatibility layer.`);
    }
    else {
        console.warn(`[NX] worker.${streamName} is not a net.Socket and does not have an unref() method. ` +
            `Expected Socket, got ${getTypeName(source)}. ` +
            `This may cause the process to hang when waiting for plugin workers to exit.`);
    }
}
function hooks(...array) {
    return array.filter((v) => !!v);
}
