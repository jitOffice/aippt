import { defineComponent, ref, watch, onMounted, onUnmounted, h } from 'vue';

const prevW = Symbol("prevW");
const prevH = Symbol("prevH");
const FlowLayout = /* @__PURE__ */ defineComponent({
  name: "FlowLayout",
  props: {
    cols: {
      type: Number,
      default: 2
    },
    gap: {
      type: [Number, Array],
      default: 4
    },
    duration: {
      type: [Boolean, Number],
      default: true
    }
  },
  setup(props, { slots }) {
    let sizeObs;
    let childrenObs;
    const layout = ref(null);
    const layouting = ref(false);
    const reLayout = () => {
      if (layouting.value || !layout.value)
        return;
      layouting.value = true;
      requestAnimationFrame(() => {
        try {
          const parent = layout.value;
          const children = Array.from(parent.children);
          const len = children.length;
          const [gapX, gapY] = Array.isArray(props.gap) ? props.gap : [props.gap, props.gap];
          const colWidth = (parent.offsetWidth - (props.cols - 1) * gapX) / props.cols;
          for (const el of children) {
            el.style.width = `${colWidth}px`;
          }
          const hs = Array.from({ length: len }, (_, index) => {
            const el = children[index];
            el[prevW] = el.offsetWidth;
            el[prevH] = el.offsetHeight;
            return el.offsetHeight;
          });
          const columnHs = Array.from({ length: props.cols }, () => 0);
          for (let i = 0; i < children.length; i++) {
            const el = children[i];
            const minColHeight = Math.min(...columnHs);
            const colIndex = columnHs.indexOf(minColHeight);
            const left = colIndex * (colWidth + gapX);
            const top = minColHeight;
            el.style.left = `${left}px`;
            el.style.top = `${top}px`;
            columnHs[colIndex] += hs[i] + gapY;
          }
          parent.style.height = `${Math.max(...columnHs) - gapY}px`;
        } finally {
          if (layout.value) {
            layout.value[prevW] = layout.value.offsetWidth;
            layout.value[prevH] = layout.value.offsetHeight;
          }
          layouting.value = false;
        }
      });
    };
    const sizeListener = () => {
      if (!layout.value)
        return;
      const parent = layout.value;
      sizeObs = new ResizeObserver((els) => {
        for (const { target: el } of els) {
          if (el.offsetWidth !== el[prevW] || el.offsetHeight !== el[prevH]) {
            reLayout();
          }
        }
      });
      sizeObs.observe(parent);
      for (const el of parent.children) {
        sizeObs.observe(el);
      }
    };
    const childrenListener = () => {
      if (!layout.value)
        return;
      const parent = layout.value;
      childrenObs = new MutationObserver((ml) => {
        for (const m of ml) {
          for (const el of m.addedNodes) {
            if (el.nodeType === 1)
              sizeObs.observe(el);
          }
          for (const el of m.removedNodes) {
            if (el.nodeType === 1)
              sizeObs.unobserve(el);
          }
        }
        reLayout();
      });
      childrenObs.observe(parent, { childList: true, subtree: true });
    };
    watch(() => [props.cols, props.gap], reLayout);
    onMounted(() => {
      reLayout();
      sizeListener();
      childrenListener();
    });
    onUnmounted(() => {
      sizeObs.disconnect();
      childrenObs.disconnect();
    });
    return () => {
      const parentStyle = {
        position: "relative",
        display: "block",
        boxSizing: "border-box",
        overflow: "unset !important"
      };
      const childStyle = {
        position: "absolute",
        boxSizing: "border-box",
        ...props.duration ? {
          duration: `all ${typeof props.duration === "number" ? `${props.duration}ms` : "350ms"}`
        } : {}
      };
      const children = slots.default?.();
      function setStyle(vnode, style, depath = 1) {
        if (Array.isArray(vnode.children) && depath > 0) {
          vnode.children.forEach((vvnode) => {
            setStyle(vvnode, style, depath - 1);
          });
        } else {
          const props2 = vnode.props = vnode.props || {};
          props2.style = {
            ...props2.style,
            ...childStyle
          };
        }
      }
      children?.forEach((child) => {
        setStyle(child, childStyle);
      });
      return h(
        "div",
        {
          id: "vue-flow-layout",
          ref: layout,
          style: parentStyle
        },
        children
      );
    };
  }
});

const index = {
  install: (app) => {
    app.component("FlowLayout", FlowLayout);
  }
};

export { FlowLayout, index as default };
