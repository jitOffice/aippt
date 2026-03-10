import { defineComponent as A, getCurrentInstance as w, reactive as L, ref as k, onMounted as T, onUpdated as O, onBeforeUnmount as $, watch as S, h as j, onUnmounted as U, computed as V, toValue as h } from "vue";
import p from "konva/lib/Core";
import D from "konva";
function y(o) {
  if (!D.autoDrawEnabled) {
    const n = o.getLayer() || o.getStage();
    n && n.batchDraw();
  }
}
const E = { key: !0, style: !0, elm: !0, isRootInsert: !0 }, N = ".vue-konva-event";
function M(o, n, r, s) {
  const e = o.__konvaNode, u = {};
  let c = !1;
  for (let t in r) {
    if (E.hasOwnProperty(t))
      continue;
    const a = t.slice(0, 2) === "on", d = r[t] !== n[t];
    if (a && d) {
      let f = t.slice(2).toLowerCase();
      f.slice(0, 7) === "content" && (f = "content" + f.slice(7, 1).toUpperCase() + f.slice(8)), e?.off(f + N, r[t]);
    }
    !n.hasOwnProperty(t) && e?.setAttr(t, void 0);
  }
  for (let t in n) {
    if (E.hasOwnProperty(t))
      continue;
    let a = t.slice(0, 2) === "on";
    const d = r[t] !== n[t];
    if (a && d) {
      let l = t.slice(2).toLowerCase();
      l.slice(0, 7) === "content" && (l = "content" + l.slice(7, 1).toUpperCase() + l.slice(8)), n[t] && (e?.off(l + N), e?.on(l + N, n[t]));
    }
    !a && (n[t] !== r[t] || s && n[t] !== e?.getAttr(t)) && (c = !0, u[t] = n[t]);
  }
  c && e && (e.setAttrs(u), y(e));
}
const P = ".vue-konva-vmodel", b = "onUpdate:";
function m(o, n) {
  o.off(P);
  const r = n.vnode.props || {};
  for (const s in r)
    if (s.startsWith(b)) {
      const e = s.slice(b.length), u = r[s];
      o.on(`${e}Change${P}`, () => {
        u(o.getAttr(e));
      });
    }
}
const F = "V";
function z(o) {
  function n(r) {
    return r?.__konvaNode ? r : r?.parent ? n(r.parent) : (console.error("vue-konva error: Can not find parent node"), null);
  }
  return n(o.parent);
}
function x(o) {
  return o.component ? o.component.__konvaNode || x(o.component.subTree) : null;
}
function B(o) {
  const { el: n, component: r } = o, s = x(o);
  if (n?.tagName && r && !s) {
    const e = n.tagName.toLowerCase();
    return console.error(
      `vue-konva error: You are trying to render "${e}" inside your component tree. Looks like it is not a Konva node. You can render only Konva components inside the Stage.`
    ), null;
  }
  return s;
}
function G(o) {
  const n = (e) => !!e && typeof e == "object" && "component" in e, r = (e) => Array.isArray(e), s = (e) => n(e) ? [e, ...s(e.children)] : r(e) ? e.flatMap(s) : [];
  return s(o.children);
}
function K(o, n) {
  const r = G(o), s = [];
  r.forEach((u) => {
    const c = B(u);
    c && s.push(c);
  });
  let e = !1;
  s.forEach((u, c) => {
    u.getZIndex() !== c && (u.setZIndex(c), e = !0);
  }), e && y(n);
}
const W = p.default || p, Y = A({
  name: "Stage",
  props: {
    config: {
      type: Object,
      default: function() {
        return {};
      }
    },
    __useStrictMode: {
      type: Boolean
    }
  },
  inheritAttrs: !1,
  setup(o, { attrs: n, slots: r, expose: s }) {
    const e = w();
    if (!e) return;
    const u = L({}), c = k(null), t = new W.Stage({
      width: o.config.width,
      height: o.config.height,
      container: document.createElement("div")
    });
    e.__konvaNode = t, l();
    function a() {
      return e?.__konvaNode;
    }
    function d() {
      return e?.__konvaNode;
    }
    function l() {
      if (!e) return;
      const f = u || {}, g = {
        ...n,
        ...o.config
      };
      M(e, g, f, o.__useStrictMode), Object.assign(u, g);
    }
    return T(() => {
      c.value && t.container(c.value), l(), m(t, e);
    }), O(() => {
      l(), K(e.subTree, t), m(t, e);
    }), $(() => {
      t.destroy();
    }), S(() => o.config, l, { deep: !0 }), s({
      getStage: d,
      getNode: a
    }), () => j(
      "div",
      {
        ref: c,
        id: n?.id,
        accesskey: n?.accesskey,
        class: n?.class,
        role: n?.role,
        style: n?.style,
        tabindex: n?.tabindex,
        title: n?.title
      },
      r.default?.()
    );
  }
}), Z = ".vue-konva-event", X = {
  Group: !0,
  Layer: !0,
  FastLayer: !0,
  Label: !0
};
function I(o, n) {
  return A({
    name: o,
    props: {
      config: {
        type: Object,
        default: function() {
          return {};
        }
      },
      __useStrictMode: {
        type: Boolean
      }
    },
    setup(r, { attrs: s, slots: e, expose: u }) {
      const c = w();
      if (!c) return;
      const t = L({}), a = new n();
      c.__konvaNode = a, c.vnode.__konvaNode = a, f();
      function d() {
        return c?.__konvaNode;
      }
      function l() {
        return c?.__konvaNode;
      }
      function f() {
        if (!c) return;
        const v = {};
        for (const _ in c?.vnode.props)
          _.slice(0, 2) === "on" && (v[_] = c.vnode.props[_]);
        const R = t || {}, C = {
          ...s,
          ...r.config,
          ...v
        };
        M(c, C, R, r.__useStrictMode), Object.assign(t, C);
      }
      T(() => {
        const v = z(c)?.__konvaNode;
        v && "add" in v && v.add(a), y(a), m(a, c);
      }), U(() => {
        y(a), a.destroy(), a.off(Z), a.off(P);
      }), O(() => {
        f(), K(c.subTree, a), m(a, c);
      }), S(() => r.config, f, { deep: !0 }), u({
        getStage: l,
        getNode: d
      });
      const g = X.hasOwnProperty(o);
      return () => g ? e.default?.() : null;
    }
  });
}
function Se(o, n, r) {
  const s = k(null), e = k("loading"), u = (t, a, d) => {
    e.value = "loading";
    const l = new Image();
    a && (l.crossOrigin = a), d && (l.referrerPolicy = d), l.onload = () => {
      s.value = l, e.value = "loaded";
    }, l.onerror = () => {
      s.value = null, e.value = "error";
    }, l.src = t;
  }, c = V(() => ({
    url: h(o),
    crossorigin: h(n),
    referrerPolicy: h(r)
  }));
  return S(
    c,
    ({ url: t, crossorigin: a, referrerPolicy: d }) => {
      t && u(t, a, d);
    },
    { immediate: !0 }
  ), [s, e];
}
const q = p.default || p;
function i(o) {
  return I(o, function(...r) {
    const s = q[o];
    if (!s)
      throw new Error(
        `vue-konva: ${o} is not available. Did you forget to import it?
Add: import 'konva/lib/shapes/${o}'`
      );
    return new s(...r);
  });
}
const H = i("Arc"), J = i("Arrow"), Q = i("Circle"), ee = i("Ellipse"), ne = i("FastLayer"), oe = i("Group"), te = i("Image"), re = i("Label"), ce = i("Layer"), se = i("Line"), ae = i("Path"), ie = i("Rect"), ue = i("RegularPolygon"), le = i("Ring"), de = i("Shape"), fe = i("Sprite"), ve = i("Star"), ge = i("Tag"), pe = i("Text"), ye = i("TextPath"), me = i("Transformer"), _e = i("Wedge"), he = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Arc: H,
  Arrow: J,
  Circle: Q,
  Ellipse: ee,
  FastLayer: ne,
  Group: oe,
  Image: te,
  Label: re,
  Layer: ce,
  Line: se,
  Path: ae,
  Rect: ie,
  RegularPolygon: ue,
  Ring: le,
  Shape: de,
  Sprite: fe,
  Star: ve,
  Tag: ge,
  Text: pe,
  TextPath: ye,
  Transformer: me,
  Wedge: _e
}, Symbol.toStringTag, { value: "Module" })), Ce = {
  install: (o, n) => {
    const r = n?.prefix || F, s = n?.customNodes ? Object.entries(n.customNodes).map(
      ([u, c]) => I(u, c)
    ) : [];
    [
      Y,
      ...Object.values(he),
      ...s
    ].forEach((u) => {
      o.component(`${r}${u.name}`, u);
    });
  }
};
export {
  H as Arc,
  J as Arrow,
  Q as Circle,
  ee as Ellipse,
  ne as FastLayer,
  oe as Group,
  te as Image,
  re as Label,
  ce as Layer,
  se as Line,
  ae as Path,
  ie as Rect,
  ue as RegularPolygon,
  le as Ring,
  de as Shape,
  fe as Sprite,
  Y as Stage,
  ve as Star,
  ge as Tag,
  pe as Text,
  ye as TextPath,
  me as Transformer,
  _e as Wedge,
  Ce as default,
  Se as useImage
};
