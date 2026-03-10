import { exportToSVG } from '../exporter';
import type { InfographicOptions } from '../options';
import { getFontURLs } from '../renderer';
import { Infographic } from '../runtime';
import { decodeFontFamily } from '../utils';
import { setupDOM } from './dom-shim';

export async function renderToString(
  options: string | Partial<InfographicOptions>,
  init?: Partial<InfographicOptions>,
): Promise<string> {
  const { document } = setupDOM();
  const container = document.getElementById('container') as HTMLElement;
  let infographic: Infographic | undefined;
  let timeoutId: NodeJS.Timeout;

  try {
    infographic = new Infographic({
      ...init,
      container,
      editable: false,
    });

    const renderPromise = new Promise<string>((resolve, reject) => {
      infographic!.on('loaded', async ({ node }) => {
        try {
          const svg = await exportToSVG(node, { embedResources: true });
          resolve(svg.outerHTML);
        } catch (e) {
          reject(e);
        }
      });
    });

    const timeoutPromise = new Promise<string>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('SSR render timeout'));
      }, 10000);
    });

    infographic.render(options);

    const svg = await Promise.race([renderPromise, timeoutPromise]);
    return injectXMLStylesheet(svg);
  } finally {
    clearTimeout(timeoutId!);
    if (infographic) {
      infographic.destroy();
    }
  }
}

function injectXMLStylesheet(svg: string): string {
  const matched = svg.matchAll(/font-family="([\S ]+?)"/g);
  const fonts = Array.from(matched, (match) => match[1]);
  const set = new Set<string>();

  fonts.forEach((font) => {
    const decoded = decodeFontFamily(font);
    decoded.split(',').forEach((f) => set.add(f.trim()));
  });

  const urls = Array.from(set)
    .map((font) => getFontURLs(font))
    .flat();

  if (urls.length === 0) return svg;

  return `<?xml version="1.0" encoding="UTF-8"?>
${urls.map((url) => `<?xml-stylesheet href="${url}" type="text/css"?>`).join('\n')}
${svg}`;
}
