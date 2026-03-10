//#region src/timesplit/timesplit.d.ts
interface TimesplitInput {
  no: number;
  timesplit: string;
  title?: string;
}
interface TimesplitOutput {
  timestampStart: number;
  timestampEnd: number;
  noStart: number;
  noEnd: number;
  title?: string;
}
declare function parseTimesplits(inputs: TimesplitInput[]): TimesplitOutput[];
//#endregion
//#region src/timesplit/timestring.d.ts
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
declare function parseTimeString(timestamp: string | number): {
  seconds: number;
  relative: boolean;
};
//#endregion
//#region src/utils.d.ts
/**
 * 1,3-5,8 => [1, 3, 4, 5, 8]
 */
declare function parseRangeString(total: number, rangeStr?: string): number[];
/**
 * Accepts `16/9` `1:1` `3x4`
 */
declare function parseAspectRatio(str: string | number): number;
//#endregion
export { TimesplitOutput as a, TimesplitInput as i, parseRangeString as n, parseTimesplits as o, parseTimeString as r, parseAspectRatio as t };