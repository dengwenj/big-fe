// packages/runtime-dom/src/nodeOps.ts
var nodeOps = {
  // 如果 anchor 为空，就相当于 appendChild
  insert: (el, parent, anchor) => parent.insertBefore(el, anchor || null),
  remove(el) {
    const parent = el.parentNode;
    parent && parent.removeChild(el);
  },
  createElement: (type) => document.createElement(type),
  createText: (text) => document.createTextNode(text),
  setText: (node, text) => node.nodeValue = text,
  setElementText: (el, text) => el.textContent = text,
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling
};

// packages/runtime-dom/src/modules/patchAttr.ts
function patchAttr(el, key, value) {
  if (!value) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, value);
  }
}

// packages/runtime-dom/src/modules/patchClass.ts
function patchClass(el, value) {
  if (!value) {
    el.removeAttribute("class");
  } else {
    el.className = value;
  }
}

// packages/runtime-dom/src/modules/patchEvent.ts
function createInovker(eventCb) {
  const inovker = (e) => {
    inovker.value(e);
  };
  inovker.value = eventCb;
  return inovker;
}
function patchEvent(el, key, value) {
  const inovkers = el.vei || (el.vei = {});
  const exisitInvoker = inovkers[key];
  if (exisitInvoker && value) {
    exisitInvoker.value = value;
    return;
  }
  const eventName = key.slice(2).toLowerCase();
  if (value) {
    const inovker = createInovker(value);
    inovkers[key] = inovker;
    el.addEventListener(eventName, inovker);
    return;
  }
  if (exisitInvoker) {
    el.removeEventListener(eventName, exisitInvoker);
    inovkers[key] = void 0;
  }
}

// packages/runtime-dom/src/modules/patchStyle.ts
function patchStyle(el, preVal, value) {
  const style = el.style;
  for (const key in value) {
    style[key] = value[key];
  }
  if (preVal) {
    for (const key in preVal) {
      if (value[key] === null) {
        style[key] = null;
      }
    }
  }
}

// packages/runtime-dom/src/patchProp.ts
function patchProp(el, key, preVal, value) {
  console.log(el, key, preVal, value);
  if (key === "class") {
    return patchClass(el, value);
  } else if (key === "style") {
    return patchStyle(el, preVal, value);
  } else if (/^on[^a-z]/.test(key)) {
    return patchEvent(el, key, value);
  } else {
    return patchAttr(el, key, value);
  }
}

// packages/shared/src/index.ts
function isObject(obj) {
  return typeof obj === "object" && obj !== null;
}
function isFunction(obj) {
  return typeof obj === "function";
}

