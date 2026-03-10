"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configureAiAgentsHandler = configureAiAgentsHandler;
exports.configureAiAgentsHandlerImpl = configureAiAgentsHandlerImpl;
const enquirer_1 = require("enquirer");
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const pc = require("picocolors");
const constants_1 = require("../../ai/constants");
const utils_1 = require("../../ai/utils");
const devkit_internals_1 = require("../../devkit-internals");
const output_1 = require("../../utils/output");
const package_manager_1 = require("../../utils/package-manager");
const provenance_1 = require("../../utils/provenance");
const versions_1 = require("../../utils/versions");
const workspace_root_1 = require("../../utils/workspace-root");
const ora = require("ora");
async function configureAiAgentsHandler(args, inner = false) {
    // Use environment variable to force local execution
    if (process.env.NX_USE_LOCAL === 'true' ||
        process.env.NX_AI_FILES_USE_LOCAL === 'true' ||
        inner) {
        return await configureAiAgentsHandlerImpl(args);
    }
    // Skip downloading latest if the current version is already the latest
    try {
        const latestVersion = await (0, package_manager_1.resolvePackageVersionUsingRegistry)('nx', 'latest');
        if (latestVersion === versions_1.nxVersion) {
            return await configureAiAgentsHandlerImpl(args);
        }
    }
    catch {
        // If we can't check, proceed with download
    }
    let cleanup;
    try {
        await (0, provenance_1.ensurePackageHasProvenance)('nx', 'latest');
        const packageInstallResults = (0, devkit_internals_1.installPackageToTmp)('nx', 'latest');
        cleanup = packageInstallResults.cleanup;
        let modulePath = require.resolve('nx/src/command-line/configure-ai-agents/configure-ai-agents.js', { paths: [packageInstallResults.tempDir] });
        const module = await Promise.resolve(`${modulePath}`).then(s => require(s));
        const configureAiAgentsResult = await module.configureAiAgentsHandler(args, true);
        cleanup();
        return configureAiAgentsResult;
    }
    catch (error) {
        if (cleanup) {
            cleanup();
        }
        // Fall back to local implementation
        return configureAiAgentsHandlerImpl(args);
    }
}
async function configureAiAgentsHandlerImpl(options) {
    // Node 24 has stricter readline behavior, and enquirer is not checking for closed state
    // when invoking operations, thus you get an ERR_USE_AFTER_CLOSE error.
    process.on('uncaughtException', (error) => {
        if (error &&
            typeof error === 'object' &&
            'code' in error &&
            error['code'] === 'ERR_USE_AFTER_CLOSE')
            return;
        throw error;
    });
    const normalizedOptions = normalizeOptions(options);
    const { nonConfiguredAgents, partiallyConfiguredAgents, fullyConfiguredAgents, disabledAgents, } = await (0, utils_1.getAgentConfigurations)(normalizedOptions.agents, workspace_root_1.workspaceRoot);
    if (disabledAgents.length > 0) {
        const commandNames = disabledAgents.map((a) => {
            if (a.name === 'cursor')
                return '"cursor"';
            if (a.name === 'copilot')
                return '"code"/"code-insiders"';
            return a;
        });
        const title = commandNames.length === 1
            ? `${commandNames[0]} command not available.`
            : `CLI commands ${commandNames
                .map((c) => `${c}`)
                .join('/')} not available.`;
        output_1.output.log({
            title,
            bodyLines: [
                pc.dim('To manually configure the Nx MCP in your editor, install Nx Console (https://nx.dev/getting-started/editor-setup)'),
            ],
        });
    }
    if (normalizedOptions.agents.filter((agentName) => !disabledAgents.find((a) => a.name === agentName)).length === 0) {
        output_1.output.error({
            title: 'Please select at least one AI agent to configure.',
        });
        process.exit(1);
    }
    // important for wording
    const usingAllAgents = normalizedOptions.agents.length === utils_1.supportedAgents.length;
    if (normalizedOptions.check) {
        const outOfDateAgents = fullyConfiguredAgents.filter((a) => a?.outdated);
        // only error if something is fully configured but outdated
        if (normalizedOptions.check === 'outdated') {
            if (fullyConfiguredAgents.length === 0) {
                output_1.output.log({
                    title: 'No AI agents are configured',
                    bodyLines: [
                        'You can configure AI agents by running `nx configure-ai-agents`.',
                    ],
                });
                process.exit(0);
            }
            if (outOfDateAgents.length === 0) {
                output_1.output.success({
                    title: 'All configured AI agents are up to date',
                    bodyLines: fullyConfiguredAgents.map((a) => `- ${a.displayName}`),
                });
                process.exit(0);
            }
            else {
                output_1.output.log({
                    title: 'The following AI agents are out of date:',
                    bodyLines: [
                        ...outOfDateAgents.map((a) => {
                            const rulesPath = a.rulesPath;
                            const displayPath = rulesPath.startsWith(workspace_root_1.workspaceRoot)
                                ? (0, node_path_1.relative)(workspace_root_1.workspaceRoot, rulesPath)
                                : rulesPath;
                            return `- ${a.displayName} (${displayPath})`;
                        }),
                        '',
                        'You can update them by running `nx configure-ai-agents`.',
                    ],
                });
                process.exit(1);
            }
            // error on any partial, outdated or non-configured agent
        }
        else if (normalizedOptions.check === 'all') {
            if (partiallyConfiguredAgents.length === 0 &&
                outOfDateAgents.length === 0 &&
                nonConfiguredAgents.length === 0) {
                output_1.output.success({
                    title: `All ${!usingAllAgents ? 'selected' : 'supported'} AI agents are fully configured and up to date`,
                    bodyLines: fullyConfiguredAgents.map((a) => `- ${a.displayName}`),
                });
                process.exit(0);
            }
            output_1.output.error({
                title: 'The following agents are not fully configured or up to date:',
                bodyLines: [
                    ...partiallyConfiguredAgents,
                    ...outOfDateAgents,
                    ...nonConfiguredAgents,
                ].map((a) => getAgentChoiceForPrompt(a).message),
            });
            process.exit(1);
        }
    }
    const allAgentChoices = [];
    const preselectedIndices = [];
    let currentIndex = 0;
    // Partially configured agents first (highest priority)
    partiallyConfiguredAgents.forEach((a) => {
        allAgentChoices.push(getAgentChoiceForPrompt(a));
        preselectedIndices.push(currentIndex);
        currentIndex++;
    });
    // Outdated agents second
    for (const a of fullyConfiguredAgents) {
        if (a.outdated) {
            allAgentChoices.push(getAgentChoiceForPrompt(a));
            preselectedIndices.push(currentIndex);
            currentIndex++;
        }
    }
    // Non-configured agents last
    nonConfiguredAgents.forEach((a) => {
        allAgentChoices.push(getAgentChoiceForPrompt(a));
        currentIndex++;
    });
    if (allAgentChoices.length === 0) {
        output_1.output.success({
            title: `No new agents to configure. All ${!usingAllAgents ? 'selected' : 'supported'} AI agents are already configured:`,
            bodyLines: fullyConfiguredAgents.map((agent) => `- ${agent.displayName}`),
        });
        process.exit(0);
    }
    let selectedAgents;
    if (options.interactive !== false) {
        try {
            selectedAgents = (await (0, enquirer_1.prompt)({
                type: 'multiselect',
                name: 'agents',
                message: 'Which AI agents would you like to configure? (space to select, enter to confirm)',
                choices: allAgentChoices,
                initial: preselectedIndices,
                required: true,
                footer: function () {
                    const focused = this.focused;
                    return pc.dim(`  ${getAgentFooterDescription(focused.agentConfiguration)}`);
                },
            })).agents;
        }
        catch {
            process.exit(1);
        }
    }
    else {
        // in non-interactive mode, configure all
        selectedAgents = allAgentChoices.map((a) => a.name);
    }
    if (selectedAgents?.length === 0) {
        output_1.output.log({
            title: 'No agents selected',
        });
        process.exit(0);
    }
    const configSpinner = ora(`Configuring agent(s)...`).start();
    try {
        await (0, utils_1.configureAgents)(selectedAgents, workspace_root_1.workspaceRoot, false);
        // Combine all agent configurations for display
        const allAgentConfigs = [
            ...nonConfiguredAgents,
            ...partiallyConfiguredAgents,
            ...fullyConfiguredAgents,
        ];
        const configuredOrUpdatedAgents = allAgentConfigs.filter((a) => selectedAgents.includes(a.name) ||
            fullyConfiguredAgents.some((f) => f.name === a.name));
        configSpinner.stop();
        output_1.output.success({
            title: 'AI agents configured successfully',
            bodyLines: configuredOrUpdatedAgents.map((agent) => `${agent.displayName}: ${getAgentConfiguredDescription(agent)}`),
        });
        return;
    }
    catch (e) {
        configSpinner.fail('Failed to set up AI agents');
        output_1.output.error({
            title: 'Error details:',
            bodyLines: [e.message],
        });
        process.exit(1);
    }
}
/**
 * Get the verbose footer description for an agent.
 * Describes the end state per agent type.
 */
