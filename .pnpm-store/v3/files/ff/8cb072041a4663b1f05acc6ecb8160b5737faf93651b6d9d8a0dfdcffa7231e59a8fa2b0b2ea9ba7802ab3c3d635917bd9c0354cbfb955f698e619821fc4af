import { createMagicMoveMachine, codeToKeyedTokens, toKeyedTokens, syncTokenKeys } from './core.mjs';
import { MagicMoveRenderer } from './renderer.mjs';
import 'diff-match-patch-es';
import 'ohash';

class ShikiMagicMoveRenderer extends HTMLElement {
  _animated = true;
  _class = '';
  get animated() {
    return this._animated;
  }
  set animated(value) {
    this._animated = value;
    this.propertyChangedCallback();
  }
  get tokens() {
    return this._tokens;
  }
  set tokens(value) {
    this._tokens = value;
    this.propertyChangedCallback();
  }
  get previous() {
    return this._previous;
  }
  set previous(value) {
    this._previous = value;
    this.propertyChangedCallback();
  }
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
    if (this.renderer) Object.assign(this.renderer.options, this.options);
    this.propertyChangedCallback();
  }
  get class() {
    return this._class;
  }
  set class(value) {
    this._class = value;
    this.propertyChangedCallback();
  }
  batchUpdate = false;
  hasUpdated = false;
  constructor() {
    super();
  }
  connectedCallback() {
    this.container = document.createElement('pre');
    this.container.classList.add('shiki-magic-move-container');
    this.container.className += ` ${this.class}`;
    this.renderer = new MagicMoveRenderer(this.container);
    this.renderer.render(this.tokens);
    this.appendChild(this.container);
  }
  propertyChangedCallback() {
    if (!this.batchUpdate) {
      this.batchUpdate = true;
      setTimeout(() => {
        this.batchUpdate = false;
        if (!this.hasUpdated) {
          this.hasUpdated = true;
          return;
        }
        if (this.renderer) this.transform();
      }, 0);
    }
  }
  async transform() {
    if (!this.renderer) return;
    if (!this.animated) return;
    if (this.previous && this.previous === this.tokens) return;
    if (this.previous) {
      this.renderer.replace(this.previous);
      this.dispatchEvent(new CustomEvent('onStart'));
      await this.renderer?.render(this.tokens);
      this.dispatchEvent(new CustomEvent('onEnd'));
    } else {
      this.renderer.replace(this.tokens);
    }
  }
}
customElements.define('shiki-magic-move-renderer', ShikiMagicMoveRenderer);

class ShikiMagicMove extends HTMLElement {
  get highlighter() {
    return this._highlighter;
  }
  set highlighter(value) {
    this._highlighter = value;
    this.propertyChangedCallback();
  }
  get lang() {
    return this._lang;
  }
  set lang(value) {
    this._lang = value;
    this.propertyChangedCallback();
  }
  get theme() {
    return this._theme;
  }
  set theme(value) {
    this._theme = value;
    this.propertyChangedCallback();
  }
  get code() {
    return this._code;
  }
  set code(value) {
    this._code = value;
    this.propertyChangedCallback();
  }
  get class() {
    return this._class;
  }
  set class(value) {
    this._class = value;
    this.propertyChangedCallback();
  }
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
    this.propertyChangedCallback();
  }
  batchUpdate = false;
  hasUpdated = false;
  constructor() {
    super();
  }
  connectedCallback() {
    this.renderer = document.createElement('shiki-magic-move-renderer');
    this.renderer.addEventListener('onStart', () => this.dispatchEvent(new CustomEvent('onStart')));
    this.renderer.addEventListener('onEnd', () => this.dispatchEvent(new CustomEvent('onEnd')));
    this.machine = createMagicMoveMachine(code => codeToKeyedTokens(this.highlighter, code, {
      lang: this.lang,
      theme: this.theme
    }, this.options?.lineNumbers), this.options);
    this.updateRenderer();
    this.appendChild(this.renderer);
  }
  propertyChangedCallback() {
    if (!this.batchUpdate) {
      this.batchUpdate = true;
      setTimeout(() => {
        this.batchUpdate = false;
        if (!this.hasUpdated) {
          this.hasUpdated = true;
          return;
        }
        this.updateRenderer();
      }, 0);
    }
  }
  updateRenderer() {
    if (this.machine && this.renderer) {
      this.result = this.machine.commit(this.code, this.options);
      this.renderer.tokens = this.result.current;
      this.renderer.previous = this.result.previous;
      this.renderer.options = this.options;
      this.renderer.class = this.class ?? '';
    }
  }
}
customElements.define('shiki-magic-move', ShikiMagicMove);

class ShikiMagicMovePrecompiled extends HTMLElement {
  _steps = [];
  _step = 0;
  _animated = true;
  get steps() {
    return this._steps;
  }
  set steps(value) {
    this._steps = value;
    this.propertyChangedCallback();
  }
  get step() {
    return this._step;
  }
  set step(value) {
    this._step = value;
    this.propertyChangedCallback();
  }
  get animated() {
    return this._animated;
  }
  set animated(value) {
    this._animated = value;
    this.propertyChangedCallback();
  }
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = value;
    this.propertyChangedCallback();
  }
  previous = toKeyedTokens('', []);
  batchUpdate = false;
  hasUpdated = false;
  constructor() {
    super();
  }
  connectedCallback() {
    this.renderer = document.createElement('shiki-magic-move-renderer');
    this.renderer.addEventListener('onStart', () => this.dispatchEvent(new CustomEvent('onStart')));
    this.renderer.addEventListener('onEnd', () => this.dispatchEvent(new CustomEvent('onEnd')));
    this.updateRenderer();
    this.appendChild(this.renderer);
  }
  propertyChangedCallback() {
    if (!this.batchUpdate) {
      this.batchUpdate = true;
      setTimeout(() => {
        this.batchUpdate = false;
        if (!this.hasUpdated) {
          this.hasUpdated = true;
          return;
        }
        this.updateRenderer();
      }, 0);
    }
  }
  updateRenderer() {
    const result = syncTokenKeys(this.previous, this.steps[Math.min(this.step, this.steps.length - 1)], this.options);
    this.previous = result.to;
    this.renderer.tokens = result.to;
    this.renderer.previous = result.from;
    this.renderer.options = this.options;
    this.renderer.animated = this.animated;
  }
}
customElements.define('shiki-magic-move-precompiled', ShikiMagicMovePrecompiled);

export { ShikiMagicMove, ShikiMagicMovePrecompiled, ShikiMagicMoveRenderer };
