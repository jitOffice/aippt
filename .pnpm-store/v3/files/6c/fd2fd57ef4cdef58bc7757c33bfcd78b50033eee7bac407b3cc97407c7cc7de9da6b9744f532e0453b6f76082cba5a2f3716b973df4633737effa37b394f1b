import { defineComponent as C, getCurrentInstance as L, reactive as w, ref as k, onMounted as O, onUpdated as x, onBeforeUnmount as j, watch as A, h as U, onUnmounted as V, computed as $, toValue as N } from "vue";
import p from "konva";
function y(o) {
  if (!p.autoDrawEnabled) {
    const n = o.getLayer() || o.getStage();
    n && n.batchDraw();
  }
}
const T = { key: !0, style: !0, elm: !0, isRootInsert: !0 }, S = ".vue-konva-event";
function M(o, n, c, a) {
  const e = o.__konvaNode, l = {};
  let r = !1;
  for (let t in c) {
    if (T.hasOwnProperty(t))
      continue;
    const s = t.slice(0, 2) === "on", f = c[t] !== n[t];
    if (s && f) {
      let g = t.slice(2).toLowerCase();
      g.slice(0, 7) === "content" && (g = "content" + g.slice(7, 1).toUpperCase() + g.slice(8)), e?.off(g + S, c[t]);
    }
    !n.hasOwnProperty(t) && e?.setAttr(t, void 0);
  }
  for (let t in n) {
    if (T.hasOwnProperty(t))
      continue;
    let s = t.slice(0, 2) === "on";
    const f = c[t] !== n[t];
    if (s && f) {
      let d = t.slice(2).toLowerCase();
      d.slice(0, 7) === "content" && (d = "content" + d.slice(7, 1).toUpperCase() + d.slice(8)), n[t] && (e?.off(d + S), e?.on(d + S, n[t]));
    }
    !s && (n[t] !== c[t] || a && n[t] !== e?.getAttr(t)) && (r = !0, l[t] = n[t]);
  }
  r && e && (e.setAttrs(l), y(e));
}
const P = ".vue-konva-vmodel", b = "onUpdate:";
function _(o, n) {
  o.off(P);
  const c = n.vnode.props || {};
  for (const a in c)
    if (a.startsWith(b)) {
      const e = a.slice(b.length), l = c[a];
      o.on(`${e}Change${P}`, () => {
        l(o.getAttr(e));
      });
    }
}
const F = "V";
function G(o) {
  function n(c) {
    return c?.__konvaNode ? c : c?.parent ? n(c.parent) : (console.error("vue-konva error: Can not find parent node"), null);
  }
  return n(o.parent);
}
function R(o) {
  return o.component ? o.component.__konvaNode || R(o.component.subTree) : null;
}
function W(o) {
  const { el: n, component: c } = o, a = R(o);
  if (n?.tagName && c && !a) {
    const e = n.tagName.toLowerCase();
    return console.error(
      `vue-konva error: You are trying to render "${e}" inside your component tree. Looks like it is not a Konva node. You can render only Konva components inside the Stage.`
    ), null;
  }
  return a;
}
function B(o) {
  const n = (e) => !!e && typeof e == "object" && "component" in e, c = (e) => Array.isArray(e), a = (e) => n(e) ? [e, ...a(e.children)] : c(e) ? e.flatMap(a) : [];
  return a(o.children);
}
function I(o, n) {
  const c = B(o), a = [];
  c.forEach((l) => {
    const r = W(l);
    r && a.push(r);
  });
  let e = !1;
  a.forEach((l, r) => {
    l.getZIndex() !== r && (l.setZIndex(r), e = !0);
  }), e && y(n);
}
const D = p.default?.Stage || p.Stage, Y = C({
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
  setup(o, { attrs: n, slots: c, expose: a }) {
    const e = L();
    if (!e) return;
    const l = w({}), r = k(null), t = new D({
      width: o.config.width,
      height: o.config.height,
      container: document.createElement("div")
      // Fake container. Will be replaced
    });
    e.__konvaNode = t, d();
    function s() {
      return e?.__konvaNode;
    }
    function f() {
      return e?.__konvaNode;
    }
    function d() {
      if (!e) return;
      const g = l || {}, m = {
        ...n,
        ...o.config
      };
      M(e, m, g, o.__useStrictMode), Object.assign(l, m);
    }
    return O(() => {
      r.value && t.container(r.value), d(), _(t, e);
    }), x(() => {
      d(), I(e.subTree, t), _(t, e);
    }), j(() => {
      t.destroy();
    }), A(() => o.config, d, { deep: !0 }), a({
      getStage: f,
      getNode: s
    }), () => U(
      "div",
      {
        ref: r,
        id: n?.id,
        accesskey: n?.accesskey,
        class: n?.class,
        role: n?.role,
        style: n?.style,
        tabindex: n?.tabindex,
        title: n?.title
      },
      c.default?.()
    );
  }
}), Z = ".vue-konva-event", z = {
  Group: !0,
  Layer: !0,
  FastLayer: !0,
  Label: !0
};
function i(o, n) {
  return C({
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
    setup(c, { attrs: a, slots: e, expose: l }) {
      const r = L();
      if (!r) return;
      const t = w({}), s = new n();
      r.__konvaNode = s, r.vnode.__konvaNode = s, g();
      function f() {
        return r?.__konvaNode;
      }
      function d() {
        return r?.__konvaNode;
      }
      function g() {
        if (!r) return;
        const v = {};
        for (const h in r?.vnode.props)
          h.slice(0, 2) === "on" && (v[h] = r.vnode.props[h]);
        const K = t || {}, E = {
          ...a,
          ...c.config,
          ...v
        };
        M(r, E, K, c.__useStrictMode), Object.assign(t, E);
      }
      O(() => {
        const v = G(r)?.__konvaNode;
        v && "add" in v && v.add(s), y(s), _(s, r);
      }), V(() => {
        y(s), s.destroy(), s.off(Z), s.off(P);
      }), x(() => {
        g(), I(r.subTree, s), _(s, r);
      }), A(() => c.config, g, { deep: !0 }), l({
        getStage: d,
        getNode: f
      });
      const m = z.hasOwnProperty(o);
      return () => m ? e.default?.() : null;
    }
  });
}
function Ne(o, n, c) {
  const a = k(null), e = k("loading"), l = (t, s, f) => {
    e.value = "loading";
    const d = new Image();
    s && (d.crossOrigin = s), f && (d.referrerPolicy = f), d.onload = () => {
      a.value = d, e.value = "loaded";
    }, d.onerror = () => {
      a.value = null, e.value = "error";
    }, d.src = t;
  }, r = $(() => ({
    url: N(o),
    crossorigin: N(n),
    referrerPolicy: N(c)
  }));
  return A(
    r,
    ({ url: t, crossorigin: s, referrerPolicy: f }) => {
      t && l(t, s, f);
    },
    { immediate: !0 }
  ), [a, e];
}
const u = p.default || p, X = i("Arc", u.Arc), q = i("Arrow", u.Arrow), H = i("Circle", u.Circle), J = i("Ellipse", u.Ellipse), Q = i("FastLayer", u.FastLayer), ee = i("Group", u.Group), ne = i("Image", u.Image), te = i("Label", u.Label), oe = i("Layer", u.Layer), re = i("Line", u.Line), ce = i("Path", u.Path), ae = i("Rect", u.Rect), se = i("RegularPolygon", u.RegularPolygon), ie = i("Ring", u.Ring), ue = i("Shape", u.Shape), le = i("Sprite", u.Sprite), de = i("Star", u.Star), fe = i("Tag", u.Tag), ge = i("Text", u.Text), ve = i("TextPath", u.TextPath), pe = i("Transformer", u.Transformer), me = i("Wedge", u.Wedge), ye = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Arc: X,
  Arrow: q,
  Circle: H,
  Ellipse: J,
  FastLayer: Q,
  Group: ee,
  Image: ne,
  Label: te,
  Layer: oe,
  Line: re,
  Path: ce,
  Rect: ae,
  RegularPolygon: se,
  Ring: ie,
  Shape: ue,
  Sprite: le,
  Star: de,
  Tag: fe,
  Text: ge,
  TextPath: ve,
  Transformer: pe,
  Wedge: me
}, Symbol.toStringTag, { value: "Module" })), Se = {
  install: (o, n) => {
    const c = n?.prefix || F, a = n?.customNodes ? Object.entries(n.customNodes).map(
      ([l, r]) => i(l, r)
    ) : [];
    [
      Y,
      ...Object.values(ye),
      ...a
    ].forEach((l) => {
      o.component(`${c}${l.name}`, l);
    });
  }
};
export {
  X as Arc,
  q as Arrow,
  H as Circle,
  J as Ellipse,
  Q as FastLayer,
  ee as Group,
  ne as Image,
  te as Label,
  oe as Layer,
  re as Line,
  ce as Path,
  ae as Rect,
  se as RegularPolygon,
  ie as Ring,
  ue as Shape,
  le as Sprite,
  Y as Stage,
  de as Star,
  fe as Tag,
  ge as Text,
  ve as TextPath,
  pe as Transformer,
  me as Wedge,
  Se as default,
  Ne as useImage
};
