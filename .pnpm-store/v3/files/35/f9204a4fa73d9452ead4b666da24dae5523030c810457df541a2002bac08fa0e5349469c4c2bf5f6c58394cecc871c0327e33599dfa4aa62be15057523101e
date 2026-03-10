import { insert, memo, effect, style, className, template, use, createComponent } from 'solid-js/web';
import { createSignal, createEffect, createMemo } from 'solid-js';
import { createMagicMoveMachine, codeToKeyedTokens, syncTokenKeys, toKeyedTokens } from './core.mjs';
import { MagicMoveRenderer } from './renderer.mjs';
import 'diff-match-patch-es';
import 'ohash';

function normalizeCSSProperties(css) {
  if (typeof css === 'string') {
    const style = {};
    css?.split(';').forEach(pair => {
      const [key, value] = pair.split(':');
      if (key && value) style[key.trim()] = value.trim();
    });
    return style;
  }
  return css;
}

var _tmpl$ = /*#__PURE__*/template(`<pre><div>`),
  _tmpl$2 = /*#__PURE__*/template(`<br>`),
  _tmpl$3 = /*#__PURE__*/template(`<span>`);
/**
 * A wrapper component to `MagicMoveRenderer`
 */
function ShikiMagicMoveRenderer(props) {
  let container;
  let renderer;
  const [isMounted, setIsMounted] = createSignal(false);
  createEffect(() => {
    if (!container) return;
    // Remove previous content
    container.innerHTML = '';
    setIsMounted(true);
    renderer = new MagicMoveRenderer(container);
  });
  createEffect(() => {
    async function render() {
      if (!renderer) return;
      Object.assign(renderer.options, props.options);
      if (props.animate === undefined || props.animate === true) {
        if (props.previous) renderer.replace(props.previous);
        props.onStart?.();
        await renderer.render(props.tokens);
        props.onEnd?.();
      } else {
        renderer.replace(props.tokens);
      }
    }
    render();
  });
  return (() => {
    var _el$ = _tmpl$(),
      _el$2 = _el$.firstChild;
    var _ref$ = container;
    typeof _ref$ === "function" ? use(_ref$, _el$) : container = _el$;
    insert(_el$2, (() => {
      var _c$ = memo(() => !!isMounted());
      return () => _c$() ? undefined : props.tokens?.tokens.map(token => {
        if (token.content === '\n') return _tmpl$2();
        return (() => {
          var _el$4 = _tmpl$3();
          insert(_el$4, () => token.content);
          effect(_p$ => {
            var _v$3 = {
                ...normalizeCSSProperties(token.htmlStyle),
                color: token.color
              },
              _v$4 = ['shiki-magic-move-item', token.htmlClass].filter(Boolean).join(' ');
            _p$.e = style(_el$4, _v$3, _p$.e);
            _v$4 !== _p$.t && className(_el$4, _p$.t = _v$4);
            return _p$;
          }, {
            e: undefined,
            t: undefined
          });
          return _el$4;
        })();
      });
    })());
    effect(_p$ => {
      var _v$ = `shiki-magic-move-container ${props.class || ''}`.trim(),
        _v$2 = props.style;
      _v$ !== _p$.e && className(_el$, _p$.e = _v$);
      _p$.t = style(_el$, _v$2, _p$.t);
      return _p$;
    }, {
      e: undefined,
      t: undefined
    });
    return _el$;
  })();
}

function ShikiMagicMove(props) {
  const codeToTokens = (code, lineNumbers) => codeToKeyedTokens(props.highlighter, code, {
    lang: props.lang,
    theme: props.theme
  }, lineNumbers);
  const machine = createMagicMoveMachine((code, lineNumbers) => codeToTokens(code, lineNumbers));
  const result = createMemo(() => {
    const lineNumbers = props.options?.lineNumbers ?? false;
    if (props.code === machine.current.code && props.theme === machine.current.themeName && props.lang === machine.current.lang && lineNumbers === machine.current.lineNumbers) {
      return machine;
    }
    return machine.commit(props.code, props.options);
  });
  return createComponent(ShikiMagicMoveRenderer, {
    get tokens() {
      return result().current;
    },
    get options() {
      return props.options;
    },
    get previous() {
      return result().previous;
    },
    get onStart() {
      return props.onStart;
    },
    get onEnd() {
      return props.onEnd;
    },
    get ["class"]() {
      return props.class;
    }
  });
}

const EMPTY = /* @__PURE__ */toKeyedTokens('', []);

/**
 * Component to render a compiled magic move step,
 * Where the tokens can be generated on build time.
 */
function ShikiMagicMovePrecompiled(props) {
  const [previous, setPrevious] = createSignal(EMPTY);
  const result = createMemo(() => {
    const res = syncTokenKeys(previous(), props.steps[Math.min(props.step ?? 0, props.steps.length - 1)], props.options);
    setPrevious(res.to);
    return res;
  });
  return createComponent(ShikiMagicMoveRenderer, {
    get tokens() {
      return result().to;
    },
    get previous() {
      return result().from;
    },
    get options() {
      return props.options;
    },
    get animate() {
      return props.animate ?? true;
    },
    get onStart() {
      return props.onStart;
    },
    get onEnd() {
      return props.onEnd;
    }
  });
}

export { ShikiMagicMove, ShikiMagicMovePrecompiled, ShikiMagicMoveRenderer };
