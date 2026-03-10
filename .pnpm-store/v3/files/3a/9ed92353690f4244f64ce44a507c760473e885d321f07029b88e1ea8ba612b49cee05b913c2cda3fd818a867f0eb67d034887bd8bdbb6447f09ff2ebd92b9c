import { dirname, join, relative, resolve } from "node:path";
import process from "node:process";
import { existsSync } from "node:fs";
import { copyFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { parseNi, run } from "@antfu/ni";
import { ensurePrefix, slash } from "@antfu/utils";
import { underline, yellow } from "ansis";
import globalDirs from "global-directory";
import { resolvePath } from "mlly";
import prompts from "prompts";
import { resolveGlobal } from "resolve-global";
import { findClosestPkgJsonPath, findDepPkgJsonPath } from "vitefu";

//#region node/resolver.ts
const cliRoot = fileURLToPath(new URL("..", import.meta.url));
const isInstalledGlobally = {};
/**
* Resolve path for import url on Vite client side
*/
async function resolveImportUrl(id) {
	return toAtFS(await resolveImportPath(id, true));
}
function toAtFS(path$1) {
	return `/@fs${ensurePrefix("/", slash(path$1))}`;
}
async function resolveImportPath(importName, ensure = false) {
	try {
		return await resolvePath(importName, { url: import.meta.url });
	} catch {}
	if (isInstalledGlobally.value) try {
		return resolveGlobal(importName);
	} catch {}
	if (ensure) throw new Error(`Failed to resolve package "${importName}"`);
}
async function findPkgRoot(dep, parent, ensure = false) {
	const pkgJsonPath = await findDepPkgJsonPath(dep, parent);
	const path$1 = pkgJsonPath ? dirname(pkgJsonPath) : isInstalledGlobally.value ? await findGlobalPkgRoot(dep, false) : void 0;
	if (ensure && !path$1) throw new Error(`Failed to resolve package "${dep}"`);
	return path$1;
}
async function findGlobalPkgRoot(name, ensure = false) {
	const localPath = await findDepPkgJsonPath(name, cliRoot);
	if (localPath) return dirname(localPath);
	const yarnPath = join(globalDirs.yarn.packages, name);
	if (existsSync(`${yarnPath}/package.json`)) return yarnPath;
	const npmPath = join(globalDirs.npm.packages, name);
	if (existsSync(`${npmPath}/package.json`)) return npmPath;
	if (ensure) throw new Error(`Failed to resolve global package "${name}"`);
}
async function resolveEntry(entryRaw) {
	if (!existsSync(entryRaw) && !entryRaw.endsWith(".md") && !/[/\\]/.test(entryRaw)) entryRaw += ".md";
	const entry = resolve(entryRaw);
	if (!existsSync(entry)) {
		if (!process.stdin.isTTY) {
			console.error(`Entry file "${entry}" does not exist and cannot prompt for confirmation`);
			process.exit(1);
		}
		const { create } = await prompts({
			name: "create",
			type: "confirm",
			initial: "Y",
			message: `Entry file ${yellow(`"${entry}"`)} does not exist, do you want to create it?`
		});
		if (create) await copyFile(resolve(cliRoot, "template.md"), entry);
		else process.exit(0);
	}
	return slash(entry);
}
/**
* Create a resolver for theme or addon
*/
function createResolver(type, officials) {
	async function promptForInstallation(pkgName) {
		if (!process.stdin.isTTY) {
			console.error(`The ${type} "${pkgName}" was not found and cannot prompt for installation`);
			process.exit(1);
		}
		const { confirm } = await prompts({
			name: "confirm",
			initial: "Y",
			type: "confirm",
			message: `The ${type} "${pkgName}" was not found ${underline(isInstalledGlobally.value ? "globally" : "in your project")}, do you want to install it now?`
		});
		if (!confirm) process.exit(1);
		if (isInstalledGlobally.value) await run(parseNi, ["-g", pkgName]);
		else await run(parseNi, [pkgName]);
	}
	return async function(name, importer) {
		const { userRoot } = await getRoots();
		if (name === "none") return ["", null];
		if (name[0] === "/") return [name, name];
		if (name.startsWith("@/")) return [name, resolve(userRoot, name.slice(2))];
		if (name[0] === "." || name[0] !== "@" && name.includes("/")) return [name, resolve(dirname(importer), name)];
		{
			const possiblePkgNames = [name];
			if (!name.includes("/") && !name.startsWith("@")) possiblePkgNames.unshift(`@slidev/${type}-${name}`, `slidev-${type}-${name}`);
			for (const pkgName$1 of possiblePkgNames) {
				const pkgRoot = await findPkgRoot(pkgName$1, importer);
				if (pkgRoot) return [pkgName$1, pkgRoot];
			}
		}
		const pkgName = officials[name] ?? (name[0] === "@" ? name : `slidev-${type}-${name}`);
		await promptForInstallation(pkgName);
		return [pkgName, await findPkgRoot(pkgName, importer, true)];
	};
}
async function getUserPkgJson(userRoot) {
	const path$1 = resolve(userRoot, "package.json");
	if (existsSync(path$1)) return JSON.parse(await readFile(path$1, "utf-8"));
	return {};
}
async function hasWorkspacePackageJSON(root) {
	const path$1 = join(root, "package.json");
	if (!existsSync(path$1)) return false;
	return !!(JSON.parse(await readFile(path$1, "utf-8")) || {}).workspaces;
}
function hasRootFile(root) {
	return ["pnpm-workspace.yaml"].some((file) => existsSync(join(root, file)));
}
/**
* Search up for the nearest workspace root
*/
async function searchForWorkspaceRoot(current, root = current) {
	if (hasRootFile(current)) return current;
	if (await hasWorkspacePackageJSON(current)) return current;
	const dir = dirname(current);
	if (!dir || dir === current) return root;
	return searchForWorkspaceRoot(dir, root);
}
let rootsInfo = null;
async function getRoots(entry) {
	if (rootsInfo) return rootsInfo;
	if (!entry) throw new Error("[slidev] Cannot find roots without entry");
	const userRoot = dirname(entry);
	isInstalledGlobally.value = slash(relative(userRoot, process.argv[1])).includes("/.pnpm/") || (await import("is-installed-globally")).default;
	const clientRoot = await findPkgRoot("@slidev/client", cliRoot, true);
	const closestPkgRoot = dirname(await findClosestPkgJsonPath(userRoot) || userRoot);
	rootsInfo = {
		cliRoot,
		clientRoot,
		userRoot,
		userPkgJson: await getUserPkgJson(closestPkgRoot),
		userWorkspaceRoot: await searchForWorkspaceRoot(closestPkgRoot)
	};
	return rootsInfo;
}
function resolveSourceFiles(roots, subpath, extensions = [
	".mjs",
	".js",
	".mts",
	".ts"
]) {
	const results = [];
	for (const root of roots) for (const ext of extensions) {
		const fullPath = join(root, subpath + ext);
		if (existsSync(fullPath)) {
			results.push(fullPath);
			break;
		}
	}
	return results;
}

//#endregion
export { resolveImportPath as a, toAtFS as c, resolveEntry as i, getRoots as n, resolveImportUrl as o, isInstalledGlobally as r, resolveSourceFiles as s, createResolver as t };