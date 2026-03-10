import { defineComponent, h } from "vue";
import { Icon } from "@iconify/vue";
import { convertToKebabCase } from "@/utils/slide/index.js";
import icons from "@/utils/icon";

export default defineComponent({
  name: "IIcon",
  props: {
    name: {
      type: String,
      required: true,
    },
    size: {
      type: [String, Number],
      default: "1em",
    },
    color: {
      type: String,
      default: "currentColor",
    },
  },

  setup(props, { attrs }) {
    return () => {
      const name = convertToKebabCase(props.name);
      const local = icons[name] || icons[props.name];
      if (local && local.body) {
        const size = typeof props.size === "number" ? `${props.size}` : props.size;
        const svg = local.body
          .replace(/width=\"[^\"]+\"/, `width=\"${size}\"`)
          .replace(/height=\"[^\"]+\"/, `height=\"${size}\"`);
        return h("span", {
          innerHTML: svg,
          ...attrs,
          style: {
            verticalAlign: "middle",
            display: "inline-block",
            color: props.color,
            width: typeof props.size === "number" ? `${props.size}px` : props.size,
            height: typeof props.size === "number" ? `${props.size}px` : props.size,
            ...(attrs.style || {}),
          },
        });
      }
      return h(Icon, {
        icon: `px-editor:${name}`,
        width: props.size,
        height: props.size,
        color: props.color,
        ...attrs,
        style: {
          verticalAlign: "middle",
          display: "inline-block",
          ...(attrs.style || {}),
        },
      });
    };
  },
});
