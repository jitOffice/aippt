import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import process from "node:process";

//#region src/cache-fs.ts
function createFileSystemTypesCache(options = {}) {
	const dir = resolve(process.cwd(), options.dir ?? ".vitepress/cache/twoslash");
	return {
		init() {
			mkdirSync(dir, { recursive: true });
		},
		read(code) {
			const filePath = join(dir, `${createHash("SHA256").update(code).digest("hex").slice(0, 12)}.json`);
			if (!existsSync(filePath)) return null;
			return JSON.parse(readFileSync(filePath, { encoding: "utf-8" }));
		},
		write(code, data) {
			writeFileSync(join(dir, `${createHash("SHA256").update(code).digest("hex").slice(0, 12)}.json`), JSON.stringify(data), { encoding: "utf-8" });
		}
	};
}

//#endregion
export { createFileSystemTypesCache };