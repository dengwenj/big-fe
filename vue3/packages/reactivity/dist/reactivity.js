// packages/shared/src/index.ts
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function reactive(target) {
  return createReactiveObject(target);
}
var proxyHandler = {
  get(target, key, receiver) {
    if (key === "__pumu_isReactive" /* IS_REACTIVE */) {
      return true;
    }
  },
  set(target, key, newValue, receiver) {
    return true;
  }
};
function createReactiveObject(target) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__pumu_isReactive" /* IS_REACTIVE */]) {
    return target;
  }
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) {
    return exitsProxy;
  }
  const proxy = new Proxy(target, proxyHandler);
  reactiveMap.set(target, proxy);
  return proxy;
}

// packages/reactivity/src/effect.ts
function effect() {
}
export {
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map
