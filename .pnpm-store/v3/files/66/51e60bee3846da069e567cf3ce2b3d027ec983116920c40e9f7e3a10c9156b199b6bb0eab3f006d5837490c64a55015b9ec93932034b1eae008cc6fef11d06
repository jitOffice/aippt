import { mergeDeep, toArray, definePreset } from '@unocss/core';

const LAYER_IMPORTS = "imports";

function createBunnyFontsProvider(name, host) {
  return {
    name,
    getImportUrl(fonts) {
      const fontFamilies = fonts.map((font) => {
        const { name: name2, weights, italic } = font;
        const formattedName = name2.toLowerCase().replace(/\s/g, "-");
        if (!weights?.length)
          return `${formattedName}${italic ? ":i" : ""}`;
        let weightsAsString = weights.map((weight) => weight.toString());
        const weightsHaveItalic = weightsAsString.some((weight) => weight.endsWith("i"));
        if (!weightsHaveItalic && italic)
          weightsAsString = weightsAsString.map((weight) => weight += "i");
        return `${formattedName}:${weightsAsString.join(",")}`;
      });
      return `${host}/css?family=${fontFamilies.join("|")}&display=swap`;
    }
  };
}
const BunnyFontsProvider = createBunnyFontsProvider(
  "bunny",
  "https://fonts.bunny.net"
);

const FontshareProvider = createFontshareProvider("fontshare", "https://api.fontshare.com");
function createFontshareProvider(name, host) {
  return {
    name,
    getImportUrl(fonts) {
      const strings = fonts.map((f) => {
        let name2 = f.name.replace(/\s+/g, "-").toLocaleLowerCase();
        if (f.weights?.length)
          name2 += `@${f.weights.flatMap((w) => f.italic ? Number(w) + 1 : w).sort().join()}`;
        else
          name2 += `@${f.italic ? 2 : 1}`;
        return `f[]=${name2}`;
      }).join("&");
      return `${host}/v2/css?${strings}&display=swap`;
    }
  };
}

