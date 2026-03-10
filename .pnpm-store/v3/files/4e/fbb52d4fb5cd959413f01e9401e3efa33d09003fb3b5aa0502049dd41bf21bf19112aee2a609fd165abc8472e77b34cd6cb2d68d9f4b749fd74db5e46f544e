import { isNumber, range, uniq } from "@antfu/utils";

//#region src/timesplit/timestring.ts
/**
* Parse timestamp into seconds
*
* Accepts:
* - 10:50.1
* - 10s
* - 5m
* - 3min
* - 3mins 5secs
* - 10.5m3s
* - +10s
* - 1h10m30s
* - 1h4s
* - 1:1:1
*/
function parseTimeString(timestamp) {
	if (typeof timestamp === "number") return {
		seconds: timestamp,
		relative: false
	};
	const relative = timestamp.startsWith("+");
	if (relative) timestamp = timestamp.slice(1);
	let seconds = 0;
	if (timestamp.includes(":")) {
		const parts = timestamp.split(":").map(Number);
		let h = 0;
		let m = 0;
		let s = 0;
		if (parts.length === 3) {
			h = parts[0];
			m = parts[1];
			s = parts[2];
		} else if (parts.length === 2) {
			m = parts[0];
			s = parts[1];
		} else if (parts.length === 1) s = parts[0];
		else throw new TypeError("Invalid timestamp format");
		if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s)) throw new TypeError("Invalid timestamp format");
		seconds = (h || 0) * 3600 + (m || 0) * 60 + (s || 0);
	} else if (!timestamp.match(/[a-z]/i)) seconds = Number(timestamp);
	else {
		const unitMap = {
			s: 1,
			sec: 1,
			secs: 1,
			m: 60,
			min: 60,
			mins: 60,
			h: 3600,
			hr: 3600,
			hrs: 3600,
			hour: 3600,
			hours: 3600,
			day: 86400,
			days: 86400,
			week: 604800,
			weeks: 604800,
			month: 2629746,
			months: 2629746,
			year: 31556952,
			years: 31556952
		};
		const regex = /([\d.]+)([a-z]+)/gi;
		const matches = timestamp.matchAll(regex);
		if (matches) for (const match of matches) {
			const value = Number(match[1]);
			if (Number.isNaN(value)) throw new TypeError(`Invalid timestamp value: ${match[1]}`);
			const unit = match[2].toLowerCase();
			if (!(unit in unitMap)) throw new TypeError(`Invalid timestamp unit: ${unit}`);
			seconds += value * unitMap[unit];
		}
		const remaining = timestamp.replace(regex, "").trim();
		if (remaining) throw new TypeError(`Unknown timestamp remaining: ${remaining}`);
	}
	return {
		seconds,
		relative
	};
}

//#endregion
//#region src/timesplit/timesplit.ts
function parseTimesplits(inputs) {
	let ts = 0;
	const outputs = [];
	let current = {
		timestampStart: ts,
		timestampEnd: ts,
		noStart: 0,
		noEnd: 0,
		title: "[start]"
	};
	outputs.push(current);
	for (const input of inputs) {
		const time = parseTimeString(input.timesplit);
		const end = time.relative ? ts + time.seconds : time.seconds;
		if (end < ts) throw new Error(`Timesplit end ${end} is before start ${ts}`);
		current.timestampEnd = end;
		current.noEnd = input.no;
		if (input.title) current.title = input.title;
		ts = end;
		current = {
			timestampStart: end,
			timestampEnd: end,
			noStart: input.no,
			noEnd: input.no
		};
		outputs.push(current);
	}
	return outputs;
}

//#endregion
//#region src/utils.ts
/**
* 1,3-5,8 => [1, 3, 4, 5, 8]
*/
function parseRangeString(total, rangeStr) {
	if (!rangeStr || rangeStr === "all" || rangeStr === "*") return range(1, total + 1);
	if (rangeStr === "none") return [];
	const indexes = [];
	for (const part of rangeStr.split(/[,;]/g)) if (!part.includes("-")) indexes.push(+part);
	else {
		const [start, end] = part.split("-", 2);
		indexes.push(...range(+start, !end ? total + 1 : +end + 1));
	}
	return uniq(indexes).filter((i) => i <= total).sort((a, b) => a - b);
}
/**
* Accepts `16/9` `1:1` `3x4`
*/
function parseAspectRatio(str) {
	if (isNumber(str)) return str;
	if (!Number.isNaN(+str)) return +str;
	const [wStr = "", hStr = ""] = str.split(/[:/x|]/);
	const w = Number.parseFloat(wStr.trim());
	const h = Number.parseFloat(hStr.trim());
	if (Number.isNaN(w) || Number.isNaN(h) || h === 0) throw new Error(`Invalid aspect ratio "${str}"`);
	return w / h;
}

//#endregion
export { parseTimeString as i, parseRangeString as n, parseTimesplits as r, parseAspectRatio as t };