function getAgentFooterDescription(agent) {
    // Extract filename from rulesPath
    const rulesFile = agent.rulesPath.split('/').pop() || 'AGENTS.md';
    switch (agent.name) {
        case 'claude': {
            let description = `Installs Nx plugin (MCP + skills + agents). Updates ${rulesFile}.`;
            // Check if .mcp.json exists with nx-mcp - if so, mention cleanup
            const mcpJsonPath = (0, constants_1.claudeMcpJsonPath)(workspace_root_1.workspaceRoot);
            if ((0, node_fs_1.existsSync)(mcpJsonPath)) {
                try {
                    const mcpJsonContents = JSON.parse((0, node_fs_1.readFileSync)(mcpJsonPath, 'utf-8'));
                    if (mcpJsonContents?.mcpServers?.['nx-mcp']) {
                        description +=
                            ' Removes nx-mcp from .mcp.json (now handled by plugin).';
                    }
                }
                catch {
                    // Ignore errors reading .mcp.json
                }
            }
            return description;
        }
        case 'cursor':
        case 'copilot':
            return `Installs Nx Console (MCP). Adds skills and agents. Updates ${rulesFile}.`;
        case 'gemini':
        case 'opencode':
            return `Configures MCP server. Adds skills and agents. Updates ${rulesFile}.`;
        case 'codex':
            return `Configures MCP server. Updates ${rulesFile}.`;
        default:
            return '';
    }
}
/**
 * Get a compact description of what was configured for an agent.
 * Used in the post-configuration output.
 */
