"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAiAgentsGenerator = setupAiAgentsGenerator;
exports.setupAiAgentsGeneratorImpl = setupAiAgentsGeneratorImpl;
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const semver_1 = require("semver");
const format_changed_files_with_prettier_if_available_1 = require("../../generators/internal-utils/format-changed-files-with-prettier-if-available");
const generate_files_1 = require("../../generators/utils/generate-files");
const json_1 = require("../../generators/utils/json");
const native_1 = require("../../native");
const package_json_1 = require("../../utils/package-json");
const ignore_1 = require("../../utils/ignore");
const provenance_1 = require("../../utils/provenance");
const workspace_root_1 = require("../../utils/workspace-root");
const constants_1 = require("../constants");
const clone_ai_config_repo_1 = require("../clone-ai-config-repo");
const utils_1 = require("../utils");
const constants_2 = require("../constants");
/**
 * Get the installed Nx version, with fallback to workspace package.json or default version.
 */
function getNxVersion() {
    try {
        // Try to read from node_modules first
        const { packageJson: { version }, } = (0, package_json_1.readModulePackageJson)('nx');
        return version;
    }
    catch {
        try {
            // Fallback: try to read from workspace package.json
            const workspacePackageJson = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(workspace_root_1.workspaceRoot, 'package.json'), 'utf-8'));
            // Check devDependencies first, then dependencies
            const nxVersion = workspacePackageJson.devDependencies?.nx ||
                workspacePackageJson.dependencies?.nx;
            if (nxVersion) {
                // Remove any semver range characters (^, ~, >=, etc.)
                return nxVersion.replace(/^[\^~>=<]+/, '');
            }
            throw new Error('Nx not found in package.json');
        }
        catch {
            // If we can't determine the version, default to the newer format
            // This handles cases where nx might not be installed or is globally installed
            return '22.0.0';
        }
    }
}
async function setupAiAgentsGenerator(tree, options, inner = false) {
    const normalizedOptions = normalizeOptions(options);
    // Use environment variable to force local execution
    if (process.env.NX_AI_FILES_USE_LOCAL === 'true' || inner) {
        return await setupAiAgentsGeneratorImpl(tree, normalizedOptions);
    }
    try {
        await (0, provenance_1.ensurePackageHasProvenance)('nx', normalizedOptions.packageVersion);
        const { tempDir, cleanup } = (0, package_json_1.installPackageToTmp)('nx', normalizedOptions.packageVersion);
        let modulePath = (0, path_1.join)(tempDir, 'node_modules', 'nx', 'src/ai/set-up-ai-agents/set-up-ai-agents.js');
        const module = await Promise.resolve(`${modulePath}`).then(s => require(s));
        const setupAiAgentsGeneratorResult = await module.setupAiAgentsGenerator(tree, normalizedOptions, true);
        cleanup();
        return setupAiAgentsGeneratorResult;
    }
    catch (error) {
        return await setupAiAgentsGeneratorImpl(tree, normalizedOptions);
    }
}
function normalizeOptions(options) {
    return {
        directory: options.directory,
        writeNxCloudRules: options.writeNxCloudRules ?? false,
        packageVersion: options.packageVersion ?? 'latest',
        agents: options.agents ?? [...utils_1.supportedAgents],
    };
}
async function setupAiAgentsGeneratorImpl(tree, options) {
    const hasAgent = (agent) => options.agents.includes(agent);
    const nxVersion = getNxVersion();
    const agentsMd = (0, constants_1.agentsMdPath)(options.directory);
    // write AGENTS.md for most agents
    if (hasAgent('cursor') ||
        hasAgent('copilot') ||
        hasAgent('codex') ||
        hasAgent('opencode')) {
        writeAgentRules(tree, agentsMd, options.writeNxCloudRules);
    }
    if (hasAgent('claude')) {
        const claudePath = (0, path_1.join)(options.directory, 'CLAUDE.md');
        writeAgentRules(tree, claudePath, options.writeNxCloudRules);
        // Configure Claude plugin via marketplace (plugin includes MCP server)
        const claudeSettingsPath = (0, path_1.join)(options.directory, '.claude', 'settings.json');
        if (!tree.exists(claudeSettingsPath)) {
            (0, json_1.writeJson)(tree, claudeSettingsPath, {});
        }
        (0, json_1.updateJson)(tree, claudeSettingsPath, (json) => ({
            ...json,
            extraKnownMarketplaces: {
                ...json.extraKnownMarketplaces,
                'nx-claude-plugins': {
                    source: {
                        ...json.extraKnownMarketplaces?.['nx-claude-plugins']?.source,
                        source: 'github',
                        repo: 'nrwl/nx-ai-agents-config',
                    },
                },
            },
            enabledPlugins: {
                ...json.enabledPlugins,
                'nx@nx-claude-plugins': true,
            },
        }));
        // Clean up .mcp.json (nx-mcp now handled by plugin)
        const mcpJsonPath = (0, constants_1.claudeMcpJsonPath)(options.directory);
        if (tree.exists(mcpJsonPath)) {
            try {
                const mcpJsonContents = (0, json_1.readJson)(tree, mcpJsonPath);
                if (mcpJsonContents?.mcpServers?.['nx-mcp']) {
                    const serverKeys = Object.keys(mcpJsonContents.mcpServers || {});
                    if (serverKeys.length === 1 && serverKeys[0] === 'nx-mcp') {
                        // nx-mcp is the only server, delete the file
                        tree.delete(mcpJsonPath);
                    }
                    else {
                        // Other servers exist, just remove nx-mcp entry
                        delete mcpJsonContents.mcpServers['nx-mcp'];
                        (0, json_1.writeJson)(tree, mcpJsonPath, mcpJsonContents);
                    }
                }
            }
            catch {
                // Ignore errors reading .mcp.json
            }
        }
    }
    if (hasAgent('opencode')) {
        const opencodeMcpJsonPath = (0, constants_1.opencodeMcpPath)(options.directory);
        if (!tree.exists(opencodeMcpJsonPath)) {
            (0, json_1.writeJson)(tree, opencodeMcpJsonPath, {});
        }
        (0, json_1.updateJson)(tree, opencodeMcpJsonPath, (json) => opencodeMcpConfigUpdater(json, nxVersion));
    }
    if (hasAgent('gemini')) {
        const geminiSettingsPath = (0, path_1.join)(options.directory, '.gemini', 'settings.json');
        if (!tree.exists(geminiSettingsPath)) {
            (0, json_1.writeJson)(tree, geminiSettingsPath, {});
        }
        (0, json_1.updateJson)(tree, geminiSettingsPath, (json) => mcpConfigUpdater(json, nxVersion));
        const contextFileName = (0, json_1.readJson)(tree, geminiSettingsPath).contextFileName;
        const geminiMd = (0, constants_1.geminiMdPath)(options.directory);
        // Only set contextFileName to AGENTS.md if GEMINI.md doesn't exist already to preserve existing setups
        if (!contextFileName && !tree.exists(geminiMd)) {
            writeAgentRules(tree, agentsMd, options.writeNxCloudRules);
            (0, json_1.updateJson)(tree, geminiSettingsPath, (json) => ({
                ...json,
                contextFileName: 'AGENTS.md',
            }));
        }
        else {
            writeAgentRules(tree, contextFileName ?? geminiMd, options.writeNxCloudRules);
        }
    }
    // Copy extensibility artifacts (commands, skills, subagents) for non-Claude agents
    if (hasAgent('opencode') ||
        hasAgent('copilot') ||
        hasAgent('cursor') ||
        hasAgent('codex') ||
        hasAgent('gemini')) {
        const repoPath = (0, clone_ai_config_repo_1.getAiConfigRepoPath)();
        const agentDirs = [
            { agent: 'opencode', src: 'generated/.opencode', dest: '.opencode' },
            { agent: 'copilot', src: 'generated/.github', dest: '.github' },
            { agent: 'cursor', src: 'generated/.cursor', dest: '.cursor' },
            { agent: 'codex', src: 'generated/.codex', dest: '.codex' },
            { agent: 'gemini', src: 'generated/.gemini', dest: '.gemini' },
        ];
        for (const { agent, src, dest } of agentDirs) {
            if (hasAgent(agent)) {
                const srcPath = (0, path_1.join)(repoPath, src);
                if ((0, fs_1.existsSync)(srcPath)) {
                    (0, generate_files_1.generateFiles)(tree, srcPath, (0, path_1.join)(options.directory, dest), {});
                }
            }
        }
    }
    (0, ignore_1.addEntryToGitIgnore)(tree, (0, path_1.join)(options.directory, '.gitignore'), '.nx/polygraph');
    await (0, format_changed_files_with_prettier_if_available_1.formatChangedFilesWithPrettierIfAvailable)(tree);
    // we use the check variable to determine if we should actually make changes or just report what would be changed
    return async (check = false) => {
        const messages = [];
        const errors = [];
        if (hasAgent('codex')) {
            if ((0, fs_1.existsSync)(constants_1.codexConfigTomlPath)) {
                const tomlContents = (0, fs_1.readFileSync)(constants_1.codexConfigTomlPath, 'utf-8');
                if (!tomlContents.includes(constants_2.nxMcpTomlHeader)) {
                    if (!check) {
                        (0, fs_1.appendFileSync)(constants_1.codexConfigTomlPath, `\n${(0, constants_2.getNxMcpTomlConfig)(nxVersion)}`);
                    }
                    messages.push({
                        title: `Updated ${constants_1.codexConfigTomlPath} with nx-mcp server`,
                    });
                }
            }
            else {
                if (!check) {
                    (0, fs_1.mkdirSync)((0, path_1.join)((0, os_1.homedir)(), '.codex'), { recursive: true });
                    (0, fs_1.writeFileSync)(constants_1.codexConfigTomlPath, (0, constants_2.getNxMcpTomlConfig)(nxVersion));
                }
                messages.push({
                    title: `Created ${constants_1.codexConfigTomlPath} with nx-mcp server`,
                });
            }
        }
        if (hasAgent('copilot')) {
            try {
                if ((0, native_1.isEditorInstalled)(0 /* SupportedEditor.VSCode */) &&
                    (0, native_1.canInstallNxConsoleForEditor)(0 /* SupportedEditor.VSCode */)) {
                    if (!check) {
                        (0, native_1.installNxConsoleForEditor)(0 /* SupportedEditor.VSCode */);
                    }
                    messages.push({
                        title: `Installed Nx Console for VSCode`,
                    });
                }
            }
            catch (e) {
                errors.push({
                    title: `Failed to install Nx Console for VSCode. Please install it manually.`,
                    bodyLines: [e.message],
                });
            }
            try {
                if ((0, native_1.isEditorInstalled)(1 /* SupportedEditor.VSCodeInsiders */) &&
                    (0, native_1.canInstallNxConsoleForEditor)(1 /* SupportedEditor.VSCodeInsiders */)) {
                    if (!check) {
                        (0, native_1.installNxConsoleForEditor)(1 /* SupportedEditor.VSCodeInsiders */);
                    }
                    messages.push({
                        title: `Installed Nx Console for VSCode Insiders`,
                    });
                }
            }
            catch (e) {
                errors.push({
                    title: `Failed to install Nx Console for VSCode Insiders. Please install it manually.`,
                    bodyLines: [e.message],
                });
            }
        }
        if (hasAgent('cursor')) {
            try {
                if ((0, native_1.isEditorInstalled)(2 /* SupportedEditor.Cursor */) &&
                    (0, native_1.canInstallNxConsoleForEditor)(2 /* SupportedEditor.Cursor */)) {
                    if (!check) {
                        (0, native_1.installNxConsoleForEditor)(2 /* SupportedEditor.Cursor */);
                    }
                    messages.push({
                        title: `Installed Nx Console for Cursor`,
                    });
                }
            }
            catch (e) {
                errors.push({
                    title: `Failed to install Nx Console for Cursor. Please install it manually.`,
                    bodyLines: [e.message],
                });
            }
        }
        return {
            messages,
            errors,
        };
    };
}
function writeAgentRules(tree, path, writeNxCloudRules) {
    if (!tree.exists(path)) {
        // File doesn't exist - create with h1 header (standalone content)
        const expectedRules = (0, constants_2.getAgentRulesWrapped)({
            writeNxCloudRules,
            useH1: true,
        });
        tree.write(path, expectedRules);
        return;
    }
    const existing = tree.read(path, 'utf-8');
    const regex = constants_2.rulesRegex;
    const existingNxConfiguration = existing.match(regex);
    if (existingNxConfiguration) {
        // Check the rest of the file (outside nx block) for an h1 header
        // to ensure only one h1 exists in the document
        const contentWithoutNxBlock = existing.replace(regex, '');
        const hasExternalH1 = /^# /m.test(contentWithoutNxBlock);
        const expectedRules = (0, constants_2.getAgentRulesWrapped)({
            writeNxCloudRules,
            useH1: !hasExternalH1,
        });
        const contentOnly = (str) => str
            .replace(constants_2.nxRulesMarkerCommentStart, '')
            .replace(constants_2.nxRulesMarkerCommentEnd, '')
            .replace(constants_2.nxRulesMarkerCommentDescription, '')
            .replace(/\s/g, '');
        // we don't want to make updates on whitespace-only changes
        if (contentOnly(existingNxConfiguration[0]) === contentOnly(expectedRules)) {
            return;
        }
        // otherwise replace the existing configuration
        const updatedContent = existing.replace(regex, expectedRules);
        tree.write(path, updatedContent);
    }
    else {
        // Appending to existing content - use h2 only if the file already has an h1 header
        // This prevents unnecessary changes when users add content without their own h1
        const hasExistingH1 = /^# /m.test(existing);
        const expectedRules = (0, constants_2.getAgentRulesWrapped)({
            writeNxCloudRules,
            useH1: !hasExistingH1,
        });
        tree.write(path, existing + '\n\n' + expectedRules);
    }
}
/**
 * Extract user-added extra args/flags from an existing MCP config args array
 * by stripping the known base command prefix.
 *
 * Known base patterns (matched in order, first wins):
 *   ['nx', 'mcp']  or  ['nx-mcp'] (possibly with @version suffix like nx-mcp@latest)
 *   For opencode the caller prepends 'npx' to these patterns.
 */
