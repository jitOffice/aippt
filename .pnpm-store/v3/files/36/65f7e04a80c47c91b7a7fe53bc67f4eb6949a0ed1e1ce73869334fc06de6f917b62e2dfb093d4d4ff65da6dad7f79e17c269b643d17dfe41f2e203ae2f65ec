"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NativeTaskHasherImpl = void 0;
const native_1 = require("../native");
const transform_objects_1 = require("../native/transform-objects");
const typescript_1 = require("../plugins/js/utils/typescript");
const fileutils_1 = require("../utils/fileutils");
class NativeTaskHasherImpl {
    constructor(workspaceRoot, nxJson, projectGraph, externals, options) {
        this.projectGraphRef = (0, native_1.transferProjectGraph)((0, transform_objects_1.transformProjectGraphForRust)(projectGraph));
        this.allWorkspaceFilesRef = externals.allWorkspaceFiles;
        this.projectFileMapRef = externals.projectFiles;
        let tsconfig = {};
        let paths = {};
        let rootTsConfigPath = (0, typescript_1.getRootTsConfigPath)();
        if (rootTsConfigPath) {
            tsconfig = (0, fileutils_1.readJsonFile)((0, typescript_1.getRootTsConfigPath)());
            paths = tsconfig.compilerOptions?.paths ?? {};
            if (tsconfig.compilerOptions?.paths) {
                delete tsconfig.compilerOptions.paths;
            }
        }
        this.planner = new native_1.HashPlanner(nxJson, this.projectGraphRef);
        this.hasher = new native_1.TaskHasher(workspaceRoot, this.projectGraphRef, this.projectFileMapRef, this.allWorkspaceFilesRef, Buffer.from(JSON.stringify(tsconfig)), paths, rootTsConfigPath, options);
    }
    async hashTask(task, taskGraph, env, cwd) {
        const plans = this.planner.getPlansReference([task.id], taskGraph);
        const hashes = this.hasher.hashPlans(plans, env, cwd ?? process.cwd());
        return hashes[task.id];
    }
    async hashTasks(tasks, taskGraph, env, cwd) {
        const plans = this.planner.getPlansReference(tasks.map((t) => t.id), taskGraph);
        const hashes = this.hasher.hashPlans(plans, env, cwd ?? process.cwd());
        return tasks.map((t) => hashes[t.id]);
    }
}
exports.NativeTaskHasherImpl = NativeTaskHasherImpl;
