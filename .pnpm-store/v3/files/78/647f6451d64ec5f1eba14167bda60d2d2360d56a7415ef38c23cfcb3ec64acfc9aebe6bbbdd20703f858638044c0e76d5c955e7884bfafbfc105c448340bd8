import "./resolver-B4CxEjJF.mjs";
import { t as resolveViteConfigs } from "./shared-CjLi-sXO.mjs";
import { join, resolve } from "node:path";
import { build as build$1 } from "vite";
import { existsSync } from "node:fs";
import fs$1 from "node:fs/promises";
import http from "node:http";
import connect from "connect";
import sirv from "sirv";

//#region node/commands/build.ts
async function build(options, viteConfig = {}, args) {
	const indexPath = resolve(options.userRoot, "index.html");
	let originalIndexHTML;
	if (existsSync(indexPath)) originalIndexHTML = await fs$1.readFile(indexPath, "utf-8");
	await fs$1.writeFile(indexPath, options.utils.indexHtml, "utf-8");
	let config = void 0;
	try {
		await build$1(await resolveViteConfigs(options, {
			plugins: [{
				name: "resolve-config",
				configResolved(_config) {
					config = _config;
				}
			}],
			build: { chunkSizeWarningLimit: 2e3 }
		}, viteConfig, "build"));
	} finally {
		if (originalIndexHTML != null) await fs$1.writeFile(indexPath, originalIndexHTML, "utf-8");
		else await fs$1.unlink(indexPath);
	}
	const outDir = resolve(options.userRoot, config.build.outDir);
	if (options.data.config.seoMeta?.ogImage === "auto" || options.data.config.seoMeta?.ogImage?.startsWith(".")) {
		const filename = options.data.config.seoMeta?.ogImage === "auto" ? "og-image.png" : options.data.config.seoMeta.ogImage;
		const projectOgImagePath = resolve(options.userRoot, filename);
		const outputOgImagePath = resolve(outDir, filename);
		if (await fs$1.access(projectOgImagePath).then(() => true).catch(() => false)) await fs$1.copyFile(projectOgImagePath, outputOgImagePath);
		else if (options.data.config.seoMeta?.ogImage === "auto") {
			const port = 12445;
			const app = connect();
			const server = http.createServer(app);
			app.use(config.base, sirv(outDir, {
				etag: true,
				single: true,
				dev: true
			}));
			server.listen(port);
			const { exportSlides } = await import("./export-C4evmDwN.mjs");
			const tempDir = resolve(outDir, "temp");
			await fs$1.mkdir(tempDir, { recursive: true });
			await exportSlides({
				port,
				base: config.base,
				slides: options.data.slides,
				total: options.data.slides.length,
				format: "png",
				output: tempDir,
				range: "1",
				width: options.data.config.canvasWidth,
				height: Math.round(options.data.config.canvasWidth / options.data.config.aspectRatio),
				routerMode: options.data.config.routerMode,
				waitUntil: "networkidle",
				timeout: args.timeout || 3e4,
				perSlide: true,
				omitBackground: false,
				dark: args.dark
			});
			const pngFile = (await fs$1.readdir(tempDir)).find((file) => file.endsWith(".png"));
			if (pngFile) {
				const generatedPath = resolve(tempDir, pngFile);
				await fs$1.copyFile(generatedPath, projectOgImagePath);
				await fs$1.copyFile(generatedPath, outputOgImagePath);
			}
			await fs$1.rm(tempDir, {
				recursive: true,
				force: true
			});
			server.close();
		} else throw new Error(`[Slidev] ogImage: ${filename} not found`);
	}
	await fs$1.copyFile(resolve(outDir, "index.html"), resolve(outDir, "404.html"));
	const redirectsPath = resolve(outDir, "_redirects");
	if (!existsSync(redirectsPath)) await fs$1.writeFile(redirectsPath, `${config.base}*    ${config.base}index.html   200\n`, "utf-8");
	if ([
		true,
		"true",
		"auto"
	].includes(options.data.config.download)) {
		const { exportSlides, getExportOptions } = await import("./export-C4evmDwN.mjs");
		const port = 12445;
		const app = connect();
		const server = http.createServer(app);
		app.use(config.base, sirv(outDir, {
			etag: true,
			single: true,
			dev: true
		}));
		server.listen(port);
		const filename = options.data.config.exportFilename || "slidev-exported";
		await exportSlides({
			port,
			base: config.base,
			...getExportOptions(args, options, join(outDir, `${filename}.pdf`))
		});
		server.close();
	}
}

//#endregion
export { build };