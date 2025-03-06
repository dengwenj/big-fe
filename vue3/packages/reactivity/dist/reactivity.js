// packages/shared/src/index.ts
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}

// packages/reactivity/src/effect.ts
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
}
var activeEffect = [];
var ReactiveEffect = class {
  constructor(fn, schedulder) {
    this.fn = fn;
    this.schedulder = schedulder;
  }
  // 执行 fn 函数，这个 fn 函数就是 effect 中的回调函数
  run() {
    try {
      activeEffect.push(this);
      return this.fn();
    } finally {
      activeEffect.pop();
    }
  }
};

// packages/reactivity/src/baseHandler.ts
var mutableHandler = {
  // receiver 代理对象
  get(target, key, receiver) {
    if (key === "__pumu_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    const _effect = activeEffect[activeEffect.length - 1];
    if (_effect) {
    }
    return Reflect.get(target, key, receiver);
  },
  set(target, key, newValue, receiver) {
    return Reflect.set(target, key, newValue, receiver);
  }
};

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function reactive(target) {
  return createReactiveObject(target);
}
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
  const proxy = new Proxy(target, mutableHandler);
  reactiveMap.set(target, proxy);
  return proxy;
}
export {
  activeEffect,
  effect,
  reactive
};
//# sourceMappingURL=reactivity.js.map
