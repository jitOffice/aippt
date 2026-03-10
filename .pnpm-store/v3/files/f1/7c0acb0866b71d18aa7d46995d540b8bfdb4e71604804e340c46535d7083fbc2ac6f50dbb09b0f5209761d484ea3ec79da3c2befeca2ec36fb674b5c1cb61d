import { NxJsonConfiguration } from '../config/nx-json';
import { ProjectGraph } from '../config/project-graph';
import { Task, TaskGraph } from '../config/task-graph';
import { TaskDetails } from '../native';
import { TaskHasher } from './task-hasher';
export declare function getTaskDetails(): TaskDetails | null;
export declare function hashTasksThatDoNotDependOnOutputsOfOtherTasks(hasher: TaskHasher, projectGraph: ProjectGraph, taskGraph: TaskGraph, nxJson: NxJsonConfiguration, tasksDetails: TaskDetails | null): Promise<void>;
export declare function hashTask(hasher: TaskHasher, projectGraph: ProjectGraph, taskGraph: TaskGraph, task: Task, env: NodeJS.ProcessEnv, taskDetails: TaskDetails | null): Promise<void>;
export declare function hashTasks(hasher: TaskHasher, projectGraph: ProjectGraph, taskGraph: TaskGraph, env: NodeJS.ProcessEnv, taskDetails: TaskDetails | null): Promise<void>;
//# sourceMappingURL=hash-task.d.ts.map