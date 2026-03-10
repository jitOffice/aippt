import { t as resolveViteConfigs } from "./shared-CjLi-sXO.mjs";
import { join } from "node:path";
import process from "node:process";
import { createServer } from "vite";

//#region node/commands/serve.ts
async function createServer$1(options, viteConfig = {}, serverOptions) {
	process.env.EDITOR = process.env.EDITOR || "code";
	return await createServer(await resolveViteConfigs(options, { optimizeDeps: { entries: [join(options.clientRoot, "main.ts")] } }, viteConfig, "serve", serverOptions));
}

//#endregion
export { createServer$1 as t };