// packages/reactivity/src/effect.ts
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
  _effect.run();
  if (options) {
    Object.assign(_effect, options);
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
var activeEffect = [];
var ReactiveEffect = class {
  constructor(fn, schedulder) {
    this.fn = fn;
    this.schedulder = schedulder;
    // 创建的 effect 是响应式的
    this.active = true;
    this.isRunning = false;
    // computed 有用
    this._dirtyLevel = 4 /* Dirty */;
    // 记录之前的
    this.cleanPreEffect = /* @__PURE__ */ new Map();
  }
  get dirty() {
    return this._dirtyLevel === 4 /* Dirty */;
  }
  set dirty(val) {
    this._dirtyLevel = val ? 4 /* Dirty */ : 0 /* NoDirty */;
  }
  // 执行 fn 函数，这个 fn 函数就是 effect 中的回调函数
  run() {
    this._dirtyLevel = 0 /* NoDirty */;
    if (!this.active) {
      return this.fn();
    }
    try {
      activeEffect.push(this);
      this.clearEffect();
      this.isRunning = true;
      return this.fn();
    } finally {
      activeEffect.pop();
      this.isRunning = false;
    }
  }
  getCleanPreEffect() {
    return this.cleanPreEffect;
  }
  setCleanPreEffect(effect2, target, keyAndIndex) {
    if (this.cleanPreEffect.has(effect2)) {
      const targetData = this.cleanPreEffect.get(effect2);
      if (targetData.has(target)) {
        const preKeyAndIndex = targetData.get(target);
        targetData.set(target, {
          ...preKeyAndIndex,
          ...keyAndIndex
        });
      } else {
        targetData.set(target, keyAndIndex);
      }
    } else {
      const targetData = /* @__PURE__ */ new Map();
      targetData.set(target, keyAndIndex);
      this.cleanPreEffect.set(effect2, targetData);
    }
  }
  /**
   * vue 里面做的是拿老的依赖和新的依赖比对，没用的清除
   * 我这里做的是直接把之前的依赖清除，没有比对
   */
  clearEffect() {
    const targetToKeyAndIndex = this.cleanPreEffect.get(this);
    if (!targetToKeyAndIndex) {
      return;
    }
    targetToKeyAndIndex.forEach((val, target) => {
      const effectsObj = targetMap.get(target);
      const keys = Object.keys(val);
      for (const key of keys) {
        const effects = effectsObj[key];
        const idx = val[key];
        effects.splice(idx, 1, null);
      }
    });
  }
  stop() {
    if (this.active) {
      this.active = false;
      this.clearEffect();
    }
  }
};
function targetEffects(effects) {
  for (const effect2 of effects) {
    if (effect2) {
      if (effect2._dirtyLevel === 0 /* NoDirty */) {
        effect2._dirtyLevel = 4 /* Dirty */;
      }
      if (!effect2.isRunning) {
        effect2.schedulder();
      }
    }
  }
}

// packages/reactivity/src/reactiveEffect.ts
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  const _effect = activeEffect[activeEffect.length - 1];
  if (_effect) {
    let idx = -1;
    if (targetMap.has(target)) {
      const data = targetMap.get(target);
      if (data[key]) {
        data[key].push(_effect);
        idx = data[key].length - 1;
      } else {
        data[key] = [_effect];
        idx = 0;
      }
    } else {
      targetMap.set(target, {
        [key]: [_effect]
      });
      idx = 0;
    }
    _effect.setCleanPreEffect(_effect, target, { [key]: idx });
  }
}
console.log(targetMap);
function trigger(target, key, newValue, oldValue) {
  if (!targetMap.has(target)) {
    return;
  }
  const data = targetMap.get(target);
  if (data[key]) {
    targetEffects([...data[key]]);
  }
}

// packages/reactivity/src/baseHandler.ts
var person = {
  name: "\u6734\u7766",
  get cName() {
    return this.name + "25";
  }
};
var p = new Proxy(person, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  },
  set(target, key, val, receiver) {
    return Reflect.set(target, key, val, receiver);
  }
});
var mutableHandler = {
  // receiver 代理对象
  get(target, key, receiver) {
    if (key === "__pumu_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    track(target, key);
    const res = Reflect.get(target, key, receiver);
    if (isObject(res)) {
      return reactive(res);
    }
    return res;
  },
  set(target, key, newValue, receiver) {
    const oldValue = target[key];
    const res = Reflect.set(target, key, newValue, receiver);
    if (oldValue !== newValue) {
      trigger(target, key, newValue, oldValue);
    }
    return res;
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
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}
function isReactive(value) {
  return value && value["__pumu_isReactive" /* IS_REACTIVE */];
}

// packages/reactivity/src/ref.ts
function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
var RefImpl = class _RefImpl {
  // 用来保存 ref 的值
  constructor(rawValue) {
    this.rawValue = rawValue;
    this.__v_isRef = true;
    this._value = toReactive(rawValue);
  }
  static {
    this.VALUE = "value";
  }
  // get 时依赖收集
  get value() {
    trackRef(this, _RefImpl.VALUE);
    return this._value;
  }
  // set 时派发更新
  set value(newValue) {
    if (newValue !== this.rawValue) {
      this.rawValue = newValue;
      this._value = newValue;
      triggerRef(this, _RefImpl.VALUE, newValue, this.rawValue);
    }
  }
};
function trackRef(target, key) {
  track(target, key);
}
function triggerRef(target, key, newValue, oldValue) {
  trigger(target, key, newValue, oldValue);
}
function toRef(target, key) {
  return new ObjectRefImpl(target, key);
}
function toRefs(target) {
  const res = {};
  for (const key in target) {
    res[key] = toRef(target, key);
  }
  return res;
}
var ObjectRefImpl = class {
  constructor(_target, _key) {
    this._target = _target;
    this._key = _key;
    // ref 的标识
    this.__v_isRef = true;
  }
  get value() {
    return this._target[this._key];
  }
  set value(newValue) {
    this._target[this._key] = newValue;
  }
};
function proxyRefs(objectWithRefs) {
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver);
      return res.__v_isRef ? res.value : res;
    },
    set(target, key, newValue, receiver) {
      const oldValue = target[key];
      if (oldValue.__v_isRef) {
        oldValue.value = newValue;
        return true;
      }
      return Reflect.set(target, key, newValue, receiver);
    }
  });
}
function isRef(value) {
  return !!(value && value.__v_isRef);
}

