"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskIOService = getTaskIOService;
exports.registerTaskProcessStart = registerTaskProcessStart;
const process_metrics_service_1 = require("./process-metrics-service");
/**
 * Service for tracking task process IDs and providing access to task IO information.
 * Subscribes to ProcessMetricsService for PID discovery.
 * IO information comes from hash inputs (populated during hashing).
 * Output files are reported when tasks are stored to cache.
 */
class TaskIOService {
    constructor(projectGraph, taskGraph) {
        // Used to call subscribers that were late to the party
        this.taskToPids = new Map();
        this.taskToInputs = new Map();
        this.taskToOutputs = new Map();
        // Subscription state
        this.pidCallbacks = [];
        this.taskInputCallbacks = [];
        this.taskOutputsCallbacks = [];
        // Project graph and task graph for resolving task information
        this.projectGraph = null;
        this.taskGraph = null;
        if (projectGraph) {
            this.projectGraph = projectGraph;
        }
        if (taskGraph) {
            this.taskGraph = taskGraph;
        }
    }
    /**
     * Subscribe to task PID updates.
     * Receives notifications when processes are added/removed from tasks.
     */
    subscribeToTaskPids(callback) {
        this.pidCallbacks.push(callback);
        // Emit current state to new subscriber
        for (const [taskId, pid] of this.taskToPids) {
            callback({
                taskId,
                pid,
            });
        }
    }
    /**
     * Subscribe to hash inputs as they are computed.
     * Called when a task's hash inputs become available.
     */
    subscribeToTaskInputs(callback) {
        this.taskInputCallbacks.push(callback);
        // Emit current state to new subscriber
        for (const [, taskInputInfo] of this.taskToInputs) {
            callback(taskInputInfo);
        }
    }
    /**
     * Subscribe to task outputs as they are stored to cache.
     * Called when a task's output files are collected for caching.
     */
    subscribeToTaskOutputs(callback) {
        this.taskOutputsCallbacks.push(callback);
        // Emit current state to new subscriber
        for (const [task, outputs] of this.taskToOutputs) {
            callback({
                taskId: task,
                outputs: outputs,
            });
        }
    }
    /**
     * Notify subscribers that hash inputs are available for a task.
     * Called from the hasher when inputs are computed.
     */
    notifyTaskInputs(taskId, inputs) {
        const taskInputInfo = {
            taskId,
            inputs,
        };
        this.taskToInputs.set(taskId, taskInputInfo);
        for (const cb of this.taskInputCallbacks) {
            try {
                cb(taskInputInfo);
            }
            catch {
                // Silent failure - don't let one callback break others
            }
        }
    }
    /**
     * Notify subscribers that task outputs have been collected.
     * Called from the cache when outputs are stored.
     */
    notifyTaskOutputs(taskId, outputs) {
        this.taskToOutputs.set(taskId, outputs);
        const update = {
            taskId,
            outputs,
        };
        for (const cb of this.taskOutputsCallbacks) {
            try {
                cb(update);
            }
            catch {
                // Silent failure - don't let one callback break others
            }
        }
    }
    /**
     * Registers a PID to a task and notifies subscribers.
     * @param update The TaskPidUpdate containing taskId and pid.
     */
    notifyPidUpdate(update) {
        this.taskToPids.set(update.taskId, update.pid);
        for (const cb of this.pidCallbacks) {
            try {
                cb(update);
            }
            catch {
                // Silent failure - don't let one callback break others
            }
        }
    }
}
// Singleton
let instance = null;
/**
 * Get or create the singleton TaskIOService instance.
 * Optionally provide projectGraph and taskGraph to initialize with context.
 */
function getTaskIOService(projectGraph, taskGraph) {
    if (!instance) {
        instance = new TaskIOService(projectGraph, taskGraph);
    }
    return instance;
}
/**
 * Register a task process start with both IO and metrics services.
 * This is the standard way to notify the system that a task process has started.
 * Both services need to be notified together - TaskIOService for external subscribers
 * and ProcessMetricsService for native resource monitoring.
 */
function registerTaskProcessStart(taskId, pid) {
    getTaskIOService().notifyPidUpdate({ taskId, pid });
    (0, process_metrics_service_1.getProcessMetricsService)().registerTaskProcess(taskId, pid);
}
