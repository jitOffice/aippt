import { n as getRoots } from "./resolver-B4CxEjJF.mjs";
import path, { dirname, relative } from "node:path";
import process from "node:process";
import fs from "node:fs/promises";
import { clearUndefined, ensureSuffix, slash } from "@antfu/utils";
import { blue, cyan, dim, green, yellow } from "ansis";
import { resolve as resolve$1 } from "mlly";
import { Buffer } from "node:buffer";
import { outlinePdfFactory } from "@lillallol/outline-pdf";
import { parseRangeString } from "@slidev/parser/core";
import { Presets, SingleBar } from "cli-progress";
import * as pdfLib from "pdf-lib";
import { PDFDocument } from "pdf-lib";

//#region node/commands/export.ts
function addToTree(tree, info, slideIndexes, level = 1) {
	const titleLevel = info.level;
	if (titleLevel && titleLevel > level && tree.length > 0 && tree[tree.length - 1].titleLevel < titleLevel) addToTree(tree[tree.length - 1].children, info, slideIndexes, level + 1);
	else tree.push({
		no: info.index,
		children: [],
		level,
		titleLevel: titleLevel ?? level,
		path: String(slideIndexes[info.index + 1]),
		hideInToc: Boolean(info.frontmatter?.hideInToc),
		title: info.title
	});
}
function makeOutline(tree) {
	return tree.map(({ title, path: path$1, level, children }) => {
		const rootOutline = title ? `${path$1}|${"-".repeat(level - 1)}|${title}` : null;
		const childrenOutline = makeOutline(children);
		return childrenOutline.length > 0 ? `${rootOutline}\n${childrenOutline}` : rootOutline;
	}).filter((outline) => !!outline).join("\n");
}
function createSlidevProgress(indeterminate = false) {
	function getSpinner(n = 0) {
		return [
			cyan("●"),
			green("◆"),
			blue("■"),
			yellow("▲")
		][n % 4];
	}
	let current = 0;
	let spinner = 0;
	let timer;
	const progress = new SingleBar({
		clearOnComplete: true,
		hideCursor: true,
		format: `  {spin} ${yellow("rendering")}${indeterminate ? dim(yellow("...")) : " {bar} {value}/{total}"}`,
		linewrap: false,
		barsize: 30
	}, Presets.shades_grey);
	return {
		bar: progress,
		start(total) {
			progress.start(total, 0, { spin: getSpinner(spinner) });
			timer = setInterval(() => {
				spinner += 1;
				progress.update(current, { spin: getSpinner(spinner) });
			}, 200);
		},
		update(v) {
			current = v;
			progress.update(v, { spin: getSpinner(spinner) });
		},
		stop() {
			clearInterval(timer);
			progress.stop();
		}
	};
}
async function exportNotes({ port = 18724, base = "/", output = "notes", timeout = 3e4, wait = 0 }) {
	const { chromium } = await importPlaywright();
	const browser = await chromium.launch();
	const page = await (await browser.newContext()).newPage();
	const progress = createSlidevProgress(true);
	progress.start(1);
	if (!output.endsWith(".pdf")) output = `${output}.pdf`;
	await page.goto(`http://localhost:${port}${base}presenter/print`, {
		waitUntil: "networkidle",
		timeout
	});
	await page.waitForLoadState("networkidle");
	await page.emulateMedia({ media: "screen" });
	if (wait) await page.waitForTimeout(wait);
	await page.pdf({
		path: output,
		margin: {
			left: 0,
			top: 0,
			right: 0,
			bottom: 0
		},
		printBackground: true,
		preferCSSPageSize: true
	});
	progress.stop();
	browser.close();
	return output;
}
async function exportSlides({ port = 18724, total = 0, range: range$1, format = "pdf", output = "slides", slides, base = "/", timeout = 3e4, wait = 0, dark = false, routerMode = "history", width = 1920, height = 1080, withClicks = false, executablePath = void 0, withToc = false, perSlide = false, scale = 1, waitUntil, omitBackground = false }) {
	const pages = parseRangeString(total, range$1);
	const { chromium } = await importPlaywright();
	const browser = await chromium.launch({ executablePath });
	const page = await (await browser.newContext({
		viewport: {
			width,
			height: perSlide ? height : height * pages.length
		},
		deviceScaleFactor: scale
	})).newPage();
	const progress = createSlidevProgress(!perSlide);
	progress.start(pages.length);
	if (format === "pdf") await genPagePdf();
	else if (format === "png") await genPagePng(output);
	else if (format === "md") await genPageMd();
	else if (format === "pptx") await genPagePptx(await genPagePng(false));
	else throw new Error(`[slidev] Unsupported exporting format "${format}"`);
	progress.stop();
	browser.close();
	const relativeOutput = slash(relative(".", output));
	return relativeOutput.startsWith(".") ? relativeOutput : `./${relativeOutput}`;
	async function go(no, clicks) {
		const query = new URLSearchParams();
		if (withClicks) query.set("print", "clicks");
		else query.set("print", "true");
		if (range$1) query.set("range", range$1);
		if (clicks) query.set("clicks", clicks);
		const url = routerMode === "hash" ? `http://localhost:${port}${base}?${query}#${no}` : `http://localhost:${port}${base}${no}?${query}`;
		await page.goto(url, {
			waitUntil,
			timeout
		});
		if (waitUntil) await page.waitForLoadState(waitUntil);
		await page.emulateMedia({
			colorScheme: dark ? "dark" : "light",
			media: "screen"
		});
		const slide = no === "print" ? page.locator("body") : page.locator(`[data-slidev-no="${no}"]`);
		await slide.waitFor();
		{
			const elements = slide.locator(".slidev-slide-loading");
			const count = await elements.count();
			for (let index = 0; index < count; index++) await elements.nth(index).waitFor({ state: "detached" });
		}
		{
			const elements = slide.locator("[data-waitfor]");
			const count = await elements.count();
			for (let index = 0; index < count; index++) {
				const element = elements.nth(index);
				const attribute = await element.getAttribute("data-waitfor");
				if (attribute) await element.locator(attribute).waitFor({ state: "visible" }).catch((e) => {
					console.error(e);
					process.exitCode = 1;
				});
			}
		}
		{
			const frames = page.frames();
			await Promise.all(frames.map((frame) => frame.waitForLoadState()));
		}
		{
			const container = slide.locator("#mermaid-rendering-container");
			if (await container.count() > 0) {
				while (true) {
					const element = container.locator("div").first();
					if (await element.count() === 0) break;
					await element.waitFor({ state: "detached" });
				}
				await container.evaluate((node) => node.style.display = "none");
			}
		}
		{
			const elements = slide.locator(".monaco-aria-container");
			const count = await elements.count();
			for (let index = 0; index < count; index++) await elements.nth(index).evaluate((node) => node.style.display = "none");
		}
		if (wait) await page.waitForTimeout(wait);
	}
	async function getSlidesIndex() {
		const clicksBySlide = {};
		const slides$1 = page.locator(".print-slide-container");
		const count = await slides$1.count();
		for (let i = 0; i < count; i++) {
			const id = await slides$1.nth(i).getAttribute("id") || "";
			const path$1 = Number(id.split("-")[0]);
			clicksBySlide[path$1] = (clicksBySlide[path$1] || 0) + 1;
		}
		return Object.fromEntries(Object.entries(clicksBySlide).reduce((acc, [path$1, clicks], i) => {
			acc.push([path$1, clicks + (acc[i - 1]?.[1] ?? 0)]);
			return acc;
		}, []));
	}
	function getClicksFromUrl(url) {
		return url.match(/clicks=([1-9]\d*)/)?.[1];
	}
	async function genPageWithClicks(fn, no, clicks) {
		await fn(no, clicks);
		if (withClicks) {
			await page.keyboard.press("ArrowRight", { delay: 100 });
			const _clicks = getClicksFromUrl(page.url());
			if (_clicks && clicks !== _clicks) await genPageWithClicks(fn, no, _clicks);
		}
	}
	async function genPagePdfPerSlide() {
		const buffers = [];
		const genPdfBuffer = async (i, clicks) => {
			await go(i, clicks);
			const pdf = await page.pdf({
				width,
				height,
				margin: {
					left: 0,
					top: 0,
					right: 0,
					bottom: 0
				},
				pageRanges: "1",
				printBackground: true,
				preferCSSPageSize: true
			});
			buffers.push(pdf);
		};
		let idx = 0;
		for (const i of pages) {
			await genPageWithClicks(genPdfBuffer, i);
			progress.update(++idx);
		}
		let mergedPdf = await PDFDocument.create({});
		for (const pdfBytes of buffers) {
			const pdf = await PDFDocument.load(pdfBytes);
			(await mergedPdf.copyPages(pdf, pdf.getPageIndices())).forEach((page$1) => {
				mergedPdf.addPage(page$1);
			});
		}
		addPdfMetadata(mergedPdf);
		if (withToc) mergedPdf = await addTocToPdf(mergedPdf);
		const buffer = await mergedPdf.save();
		await fs.writeFile(output, buffer);
	}
	async function genPagePdfOnePiece() {
		await go("print");
		await page.pdf({
			path: output,
			width,
			height,
			margin: {
				left: 0,
				top: 0,
				right: 0,
				bottom: 0
			},
			printBackground: true,
			preferCSSPageSize: true
		});
		let pdfData = await fs.readFile(output);
		let pdf = await PDFDocument.load(pdfData);
		addPdfMetadata(pdf);
		if (withToc) pdf = await addTocToPdf(pdf);
		pdfData = Buffer.from(await pdf.save());
		await fs.writeFile(output, pdfData);
	}
	async function genPagePngOnePiece(writeToDisk) {
		const result = [];
		await go("print");
		const slideContainers = page.locator(".print-slide-container");
		const count = await slideContainers.count();
		for (let i = 0; i < count; i++) {
			const id = await slideContainers.nth(i).getAttribute("id") || "";
			const slideNo = +id.split("-")[0];
			if (!pages.includes(slideNo)) continue;
			progress.update(result.length + 1);
			const buffer = await slideContainers.nth(i).screenshot({ omitBackground });
			const filename = `${withClicks ? id : slideNo}.png`;
			result.push({
				slideIndex: slideNo - 1,
				buffer,
				filename
			});
			if (writeToDisk) await fs.writeFile(path.join(writeToDisk, filename), buffer);
		}
		return result;
	}
	async function genPagePngPerSlide(writeToDisk) {
		const result = [];
		const genScreenshot = async (no, clicks) => {
			await go(no, clicks);
			const buffer = await page.screenshot({ omitBackground });
			const filename = `${no.toString().padStart(2, "0")}${clicks ? `-${clicks}` : ""}.png`;
			result.push({
				slideIndex: no - 1,
				buffer,
				filename
			});
			if (writeToDisk) await fs.writeFile(path.join(writeToDisk, filename), buffer);
		};
		for (const no of pages) await genPageWithClicks(genScreenshot, no);
		return result;
	}
	function genPagePdf() {
		if (!output.endsWith(".pdf")) output = `${output}.pdf`;
		return perSlide ? genPagePdfPerSlide() : genPagePdfOnePiece();
	}
	async function genPagePng(writeToDisk) {
		if (writeToDisk) {
			await fs.rm(writeToDisk, {
				force: true,
				recursive: true
			});
			await fs.mkdir(writeToDisk, { recursive: true });
		}
		return perSlide ? genPagePngPerSlide(writeToDisk) : genPagePngOnePiece(writeToDisk);
	}
	async function genPageMd() {
		const pngs = await genPagePng(dirname(output));
		const content = slides.filter(({ index }) => pages.includes(index + 1)).map(({ title, index, note }) => pngs.filter(({ slideIndex }) => slideIndex === index).map(({ filename }) => `![${title || index + 1}](./${filename})\n\n`).join("") + (note ? `${note.trim()}\n\n` : "")).join("---\n\n");
		await fs.writeFile(ensureSuffix(".md", output), content);
	}
	async function genPagePptx(pngs) {
		const { default: PptxGenJS } = await import("pptxgenjs");
		const pptx = new PptxGenJS();
		const layoutName = `${width}x${height}`;
		pptx.defineLayout({
			name: layoutName,
			width: width / 96,
			height: height / 96
		});
		pptx.layout = layoutName;
		const titleSlide = slides[0];
		pptx.author = titleSlide?.frontmatter?.author;
		pptx.company = "Created using Slidev";
		if (titleSlide?.title) pptx.title = titleSlide?.title;
		if (titleSlide?.frontmatter?.info) pptx.subject = titleSlide?.frontmatter?.info;
		pngs.forEach(({ slideIndex, buffer: buffer$1 }) => {
			const slide = pptx.addSlide();
			slide.background = { data: `data:image/png;base64,${buffer$1.toString("base64")}` };
			const note = slides[slideIndex].note;
			if (note) slide.addNotes(note);
		});
		const buffer = await pptx.write({ outputType: "nodebuffer" });
		if (!output.endsWith(".pptx")) output = `${output}.pptx`;
		await fs.writeFile(output, buffer);
	}
	function addPdfMetadata(pdf) {
		const titleSlide = slides[0];
		if (titleSlide?.title) pdf.setTitle(titleSlide.title);
		if (titleSlide?.frontmatter?.info) pdf.setSubject(titleSlide.frontmatter.info);
		if (titleSlide?.frontmatter?.author) pdf.setAuthor(titleSlide.frontmatter.author);
		if (titleSlide?.frontmatter?.keywords) if (Array.isArray(titleSlide?.frontmatter?.keywords)) pdf.setKeywords(titleSlide?.frontmatter?.keywords);
		else pdf.setKeywords(titleSlide?.frontmatter?.keywords.split(","));
	}
	async function addTocToPdf(pdf) {
		const outlinePdf = outlinePdfFactory(pdfLib);
		const slideIndexes = await getSlidesIndex();
		return await outlinePdf({
			outline: makeOutline(slides.filter((slide) => slide.title).reduce((acc, slide) => {
				addToTree(acc, slide, slideIndexes);
				return acc;
			}, [])),
			pdf
		});
	}
}
function getExportOptions(args, options, outFilename) {
	const { entry, output, format, timeout, wait, waitUntil, range: range$1, dark, withClicks, executablePath, withToc, perSlide, scale, omitBackground } = {
		...options.data.config.export,
		...args,
		...clearUndefined({
			waitUntil: args["wait-until"],
			withClicks: args["with-clicks"],
			executablePath: args["executable-path"],
			withToc: args["with-toc"],
			perSlide: args["per-slide"],
			omitBackground: args["omit-background"]
		})
	};
	outFilename = output || outFilename || options.data.config.exportFilename || `${path.basename(entry, ".md")}-export`;
	return {
		output: outFilename,
		slides: options.data.slides,
		total: options.data.slides.length,
		range: range$1,
		format: format || "pdf",
		timeout: timeout ?? 3e4,
		wait: wait ?? 0,
		waitUntil: waitUntil === "none" ? void 0 : waitUntil ?? "networkidle",
		dark: dark || options.data.config.colorSchema === "dark",
		routerMode: options.data.config.routerMode,
		width: options.data.config.canvasWidth,
		height: Math.round(options.data.config.canvasWidth / options.data.config.aspectRatio),
		withClicks: withClicks ?? format === "pptx",
		executablePath,
		withToc: withToc || false,
		perSlide: perSlide || false,
		scale: scale || 2,
		omitBackground: omitBackground ?? false
	};
}
async function importPlaywright() {
	const { userRoot, userWorkspaceRoot } = await getRoots();
	try {
		return await import(await resolve$1("playwright-chromium", { url: userRoot }));
	} catch {}
	if (userWorkspaceRoot !== userRoot) try {
		return await import(await resolve$1("playwright-chromium", { url: userWorkspaceRoot }));
	} catch {}
	const { resolveGlobal } = await import("resolve-global");
	try {
		const imported = await import(resolveGlobal("playwright-chromium"));
		return imported.default ?? imported;
	} catch {}
	try {
		return await import("playwright-chromium");
	} catch {}
	throw new Error("The exporting for Slidev is powered by Playwright, please install it via `npm i -D playwright-chromium`");
}

//#endregion
export { exportNotes, exportSlides, getExportOptions };