import { c as createCDNLoader } from './shared/preset-icons.Dg9-HcQU.mjs';
import { c as createPresetIcons, b as createCDNFetchLoader, l as loadIcon } from './shared/preset-icons.Cj7DNehi.mjs';
export { a as combineLoaders, g as getEnvFlags, i as icons, p as parseIconWithLoader } from './shared/preset-icons.Cj7DNehi.mjs';
import 'ofetch';
import '@unocss/core';

const presetIcons = createPresetIcons(async (options) => {
  const fetcher = options?.customFetch;
  const cdn = options?.cdn;
  if (fetcher && cdn)
    return createCDNFetchLoader(fetcher, cdn);
  if (cdn)
    return createCDNLoader(cdn);
  return loadIcon;
});

export { createCDNFetchLoader, createPresetIcons, presetIcons as default, presetIcons };
