"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTaskDetails = getTaskDetails;
exports.hashTasksThatDoNotDependOnOutputsOfOtherTasks = hashTasksThatDoNotDependOnOutputsOfOtherTasks;
exports.hashTask = hashTask;
exports.hashTasks = hashTasks;
const nx_json_1 = require("../config/nx-json");
const native_1 = require("../native");
const project_graph_1 = require("../project-graph/project-graph");
const task_io_service_1 = require("../tasks-runner/task-io-service");
const utils_1 = require("../tasks-runner/utils");
const db_connection_1 = require("../utils/db-connection");
const task_hasher_1 = require("./task-hasher");
let taskDetails;
function getTaskDetails() {
    // TODO: Remove when wasm supports sqlite
    if (native_1.IS_WASM) {
        return null;
    }
    if (!taskDetails) {
        taskDetails = new native_1.TaskDetails((0, db_connection_1.getDbConnection)());
    }
    return taskDetails;
}
async function hashTasksThatDoNotDependOnOutputsOfOtherTasks(hasher, projectGraph, taskGraph, nxJson, tasksDetails) {
    performance.mark('hashMultipleTasks:start');
    const tasks = Object.values(taskGraph.tasks);
    const tasksWithHashers = await Promise.all(tasks.map(async (task) => {
        const customHasher = (0, utils_1.getCustomHasher)(task, projectGraph);
        return { task, customHasher };
    }));
    const tasksToHash = tasksWithHashers
        .filter(({ task, customHasher }) => {
        // If a task has a custom hasher, it might depend on the outputs of other tasks
        if (customHasher && customHasher.name !== 'eslint-hasher') {
            return false;
        }
        return !(taskGraph.dependencies[task.id].length > 0 &&
            (0, task_hasher_1.getInputs)(task, projectGraph, nxJson).depsOutputs.length > 0);
    })
        .map((t) => t.task);
    const hashes = await hasher.hashTasks(tasksToHash, taskGraph, process.env);
    const ioService = (0, task_io_service_1.getTaskIOService)();
    for (let i = 0; i < tasksToHash.length; i++) {
        tasksToHash[i].hash = hashes[i].value;
        tasksToHash[i].hashDetails = hashes[i].details;
        // Notify TaskIOService of hash inputs
        if (hashes[i].inputs) {
            ioService.notifyTaskInputs(tasksToHash[i].id, hashes[i].inputs);
        }
    }
    if (tasksDetails?.recordTaskDetails) {
        tasksDetails.recordTaskDetails(tasksToHash.map((task) => ({
            hash: task.hash,
            project: task.target.project,
            target: task.target.target,
            configuration: task.target.configuration,
        })));
    }
    performance.mark('hashMultipleTasks:end');
    performance.measure('hashMultipleTasks', 'hashMultipleTasks:start', 'hashMultipleTasks:end');
}
async function hashTask(hasher, projectGraph, taskGraph, task, env, taskDetails) {
    performance.mark('hashSingleTask:start');
    const customHasher = (0, utils_1.getCustomHasher)(task, projectGraph);
    const projectsConfigurations = (0, project_graph_1.readProjectsConfigurationFromProjectGraph)(projectGraph);
    const { value, details, inputs } = await (customHasher
        ? customHasher(task, {
            hasher,
            projectGraph,
            taskGraph,
            workspaceConfig: projectsConfigurations, // to make the change non-breaking. Remove after v19
            projectsConfigurations,
            nxJsonConfiguration: (0, nx_json_1.readNxJson)(),
            env,
        })
        : hasher.hashTask(task, taskGraph, env));
    task.hash = value;
    task.hashDetails = details;
    // Notify TaskIOService of hash inputs
    if (inputs) {
        (0, task_io_service_1.getTaskIOService)().notifyTaskInputs(task.id, inputs);
    }
    if (taskDetails?.recordTaskDetails) {
        taskDetails.recordTaskDetails([
            {
                hash: task.hash,
                project: task.target.project,
                target: task.target.target,
                configuration: task.target.configuration,
            },
        ]);
    }
    performance.mark('hashSingleTask:end');
    performance.measure('hashSingleTask', 'hashSingleTask:start', 'hashSingleTask:end');
}
async function hashTasks(hasher, projectGraph, taskGraph, env, taskDetails) {
    performance.mark('hashMultipleTasks:start');
    const projectsConfigurations = (0, project_graph_1.readProjectsConfigurationFromProjectGraph)(projectGraph);
    const nxJson = (0, nx_json_1.readNxJson)();
    const tasks = Object.values(taskGraph.tasks).filter((task) => !task.hash);
    // Separate tasks with custom hashers from those without
    const tasksWithCustomHashers = [];
    const tasksWithoutCustomHashers = [];
    for (const task of tasks) {
        const customHasher = (0, utils_1.getCustomHasher)(task, projectGraph);
        if (customHasher) {
            tasksWithCustomHashers.push(task);
        }
        else {
            tasksWithoutCustomHashers.push(task);
        }
    }
    // Hash tasks with custom hashers individually
    const ioService = (0, task_io_service_1.getTaskIOService)();
    const customHasherPromises = tasksWithCustomHashers.map(async (task) => {
        const customHasher = (0, utils_1.getCustomHasher)(task, projectGraph);
        const { value, details, inputs } = await customHasher(task, {
            hasher,
            projectGraph,
            taskGraph,
            workspaceConfig: projectsConfigurations,
            projectsConfigurations,
            nxJsonConfiguration: nxJson,
            env,
        });
        task.hash = value;
        task.hashDetails = details;
        // Notify TaskIOService of hash inputs
        if (inputs) {
            ioService.notifyTaskInputs(task.id, inputs);
        }
    });
    // Hash tasks without custom hashers in batch
    let batchHashPromise = Promise.resolve();
    if (tasksWithoutCustomHashers.length > 0) {
        batchHashPromise = hasher
            .hashTasks(tasksWithoutCustomHashers, taskGraph, env)
            .then((hashes) => {
            for (let i = 0; i < tasksWithoutCustomHashers.length; i++) {
                tasksWithoutCustomHashers[i].hash = hashes[i].value;
                tasksWithoutCustomHashers[i].hashDetails = hashes[i].details;
                // Notify TaskIOService of hash inputs
                if (hashes[i].inputs) {
                    ioService.notifyTaskInputs(tasksWithoutCustomHashers[i].id, hashes[i].inputs);
                }
            }
        });
    }
    await Promise.all([...customHasherPromises, batchHashPromise]);
    if (taskDetails?.recordTaskDetails) {
        taskDetails.recordTaskDetails(tasks.map((task) => ({
            hash: task.hash,
            project: task.target.project,
            target: task.target.target,
            configuration: task.target.configuration,
        })));
    }
    performance.mark('hashMultipleTasks:end');
    performance.measure('hashMultipleTasks', 'hashMultipleTasks:start', 'hashMultipleTasks:end');
}
