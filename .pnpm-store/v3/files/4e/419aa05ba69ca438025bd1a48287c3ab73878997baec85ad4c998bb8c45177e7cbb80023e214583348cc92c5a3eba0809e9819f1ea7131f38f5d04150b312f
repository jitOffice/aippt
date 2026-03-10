"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNxConsoleStatus = getNxConsoleStatus;
exports.handleNxConsolePreferenceAndInstall = handleNxConsolePreferenceAndInstall;
exports.cleanupLatestNxInstallation = cleanupLatestNxInstallation;
exports.getNxConsoleStatusImpl = getNxConsoleStatusImpl;
exports.handleNxConsolePreferenceAndInstallImpl = handleNxConsolePreferenceAndInstallImpl;
const devkit_internals_1 = require("../../devkit-internals");
const os_1 = require("os");
const native_1 = require("../../native");
const logger_1 = require("../logger");
// Module-level state - persists across invocations within daemon lifecycle
let latestNxTmpPath = null;
let cleanupFn = null;
const log = (...messageParts) => {
    logger_1.serverLogger.log('[NX-CONSOLE]:', ...messageParts);
};
/**
 * Gets the Nx Console status (whether we should prompt the user to install).
 * Uses latest Nx version if available, falls back to local implementation.
 *
 * @returns boolean indicating whether we should prompt the user
 */
async function getNxConsoleStatus({ inner, } = {}) {
    // Use local implementation if explicitly requested
    if (process.env.NX_USE_LOCAL === 'true' || inner === true) {
        log('Using local implementation (NX_USE_LOCAL=true or inner call)');
        return await getNxConsoleStatusImpl();
    }
    try {
        // If we don't have a tmp path yet, pull latest Nx
        if (latestNxTmpPath === null) {
            log('Pulling latest Nx (latest) to check console status...');
            const packageInstallResults = await (0, devkit_internals_1.installPackageToTmpAsync)('nx', 'latest');
            latestNxTmpPath = packageInstallResults.tempDir;
            cleanupFn = packageInstallResults.cleanup;
            log('Successfully pulled latest Nx to', latestNxTmpPath);
        }
        else {
            log('Reusing cached Nx installation from', latestNxTmpPath);
        }
        // Try to use the cached tmp path
        const modulePath = require.resolve('nx/src/daemon/server/nx-console-operations.js', { paths: [latestNxTmpPath] });
        const module = await Promise.resolve(`${modulePath}`).then(s => require(s));
        const result = await module.getNxConsoleStatus({ inner: true });
        log('Console status check completed, shouldPrompt:', result);
        return result;
    }
    catch (error) {
        // If tmp path failed (e.g., directory was deleted), fall back to local immediately
        log('Failed to use latest Nx, falling back to local implementation. Error:', error.message);
        return await getNxConsoleStatusImpl();
    }
}
/**
 * Handles user preference submission and installs Nx Console if requested.
 * Uses latest Nx version if available, falls back to local implementation.
 *
 * @param preference - whether the user wants to install Nx Console
 * @returns object indicating whether installation succeeded
 */
async function handleNxConsolePreferenceAndInstall({ preference, inner, }) {
    log('Handling user preference:', preference);
    // Use local implementation if explicitly requested
    if (process.env.NX_USE_LOCAL === 'true' || inner === true) {
        log('Using local implementation (NX_USE_LOCAL=true or inner call)');
        return await handleNxConsolePreferenceAndInstallImpl(preference);
    }
    try {
        // If we don't have a tmp path yet, pull latest Nx
        if (latestNxTmpPath === null) {
            log('Pulling latest Nx (latest) to handle preference and install...');
            const packageInstallResults = await (0, devkit_internals_1.installPackageToTmpAsync)('nx', 'latest');
            latestNxTmpPath = packageInstallResults.tempDir;
            cleanupFn = packageInstallResults.cleanup;
            log('Successfully pulled latest Nx to', latestNxTmpPath);
        }
        else {
            log('Reusing cached Nx installation from', latestNxTmpPath);
        }
        // Try to use the cached tmp path
        const modulePath = require.resolve('nx/src/daemon/server/nx-console-operations.js', { paths: [latestNxTmpPath] });
        const module = await Promise.resolve(`${modulePath}`).then(s => require(s));
        const result = await module.handleNxConsolePreferenceAndInstall({
            preference,
            inner: true,
        });
        log('Preference saved and installation', result.installed ? 'succeeded' : 'skipped/failed');
        return result;
    }
    catch (error) {
        // If tmp path failed (e.g., directory was deleted), fall back to local immediately
        log('Failed to use latest Nx, falling back to local implementation. Error:', error.message);
        return await handleNxConsolePreferenceAndInstallImpl(preference);
    }
}
/**
 * Clean up the latest Nx installation on daemon shutdown.
 */
function cleanupLatestNxInstallation() {
    if (cleanupFn) {
        log('Cleaning up latest Nx installation from', latestNxTmpPath);
        cleanupFn();
    }
    latestNxTmpPath = null;
    cleanupFn = null;
}
async function getNxConsoleStatusImpl() {
    // If no cached preference, read from disk
    const preferences = new native_1.NxConsolePreferences((0, os_1.homedir)());
    const preference = preferences.getAutoInstallPreference();
    const canInstallConsole = (0, native_1.canInstallNxConsole)();
    // If user previously opted in but extension is not installed,
    // they must have manually uninstalled it - respect that choice
    if (preference === true && canInstallConsole) {
        const preferences = new native_1.NxConsolePreferences((0, os_1.homedir)());
        preferences.setAutoInstallPreference(false);
        return false; // Don't prompt
    }
    // Noop if can't install
    if (!canInstallConsole) {
        return false;
    }
    // Prompt if we can install and user hasn't answered yet
    return typeof preference !== 'boolean';
}
async function handleNxConsolePreferenceAndInstallImpl(preference) {
    const preferences = new native_1.NxConsolePreferences((0, os_1.homedir)());
    preferences.setAutoInstallPreference(preference);
    let installed = false;
    if (preference) {
        installed = (0, native_1.installNxConsole)();
    }
    return { installed };
}
