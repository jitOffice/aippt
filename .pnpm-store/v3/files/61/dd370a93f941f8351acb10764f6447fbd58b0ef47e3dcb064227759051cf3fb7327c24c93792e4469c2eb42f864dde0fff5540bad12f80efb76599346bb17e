import * as React from 'react';
import { codeToKeyedTokens, createMagicMoveMachine, syncTokenKeys, toKeyedTokens } from './core.mjs';
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

/**
 * A wrapper component to `MagicMoveRenderer`
 */
function ShikiMagicMoveRenderer({
  animate = true,
  tokens,
  previous,
  options,
  onStart,
  onEnd,
  className,
  style
}) {
  const container = React.useRef(null);
  const renderer = React.useRef(null);
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    if (!container.current) return;
    // Remove previous content
    container.current.innerHTML = '';
    setIsMounted(true);
    renderer.current = new MagicMoveRenderer(container.current);
  }, []);
  React.useEffect(() => {
    async function render() {
      if (!renderer.current) return;
      Object.assign(renderer.current.options, options);
      if (animate) {
        if (previous) renderer.current.replace(previous);
        onStart?.();
        await renderer.current.render(tokens);
        onEnd?.();
      } else {
        renderer.current.replace(tokens);
      }
    }
    render();
    // FIXME: we should only re-render when tokens change, but react-hooks rule doesn't allow.
    // Try to correct the dependency array if something goes wrong.
  }, [tokens]);
  return /*#__PURE__*/React.createElement("pre", {
    ref: container,
    className: `shiki-magic-move-container ${className || ''}`.trim(),
    style: style
  }, /*#__PURE__*/React.createElement("div", null, isMounted ? undefined : tokens.tokens.map(token => {
    if (token.content === '\n') return /*#__PURE__*/React.createElement("br", {
      key: token.key
    });
    return /*#__PURE__*/React.createElement("span", {
      style: {
        ...normalizeCSSProperties(token.htmlStyle),
        color: token.color
      },
      className: ['shiki-magic-move-item', token.htmlClass].filter(Boolean).join(' '),
      key: token.key
    }, token.content);
  })));
}

function ShikiMagicMove(props) {
  const codeToTokens = React.useRef((code, lineNumbers) => codeToKeyedTokens(props.highlighter, code, {
    lang: props.lang,
    theme: props.theme
  }, lineNumbers));
  const machine = React.useRef(null);
  machine.current = machine.current || createMagicMoveMachine((code, lineNumbers) => codeToTokens.current(code, lineNumbers));
  const lineNumbers = props.options?.lineNumbers ?? false;
  const result = React.useMemo(() => {
    if (props.code === machine.current.current.code && props.theme === machine.current.current.themeName && props.lang === machine.current.current.lang && lineNumbers === machine.current.current.lineNumbers) {
      return machine.current;
    }
    return machine.current.commit(props.code, props.options);
  }, [props.code, props.options, props.theme, props.lang, lineNumbers]);
  return /*#__PURE__*/React.createElement(ShikiMagicMoveRenderer, {
    tokens: result.current,
    options: props.options,
    previous: result.previous,
    onStart: props.onStart,
    onEnd: props.onEnd,
    className: props.className
  });
}

const EMPTY = /* @__PURE__ */toKeyedTokens('', []);

/**
 * Component to render a compiled magic move step,
 * Where the tokens can be generated on build time.
 */
function ShikiMagicMovePrecompiled({
  steps,
  step = 0,
  animate = true,
  options,
  onStart,
  onEnd
}) {
  const previousRef = React.useRef(EMPTY);
  const result = React.useMemo(() => {
    const res = syncTokenKeys(previousRef.current, steps[Math.min(step, steps.length - 1)], options);
    previousRef.current = res.to;
    return res;
  }, [steps, step, options]);
  return /*#__PURE__*/React.createElement(ShikiMagicMoveRenderer, {
    tokens: result.to,
    previous: result.from,
    options: options,
    animate: animate,
    onStart: onStart,
    onEnd: onEnd
  });
}

export { ShikiMagicMove, ShikiMagicMovePrecompiled, ShikiMagicMoveRenderer };
