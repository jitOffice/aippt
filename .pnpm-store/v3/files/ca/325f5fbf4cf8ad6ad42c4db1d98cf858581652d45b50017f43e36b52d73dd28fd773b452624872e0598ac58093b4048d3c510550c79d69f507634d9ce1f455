import * as package_manager_detector from 'package-manager-detector';
import { Agent, ResolvedCommand, Command } from 'package-manager-detector';
import { Buffer } from 'node:buffer';
export * from 'package-manager-detector/commands';
export * from 'package-manager-detector/constants';

interface Config {
    defaultAgent: Agent | 'prompt';
    globalAgent: Agent;
    runAgent: 'node' | undefined;
    useSfw: boolean;
}
declare function getConfig(): Promise<Config>;
declare function getDefaultAgent(programmatic?: boolean): Promise<Agent | "prompt">;
declare function getGlobalAgent(): Promise<Agent>;
declare function getRunAgent(): Promise<"node" | undefined>;
declare function getUseSfw(): Promise<boolean>;

interface DetectOptions {
    autoInstall?: boolean;
    programmatic?: boolean;
    cwd?: string;
    /**
     * Should use Volta when present
     *
     * @see https://volta.sh/
     * @default true
     */
    detectVolta?: boolean;
}
declare function detect({ autoInstall, programmatic, cwd }?: DetectOptions): Promise<package_manager_detector.Agent | undefined>;

interface RunnerContext {
    programmatic?: boolean;
    hasLock?: boolean;
    cwd?: string;
}
interface ExtendedResolvedCommand extends ResolvedCommand {
    cwd?: string;
}
interface RunOptions {
    /**
     * Called before agent detection and command execution.
     *
     * Useful for performing concrete, agent-agnostic operations.
     */
    onBeforeCommand?: (args: string[], ctx: Pick<RunnerContext, 'cwd' | 'programmatic'> & {
        /**
         * Skips subsequent command execution.
         *
         * This is useful for operations such as generating shell-completion scripts.
         */
        exit: () => void;
    }) => void | Promise<void>;
}
type Runner = (agent: Agent, args: string[], ctx?: RunnerContext) => Promise<ExtendedResolvedCommand | undefined> | ExtendedResolvedCommand | undefined;
declare function runCli(fn: Runner, options?: DetectOptions & RunOptions & {
    args?: string[];
}): Promise<void>;
declare function getCliCommand(fn: Runner, args: string[], options?: DetectOptions, cwd?: string): Promise<ExtendedResolvedCommand | undefined>;
declare function run(fn: Runner, args: string[], options?: DetectOptions & RunOptions): Promise<void>;

declare class UnsupportedCommand extends Error {
    constructor({ agent, command }: {
        agent: Agent;
        command: Command;
    });
}
declare function getCommand(agent: Agent, command: Command, args?: string[]): ExtendedResolvedCommand;
declare const parseNi: Runner;
declare const parseNr: Runner;
declare const parseNup: Runner;
declare const parseNd: Runner;
declare const parseNun: Runner;
declare const parseNlx: Runner;
declare const parseNa: Runner;
declare function serializeCommand(command?: ResolvedCommand): string | undefined;

declare const CLI_TEMP_DIR: string;
declare function remove<T>(arr: T[], v: T): T[];
declare function exclude<T>(arr: T[], ...v: T[]): T[];
declare function cmdExists(cmd: string): boolean;
/**
 * Write file safely avoiding conflicts
 */
declare function writeFileSafe(path: string, data?: string | Buffer): Promise<boolean>;
declare function limitText(text: string, maxWidth: number): string;
declare function formatPackageWithUrl(pkg: string, url?: string, limits?: number): string;

export { CLI_TEMP_DIR, UnsupportedCommand, cmdExists, detect, exclude, formatPackageWithUrl, getCliCommand, getCommand, getConfig, getDefaultAgent, getGlobalAgent, getRunAgent, getUseSfw, limitText, parseNa, parseNd, parseNi, parseNlx, parseNr, parseNun, parseNup, remove, run, runCli, serializeCommand, writeFileSafe };
export type { DetectOptions, ExtendedResolvedCommand, Runner, RunnerContext };