function createFontSourceProvider(name, host) {
  const fontsMap = /* @__PURE__ */ new Map();
  const variablesMap = /* @__PURE__ */ new Map();
  return {
    name,
    async getPreflight(fonts) {
      const list = await Promise.all(fonts.map(async (font) => {
        const css = [];
        const id = font.name.toLowerCase().replace(/\s+/g, "-");
        let metadata = fontsMap.get(id);
        if (!metadata) {
          const url = `https://api.fontsource.org/v1/fonts/${id}`;
          try {
            metadata = await (await import('ofetch')).$fetch(url);
            fontsMap.set(id, metadata);
          } catch {
            throw new Error(`Failed to fetch font: ${font.name}`);
          }
        }
        const { subsets, weights } = metadata;
        if (metadata.variable) {
          let variableData = variablesMap.get(id);
          const url = `https://api.fontsource.org/v1/variable/${id}`;
          try {
            variableData = await (await import('ofetch')).$fetch(url);
            variablesMap.set(id, variableData);
          } catch {
            throw new Error(`Failed to fetch font variable: ${font.name}`);
          }
          const mergeAxes = mergeDeep(variableData.axes, font.variable ?? {});
          for (const subset of subsets) {
            const url2 = `${host}/fontsource/fonts/${metadata.id}:vf@latest/${subset}-${font.italic ? "wght-italic" : "wght-normal"}.woff2`;
            const fontObj = {
              family: `${metadata.family}`,
              display: "swap",
              style: font.italic ? "italic" : "normal",
              weight: 400,
              src: [{
                url: url2,
                format: "woff2-variations"
              }],
              variable: {
                wght: mergeAxes.wght ?? void 0,
                wdth: mergeAxes.wdth ?? void 0,
                slnt: mergeAxes.slnt ?? void 0
              },
              unicodeRange: metadata.unicodeRange[subset],
              comment: `${metadata.id}-${subset}-wght-normal`
            };
            css.push(generateFontFace(fontObj));
          }
        } else {
          const _weights = font.weights && font.weights.length > 0 ? font.weights : weights;
          for (const subset of subsets) {
            for (const weight of _weights) {
              const url = `${host}/fontsource/fonts/${metadata.id}@latest/${subset}-${weight}-${font.italic ? "italic" : "normal"}`;
              const fontObj = {
                family: metadata.family,
                display: "swap",
                style: font.italic ? "italic" : "normal",
                weight: Number(weight),
                src: [{
                  url: `${url}.woff2`,
                  format: "woff2"
                }],
                unicodeRange: metadata.unicodeRange[subset],
                comment: `${metadata.id}-${subset}-${weight}${font.italic ? "-italic" : "-normal"}`
              };
              css.push(generateFontFace(fontObj));
            }
          }
        }
        return css;
      }));
      return list.flat().join("\n\n");
    }
  };
}
const FontSourceProvider = createFontSourceProvider("fontsource", "https://cdn.jsdelivr.net");
function generateFontFace(font) {
  const {
    family,
    style,
    display,
    weight,
    variable,
    src,
    unicodeRange,
    comment,
    spacer = "\n  "
  } = font;
  const { wght, wdth, slnt } = variable ?? {};
  let result = "@font-face {";
  result += `${spacer}font-family: '${family}';`;
  result += `${spacer}font-style: ${slnt ? `oblique ${Number(slnt.max) * -1}deg ${Number(slnt.min) * -1}deg` : style};`;
  result += `${spacer}font-display: ${display};`;
  result += `${spacer}font-weight: ${wght ? getVariableWght(wght) : weight};`;
  if (wdth)
    result += `${spacer}font-stretch: ${wdth.min}% ${wdth.max}%;`;
  result += `${spacer}src: ${src.map(({ url, format }) => `url(${url}) format('${format}')`).join(", ")};`;
  if (unicodeRange)
    result += `${spacer}unicode-range: ${unicodeRange};`;
  if (comment)
    result = `/* ${comment} */
${result}`;
  return `${result}
}`;
}
function getVariableWght(axes) {
  if (!axes)
    return "400";
  if (axes.min === axes.max)
    return `${axes.min}`;
  return `${axes.min} ${axes.max}`;
}

function createGoogleCompatibleProvider(name, host) {
  return {
    name,
    getImportUrl(fonts) {
      const sort = (weights) => {
        const firstW = weights.map((w) => w[0]);
        const lastW = weights.map((w) => w[1]);
        return `${firstW.join(";")};${lastW.join(";")}`;
      };
      const strings = fonts.map((i) => {
        let name2 = i.name.replace(/\s+/g, "+");
        if (i.weights?.length) {
          name2 += i.italic ? `:ital,wght@${sort(i.weights.map((w) => [`0,${w}`, `1,${w}`]))}` : `:wght@${i.weights.join(";")}`;
        }
        return `family=${name2}`;
      }).join("&");
      return `${host}/css2?${strings}&display=swap`;
    }
  };
}
const GoogleFontsProvider = createGoogleCompatibleProvider("google", "https://fonts.googleapis.com");

const NoneProvider = {
  name: "none",
  getPreflight() {
    return "";
  },
  getFontName(font) {
    return font.name;
  }
};

