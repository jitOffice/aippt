import { definePreset } from '@unocss/core';
import { c as createCDNLoader } from './shared/preset-icons.Dg9-HcQU.mjs';
import { c as createPresetIcons, g as getEnvFlags, a as combineLoaders, l as loadIcon } from './shared/preset-icons.Cj7DNehi.mjs';
export { b as createCDNFetchLoader, i as icons, p as parseIconWithLoader } from './shared/preset-icons.Cj7DNehi.mjs';
import 'ofetch';

const _factory = /* @__PURE__ */ createPresetIcons(async (options) => {
  const {
    cdn
  } = options;
  const loaders = [];
  const {
    isNode,
    isVSCode,
    isESLint
  } = getEnvFlags();
  if (isNode && !isVSCode && !isESLint) {
    const nodeLoader = await createNodeLoader();
    if (nodeLoader !== void 0)
      loaders.push(nodeLoader);
  }
  if (cdn)
    loaders.push(createCDNLoader(cdn));
  loaders.push(loadIcon);
  return combineLoaders(loaders);
});
const presetIcons = /* @__PURE__ */ definePreset((options = {}) => {
  const preset = _factory(options);
  const api = preset.api;
  api.createNodeLoader = createNodeLoader;
  return preset;
});
async function createNodeLoader() {
  try {
    return await import('@iconify/utils/lib/loader/node-loader').then((i) => i?.loadNodeIcon);
  } catch {
  }
  try {
    return require("@iconify/utils/lib/loader/node-loader.cjs").loadNodeIcon;
  } catch {
  }
}

export { combineLoaders, createNodeLoader, createPresetIcons, presetIcons as default, getEnvFlags, presetIcons };
