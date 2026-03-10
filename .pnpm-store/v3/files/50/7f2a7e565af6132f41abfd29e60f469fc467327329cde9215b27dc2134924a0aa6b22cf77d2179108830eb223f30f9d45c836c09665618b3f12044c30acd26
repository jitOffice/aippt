var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
import { defineComponent, toRefs, createVNode } from "vue";
import { getPrefixCls } from "../_utils/global-config.js";
import { rgbToHsv } from "../_utils/color.js";
import "../input/index.js";
import InputNumber from "../input-number/index.js";
import InputAlpha from "./input-alpha.js";
import InputGroup from "../input/input-group.js";
var InputRgb = defineComponent({
  name: "InputRgb",
  props: {
    color: {
      type: Object,
      required: true
    },
    alpha: {
      type: Number,
      required: true
    },
    disabled: Boolean,
    disabledAlpha: Boolean,
    onHsvChange: Function,
    onAlphaChange: Function
  },
  setup(props) {
    const prefixCls = getPrefixCls("color-picker");
    const {
      color
    } = toRefs(props);
    const handleChange = (value) => {
      var _a;
      const newRGB = __spreadValues(__spreadValues({}, color.value.rgb), value);
      const hsv = rgbToHsv(newRGB.r, newRGB.g, newRGB.b);
      (_a = props.onHsvChange) == null ? void 0 : _a.call(props, hsv);
    };
    return () => createVNode(InputGroup, {
      "class": `${prefixCls}-input-group`
    }, {
      default: () => [["r", "g", "b"].map((channel) => createVNode(InputNumber, {
        "key": channel,
        "size": "mini",
        "min": 0,
        "max": 255,
        "disabled": props.disabled,
        "modelValue": color.value.rgb[channel],
        "hideButton": true,
        "onChange": (val = 0) => handleChange({
          [channel]: val
        })
      }, null)), !props.disabledAlpha && createVNode(InputAlpha, {
        "disabled": props.disabled,
        "value": props.alpha,
        "onChange": props.onAlphaChange
      }, null)]
    });
  }
});
export { InputRgb as default };
