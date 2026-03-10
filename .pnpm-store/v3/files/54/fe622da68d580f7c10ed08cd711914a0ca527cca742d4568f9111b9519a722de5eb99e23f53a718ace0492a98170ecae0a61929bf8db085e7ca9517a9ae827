// https://en.wikipedia.org/wiki/Linear_congruential_generator#Parameters_in_common_use
const a$1 = 1664525;
const c$1 = 1013904223;
const m$1 = 4294967296; // 2^32

function lcg$1() {
  let s = 1;
  return () => (s = (a$1 * s + c$1) % m$1) / m$1;
}

export { lcg$1 as default };
//# sourceMappingURL=lcg.js.map