const builtinProviders = {
  google: GoogleFontsProvider,
  bunny: BunnyFontsProvider,
  fontshare: FontshareProvider,
  fontsource: FontSourceProvider,
  none: NoneProvider
};
function resolveProvider(provider) {
  if (typeof provider === "string")
    return builtinProviders[provider];
  return provider;
}
function normalizedFontMeta(meta, defaultProvider) {
  if (typeof meta !== "string") {
    meta.provider = resolveProvider(meta.provider || defaultProvider);
    if (meta.weights)
      meta.weights = [...new Set(meta.weights.sort((a, b) => a.toString().localeCompare(b.toString(), "en", { numeric: true })))];
    return meta;
  }
  const [name, weights = ""] = meta.split(":");
  return {
    name,
    weights: [...new Set(weights.split(/[,;]\s*/).filter(Boolean).sort((a, b) => a.localeCompare(b, "en", { numeric: true })))],
    provider: resolveProvider(defaultProvider)
  };
}
function createWebFontPreset(fetcher) {
  return (options = {}) => {
    const {
      provider: defaultProvider = "google",
      extendTheme = true,
      inlineImports = true,
      themeKey = "fontFamily",
      customFetch = fetcher,
      timeouts = {}
    } = options;
    const processors = toArray(options.processors || []);
    const fontObject = Object.fromEntries(
      Object.entries(options.fonts || {}).map(([name, meta]) => [name, toArray(meta).map((m) => normalizedFontMeta(m, defaultProvider))])
    );
    const fonts = Object.values(fontObject).flatMap((i) => i);
    const importCache = {};
    async function fetchWithTimeout(url) {
      if (timeouts === false)
        return customFetch(url);
      const {
        warning = 1e3,
        failure = 2e3
      } = timeouts;
      let warned = false;
      const timer = setTimeout(() => {
        console.warn(`[unocss] Fetching web fonts: ${url}`);
        warned = true;
      }, warning);
      return await Promise.race([
        customFetch(url),
        new Promise((_, reject) => {
          setTimeout(() => reject(new Error(`[unocss] Fetch web fonts timeout.`)), failure);
        })
      ]).then((res) => {
        if (warned)
          console.info(`[unocss] Web fonts fetched.`);
        return res;
      }).finally(() => clearTimeout(timer));
    }
    async function importUrl(url) {
      if (inlineImports) {
        if (!importCache[url]) {
          importCache[url] = fetchWithTimeout(url).catch((e) => {
            console.error(`[unocss] Failed to fetch web fonts: ${url}`);
            console.error(e);
            if (typeof process !== "undefined" && process.env.CI)
              throw e;
          });
        }
        return await importCache[url];
      } else {
        return `@import url('${url}');`;
      }
    }
    const enabledProviders = Array.from(new Set(fonts.map((i) => i.provider)));
    async function getCSSDefault(fonts2, providers) {
      const preflights = [];
      for (const provider of providers) {
        const fontsForProvider = fonts2.filter((i) => i.provider.name === provider.name);
        if (provider.getImportUrl) {
          const url = provider.getImportUrl(fontsForProvider);
          if (url)
            preflights.push(await importUrl(url));
        }
        preflights.push(await provider.getPreflight?.(fontsForProvider));
      }
      const css = preflights.filter(Boolean).join("\n");
      return css;
    }
    const preset = {
      name: "@unocss/preset-web-fonts",
      preflights: [
        {
          async getCSS() {
            let css;
            for (const processor of processors) {
              const result = await processor.getCSS?.(fonts, enabledProviders, getCSSDefault);
              if (result) {
                css = result;
                break;
              }
            }
            if (!css) {
              css = await getCSSDefault(
                fonts,
                enabledProviders
              );
            }
            for (const processor of processors)
              css = await processor.transformCSS?.(css) || css;
            return css;
          },
          layer: inlineImports ? void 0 : LAYER_IMPORTS
        }
      ]
    };
    if (extendTheme) {
      preset.extendTheme = (theme) => {
        if (!theme[themeKey])
          theme[themeKey] = {};
        const obj = Object.fromEntries(
          Object.entries(fontObject).map(([name, fonts2]) => [name, fonts2.map((f) => f.provider.getFontName?.(f) ?? `"${f.name}"`)])
        );
        for (const key of Object.keys(obj)) {
          if (typeof theme[themeKey][key] === "string")
            theme[themeKey][key] = obj[key].map((i) => `${i},`).join("") + theme[themeKey][key];
          else
            theme[themeKey][key] = obj[key].join(",");
        }
      };
    }
    return preset;
  };
}

const userAgentWoff2 = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36";
const defaultFetch = async (url) => (await import('ofetch')).$fetch(url, { headers: { "User-Agent": userAgentWoff2 }, retry: 3 });
const presetWebFonts = definePreset(createWebFontPreset(defaultFetch));

export { createGoogleCompatibleProvider as createGoogleProvider, presetWebFonts as default, normalizedFontMeta, presetWebFonts };
