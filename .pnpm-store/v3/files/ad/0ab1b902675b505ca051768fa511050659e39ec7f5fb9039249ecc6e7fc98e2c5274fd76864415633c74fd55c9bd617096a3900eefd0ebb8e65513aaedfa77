var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import { watch, unref, getCurrentScope, onScopeDispose } from "vue";
const defaultWindow = typeof window !== "undefined" ? window : void 0;
function unrefElement(elRef) {
  var _a;
  const plain = unref(elRef);
  return (_a = plain == null ? void 0 : plain.$el) != null ? _a : plain;
}
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function useMutationObserver(target, callback, options = {}) {
  const _a = options, { window: window2 = defaultWindow } = _a, mutationOptions = __objRest(_a, ["window"]);
  const isSupported = window2 && "MutationObserver" in window2;
  let observer;
  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = void 0;
    }
  };
  const stopWatch = watch(() => unrefElement(target), (el) => {
    cleanup();
    if (isSupported && window2 && el) {
      observer = new MutationObserver(callback);
      observer.observe(el, mutationOptions);
    }
  }, { immediate: true });
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
export { defaultWindow, tryOnScopeDispose, unrefElement, useMutationObserver };