function getExtraMcpArgs(existingArgs, knownBasePatterns) {
    if (!Array.isArray(existingArgs) || existingArgs.length === 0)
        return [];
    for (const pattern of knownBasePatterns) {
        if (existingArgs.length < pattern.length)
            continue;
        const matches = pattern.every((baseArg, i) => {
            if (baseArg === 'nx-mcp') {
                // Also match versioned variants like nx-mcp@latest
                return (existingArgs[i] === 'nx-mcp' || existingArgs[i].startsWith('nx-mcp@'));
            }
            return existingArgs[i] === baseArg;
        });
        if (matches) {
            return existingArgs.slice(pattern.length);
        }
    }
    return [];
}
function mcpConfigUpdater(existing, nxVersion) {
    const majorVersion = (0, semver_1.major)(nxVersion);
    const mcpArgs = majorVersion >= 22 ? ['nx', 'mcp'] : ['nx-mcp'];
    // Preserve any extra args (e.g. --experimental-polygraph, --transport http) from existing config
    const extraArgs = getExtraMcpArgs(existing.mcpServers?.['nx-mcp']?.args, [
        ['nx', 'mcp'],
        ['nx-mcp'],
    ]);
    mcpArgs.push(...extraArgs);
    if (existing.mcpServers) {
        existing.mcpServers['nx-mcp'] = {
            type: 'stdio',
            command: 'npx',
            args: mcpArgs,
        };
    }
    else {
        existing.mcpServers = {
            'nx-mcp': {
                type: 'stdio',
                command: 'npx',
                args: mcpArgs,
            },
        };
    }
    return existing;
}
function opencodeMcpConfigUpdater(existing, nxVersion) {
    const majorVersion = (0, semver_1.major)(nxVersion);
    const mcpCommand = majorVersion >= 22 ? ['npx', 'nx', 'mcp'] : ['npx', 'nx-mcp'];
    // Preserve any extra args (e.g. --experimental-polygraph, --transport http) from existing config
    const extraArgs = getExtraMcpArgs(existing.mcp?.['nx-mcp']?.command, [
        ['npx', 'nx', 'mcp'],
        ['npx', 'nx-mcp'],
    ]);
    mcpCommand.push(...extraArgs);
    if (existing.mcp) {
        existing.mcp['nx-mcp'] = {
            type: 'local',
            command: mcpCommand,
            enabled: true,
        };
    }
    else {
        existing.mcp = {
            'nx-mcp': {
                type: 'local',
                command: mcpCommand,
                enabled: true,
            },
        };
    }
    return existing;
}
exports.default = setupAiAgentsGenerator;
