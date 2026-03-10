import { parsePadding, setSVGPadding } from '../../utils';
import type { IPlugin, PluginInitOptions } from '../types';
import { Plugin } from './base';

export class CoreSyncPlugin extends Plugin implements IPlugin {
  name = 'core-sync';

  private unregisters: (() => void)[] = [];

  init(options: PluginInitOptions) {
    super.init(options);
    const svg = this.editor.getDocument();

    // viewBox Sync
    this.unregisters.push(
      this.editor.registerSync(
        'viewBox',
        (val) => {
          if (val) {
            svg.setAttribute('viewBox', val);
          } else {
            svg.removeAttribute('viewBox');
          }
        },
        { immediate: true },
      ),
    );

    // padding Sync
    this.unregisters.push(
      this.editor.registerSync(
        'padding',
        (val) => {
          if (val !== undefined) setSVGPadding(svg, parsePadding(val));
        },
        { immediate: true },
      ),
    );
  }

  destroy() {
    this.unregisters.forEach((fn) => fn());
  }
}