function getAgentConfiguredDescription(agent) {
    // Extract filename from rulesPath
    const rulesFile = agent.rulesPath.split('/').pop() || 'AGENTS.md';
    switch (agent.name) {
        case 'claude':
            return `Nx plugin (MCP + skills + agents) + ${rulesFile}`;
        case 'cursor':
        case 'copilot':
            return `Nx Console (MCP) + skills + ${rulesFile}`;
        case 'gemini':
        case 'opencode':
            return `MCP + skills + ${rulesFile}`;
        case 'codex':
            return `MCP + ${rulesFile}`;
        default:
            return '';
    }
}
function getAgentChoiceForPrompt(agent) {
    const partiallyConfigured = agent.mcp !== agent.rules;
    const needsUpdate = partiallyConfigured || agent.outdated;
    return {
        name: agent.name,
        message: needsUpdate
            ? `${agent.displayName} (update available)`
            : agent.displayName,
        agentConfiguration: agent,
    };
}
function normalizeOptions(options) {
    const agents = (options.agents ?? utils_1.supportedAgents).filter((a) => utils_1.supportedAgents.includes(a));
    // it used to be just --check which was implicitly 'outdated'
    const check = (options.check === true ? 'outdated' : options.check) ?? false;
    return {
        ...options,
        agents,
        check,
    };
}
