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
    // 记录之前的
    this.cleanPreEffect = /* @__PURE__ */ new Map();
  }
  // 执行 fn 函数，这个 fn 函数就是 effect 中的回调函数
  run() {
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
};
function targetEffects(effects) {
  for (const effect2 of effects) {
    if (effect2) {
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
  get value() {
    trackRef(this, _RefImpl.VALUE);
    return this._value;
  }
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
export {
  activeEffect,
  effect,
  reactive,
  ref,
  targetEffects,
  toReactive
};
//# sourceMappingURL=reactivity.js.map