// packages/reactivity/src/computed.ts
function computed(getterOrOptions) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  return new ComputedRefImpl(getter, setter);
}
var ComputedRefImpl = class _ComputedRefImpl {
  constructor(getter, setter) {
    this.getter = getter;
    this.setter = setter;
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      // 第二个参数是个调度器
      () => {
        console.log(`
          computed \u91CC\u9762\u4F9D\u8D56\u7684\u5C5E\u6027\u53D1\u751F\u4E86\u53D8\u5316\u6267\u884C\u8FD9\u91CC\uFF0C
          \u539F\u5148\u8FD9\u91CC\u4F1A\u8C03\u7528 this.effect.run\uFF0C\u73B0\u5728\u4E0D\u76F4\u63A5\u8C03\u7528
        `);
        triggerComputedRef(this, _ComputedRefImpl.VALUE, null, null);
      }
    );
  }
  static {
    this.VALUE = "value";
  }
  get value() {
    if (this.effect.dirty) {
      this._value = this.effect.run();
    }
    trackComputedRef(this, _ComputedRefImpl.VALUE);
    return this._value;
  }
  set value(val) {
    this.setter(val);
  }
};
function trackComputedRef(target, key) {
  track(target, key);
}
function triggerComputedRef(target, key, newValue, oldValue) {
  trigger(target, key, newValue, oldValue);
}

// packages/reactivity/src/apiWatch.ts
function watch(source, cb, options = {}) {
  return doWatch(source, cb, options);
}
function watchEffect(source, options = {}) {
  return doWatch(source, null, options);
}
function doWatch(source, cb, options) {
  let flag = false;
  if (
    // Object.prototype.toString.call(source) === '[object Proxy]' 
    isReactive(source) || isRef(source) || isFunction(source)
  ) {
    flag = true;
  }
  if (!flag) {
    console.warn(`source \u5FC5\u987B\u662F reactive ref getter(effect)`);
    return;
  }
  let getter = source;
  if (isObject(source)) {
    getter = () => forEachProperty(source, options.deep);
  }
  let oldValue;
  let clean = null;
  const onCleanup = (fn) => {
    clean = () => {
      fn();
      clean = null;
    };
  };
  const job = () => {
    const newValue = effect2.run();
    if (isFunction(cb)) {
      if (clean) {
        clean();
      }
      cb(newValue, oldValue, onCleanup);
      oldValue = newValue;
    }
  };
  const effect2 = new ReactiveEffect(getter, job);
  if (isFunction(cb)) {
    if (options.immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else {
    effect2.run();
  }
  const unwatch = () => {
    effect2.stop();
  };
  return unwatch;
}
function forEachProperty(source, deep) {
  if (isRef(source)) {
    return source.value;
  }
  for (const key in source) {
    if (isObject(source[key]) && deep) {
      forEachProperty(source[key], deep);
    }
  }
  return source;
}

// packages/runtime-dom/src/index.ts
var renderOptions = {
  ...nodeOps,
  patchProp
};
function createRenderer(renderOptions2) {
  return {};
}
createRenderer(renderOptions);
export {
  ReactiveEffect,
  activeEffect,
  computed,
  effect,
  isReactive,
  isRef,
  proxyRefs,
  reactive,
  ref,
  renderOptions,
  targetEffects,
  toReactive,
  toRef,
  toRefs,
  trackComputedRef,
  triggerComputedRef,
  watch,
  watchEffect
};
//# sourceMappingURL=runtime-dom.js.map
