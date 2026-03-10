import { ProjectGraph } from '../config/project-graph';
import { TaskGraph } from '../config/task-graph';
/**
 * Maps taskId -> PID. Note that this only Returns
 * the PID that the main task process is running under,
 * not any child processes it may have spawned. To fully
 * trace the task's processes, you'll need to correlate
 * spawned processes's PIDs with their parent PID.
 */
export type TaskPidUpdate = {
    taskId: string;
    pid: number;
};
export type TaskPidCallback = (update: TaskPidUpdate) => void;
export type TaskInputInfo = {
    taskId: string;
    inputs: {
        files: string[];
        runtime: string[];
        environment: string[];
        depOutputs: string[];
        external: string[];
    };
};
export type TaskInputCallback = (taskInputInfo: TaskInputInfo) => void;
export type TaskOutputsUpdate = {
    taskId: string;
    outputs: string[];
};
export type TaskOutputsCallback = (update: TaskOutputsUpdate) => void;
/**
 * Service for tracking task process IDs and providing access to task IO information.
 * Subscribes to ProcessMetricsService for PID discovery.
 * IO information comes from hash inputs (populated during hashing).
 * Output files are reported when tasks are stored to cache.
 */
declare class TaskIOService {
    protected taskToPids: Map<string, number>;
    protected taskToInputs: Map<string, TaskInputInfo>;
    protected taskToOutputs: Map<string, string[]>;
    private pidCallbacks;
    private taskInputCallbacks;
    private taskOutputsCallbacks;
    protected projectGraph: ProjectGraph | null;
    protected taskGraph: TaskGraph | null;
    constructor(projectGraph?: ProjectGraph, taskGraph?: TaskGraph);
    /**
     * Subscribe to task PID updates.
     * Receives notifications when processes are added/removed from tasks.
     */
    subscribeToTaskPids(callback: TaskPidCallback): void;
    /**
     * Subscribe to hash inputs as they are computed.
     * Called when a task's hash inputs become available.
     */
    subscribeToTaskInputs(callback: TaskInputCallback): void;
    /**
     * Subscribe to task outputs as they are stored to cache.
     * Called when a task's output files are collected for caching.
     */
    subscribeToTaskOutputs(callback: TaskOutputsCallback): void;
    /**
     * Notify subscribers that hash inputs are available for a task.
     * Called from the hasher when inputs are computed.
     */
    notifyTaskInputs(taskId: string, inputs: {
        files: string[];
        runtime: string[];
        environment: string[];
        depOutputs: string[];
        external: string[];
    }): void;
    /**
     * Notify subscribers that task outputs have been collected.
     * Called from the cache when outputs are stored.
     */
    notifyTaskOutputs(taskId: string, outputs: string[]): void;
    /**
     * Registers a PID to a task and notifies subscribers.
     * @param update The TaskPidUpdate containing taskId and pid.
     */
    notifyPidUpdate(update: TaskPidUpdate): void;
}
/**
 * Get or create the singleton TaskIOService instance.
 * Optionally provide projectGraph and taskGraph to initialize with context.
 */
export declare function getTaskIOService(projectGraph?: ProjectGraph, taskGraph?: TaskGraph): TaskIOService;
/**
 * Register a task process start with both IO and metrics services.
 * This is the standard way to notify the system that a task process has started.
 * Both services need to be notified together - TaskIOService for external subscribers
 * and ProcessMetricsService for native resource monitoring.
 */
export declare function registerTaskProcessStart(taskId: string, pid: number): void;
export {};
//# sourceMappingURL=task-io-service.d.ts.map