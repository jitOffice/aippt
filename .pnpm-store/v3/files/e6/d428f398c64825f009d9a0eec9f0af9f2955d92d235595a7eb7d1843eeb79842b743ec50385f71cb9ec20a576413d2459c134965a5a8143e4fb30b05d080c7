import { defineComponent, toRefs, ref, computed, watch, nextTick, onMounted, createVNode } from "vue";
import { getTabListStyle, updateScrollOffset } from "./utils.js";
import { getPrefixCls } from "../_utils/global-config.js";
import TabsTab from "./tabs-tab.js";
import TabsButton from "./tabs-button.js";
import TabsNavInk from "./tabs-nav-ink.js";
import IconHover from "../_components/icon-hover.js";
import IconPlus from "../icon/icon-plus/index.js";
import ResizeObserver from "../_components/resize-observer.js";
import { isUndefined, isNumber } from "../_utils/is.js";
var TabsNav = defineComponent({
  name: "TabsNav",
  props: {
    tabs: {
      type: Array,
      required: true
    },
    direction: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    activeKey: {
      type: [String, Number]
    },
    activeIndex: {
      type: Number,
      required: true
    },
    position: {
      type: String,
      required: true
    },
    size: {
      type: String,
      required: true
    },
    showAddButton: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    animation: {
      type: Boolean,
      required: true
    },
    headerPadding: {
      type: Boolean,
      default: true
    },
    scrollPosition: {
      type: String,
      default: "auto"
    }
  },
  emits: ["click", "add", "delete"],
  setup(props, {
    emit,
    slots
  }) {
    const {
      tabs,
      activeKey,
      activeIndex,
      direction,
      scrollPosition
    } = toRefs(props);
    const prefixCls = getPrefixCls("tabs-nav");
    const wrapperRef = ref();
    const listRef = ref();
    const tabsRef = ref({});
    const activeTabRef = computed(() => {
      if (!isUndefined(activeKey.value)) {
        return tabsRef.value[activeKey.value];
      }
      return void 0;
    });
    const inkRef = ref();
    const mergedEditable = computed(() => props.editable && ["line", "card", "card-gutter"].includes(props.type));
    const isScroll = ref(false);
    const wrapperLength = ref(0);
    const maxOffset = ref(0);
    const offset = ref(0);
    const getWrapperLength = () => {
      var _a, _b, _c;
      return (_c = direction.value === "vertical" ? (_a = wrapperRef.value) == null ? void 0 : _a.offsetHeight : (_b = wrapperRef.value) == null ? void 0 : _b.offsetWidth) != null ? _c : 0;
    };
    const getMaxOffset = () => {
      if (!listRef.value || !wrapperRef.value) {
        return 0;
      }
      if (direction.value === "vertical") {
        return listRef.value.offsetHeight - wrapperRef.value.offsetHeight;
      }
      return listRef.value.offsetWidth - wrapperRef.value.offsetWidth;
    };
    const getSize = () => {
      isScroll.value = isOverflow();
      if (isScroll.value) {
        wrapperLength.value = getWrapperLength();
        maxOffset.value = getMaxOffset();
        if (offset.value > maxOffset.value) {
          offset.value = maxOffset.value;
        }
      } else {
        offset.value = 0;
      }
    };
    const isOverflow = () => {
      if (wrapperRef.value && listRef.value) {
        return props.direction === "vertical" ? listRef.value.offsetHeight > wrapperRef.value.offsetHeight : listRef.value.offsetWidth > wrapperRef.value.offsetWidth;
      }
      return false;
    };
    const setOffset = (newOffset) => {
      if (!wrapperRef.value || !listRef.value || newOffset < 0) {
        newOffset = 0;
      }
      offset.value = Math.min(newOffset, maxOffset.value);
    };
    const setActiveTabOffset = () => {
      if (!activeTabRef.value || !wrapperRef.value || !isScroll.value)
        return;
      updateScrollOffset(wrapperRef.value, direction.value);
      const isHorizontal = direction.value === "horizontal";
      const offsetProperty = isHorizontal ? "offsetLeft" : "offsetTop";
      const sizeProperty = isHorizontal ? "offsetWidth" : "offsetHeight";
      const tabOffset = activeTabRef.value[offsetProperty];
      const tabSize = activeTabRef.value[sizeProperty];
      const wrapperSize = wrapperRef.value[sizeProperty];
      const tabStyle = window.getComputedStyle(activeTabRef.value);
      const marginProperty = isHorizontal ? scrollPosition.value === "end" ? "marginRight" : "marginLeft" : scrollPosition.value === "end" ? "marginBottom" : "marginTop";
      const tabMargin = parseFloat(tabStyle[marginProperty]) || 0;
      if (scrollPosition.value === "auto") {
        if (tabOffset < offset.value) {
          setOffset(tabOffset - tabMargin);
        } else if (tabOffset + tabSize > offset.value + wrapperSize) {
          setOffset(tabOffset + tabSize - wrapperSize + tabMargin);
        }
      } else if (scrollPosition.value === "center") {
        setOffset(tabOffset + (tabSize - wrapperSize + tabMargin) / 2);
      } else if (scrollPosition.value === "start") {
        setOffset(tabOffset - tabMargin);
      } else if (scrollPosition.value === "end") {
        setOffset(tabOffset + tabSize - wrapperSize + tabMargin);
      } else if (isNumber(scrollPosition.value)) {
        setOffset(tabOffset - scrollPosition.value);
      }
    };
    const handleWheel = (ev) => {
      if (!isScroll.value)
        return;
      ev.preventDefault();
      const {
        deltaX,
        deltaY
      } = ev;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        setOffset(offset.value + deltaX);
      } else {
        setOffset(offset.value + deltaY);
      }
    };
    const handleClick = (key, ev) => {
      emit("click", key, ev);
    };
    const handleDelete = (key, ev) => {
      emit("delete", key, ev);
    };
    const handleButtonClick = (type) => {
      const nextOffset = type === "previous" ? offset.value - wrapperLength.value : offset.value + wrapperLength.value;
      setOffset(nextOffset);
    };
    const handleResize = () => {
      getSize();
      if (inkRef.value) {
        inkRef.value.$forceUpdate();
      }
    };
    watch(tabs, () => {
      nextTick(() => {
        getSize();
      });
    });
    watch([activeIndex, scrollPosition], () => {
      setTimeout(() => {
        setActiveTabOffset();
      }, 0);
    });
    onMounted(() => {
      getSize();
    });
    const renderAddBtn = () => {
      if (!mergedEditable.value || !props.showAddButton) {
        return null;
      }
      return createVNode("div", {
        "class": `${prefixCls}-add-btn`,
        "onClick": (ev) => emit("add", ev)
      }, [createVNode(IconHover, null, {
        default: () => [createVNode(IconPlus, null, null)]
      })]);
    };
    const cls = computed(() => [prefixCls, `${prefixCls}-${props.direction}`, `${prefixCls}-${props.position}`, `${prefixCls}-size-${props.size}`, `${prefixCls}-type-${props.type}`]);
    const listCls = computed(() => [`${prefixCls}-tab-list`, {
      [`${prefixCls}-tab-list-no-padding`]: !props.headerPadding && ["line", "text"].includes(props.type) && props.direction === "horizontal"
    }]);
    const listStyle = computed(() => getTabListStyle({
      direction: props.direction,
      type: props.type,
      offset: offset.value
    }));
    const tabCls = computed(() => [`${prefixCls}-tab`, {
      [`${prefixCls}-tab-scroll`]: isScroll.value
    }]);
    return () => {
      var _a;
      return createVNode("div", {
        "class": cls.value
      }, [isScroll.value && createVNode(TabsButton, {
        "type": "previous",
        "direction": props.direction,
        "disabled": offset.value <= 0,
        "onClick": handleButtonClick
      }, null), createVNode(ResizeObserver, {
        "onResize": () => getSize()
      }, {
        default: () => [createVNode("div", {
          "class": tabCls.value,
          "ref": wrapperRef,
          "onWheel": handleWheel
        }, [createVNode(ResizeObserver, {
          "onResize": handleResize
        }, {
          default: () => [createVNode("div", {
            "ref": listRef,
            "class": listCls.value,
            "style": listStyle.value
          }, [props.tabs.map((tab, index) => createVNode(TabsTab, {
            "key": tab.key,
            "ref": (component) => {
              if (component == null ? void 0 : component.$el) {
                tabsRef.value[tab.key] = component.$el;
              }
            },
            "active": tab.key === activeKey.value,
            "tab": tab,
            "editable": props.editable,
            "onClick": handleClick,
            "onDelete": handleDelete
          }, {
            default: () => {
              var _a2, _b, _c;
              return [(_c = (_b = (_a2 = tab.slots).title) == null ? void 0 : _b.call(_a2)) != null ? _c : tab.title];
            }
          })), props.type === "line" && activeTabRef.value && createVNode(TabsNavInk, {
            "ref": inkRef,
            "activeTabRef": activeTabRef.value,
            "direction": props.direction,
            "disabled": false,
            "animation": props.animation
          }, null)])]
        }), !isScroll.value && renderAddBtn()])]
      }), isScroll.value && createVNode(TabsButton, {
        "type": "next",
        "direction": props.direction,
        "disabled": offset.value >= maxOffset.value,
        "onClick": handleButtonClick
      }, null), createVNode("div", {
        "class": `${prefixCls}-extra`
      }, [isScroll.value && renderAddBtn(), (_a = slots.extra) == null ? void 0 : _a.call(slots)])]);
    };
  }
});
export { TabsNav as default };
