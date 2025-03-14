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
      if (value) {
        if (value[key] === null) {
          style[key] = null;
        }
      }
    }
  }
}

// packages/runtime-dom/src/patchProp.ts
function patchProp(el, key, preVal, value) {
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
function isString(val) {
  return typeof val === "string";
}
var hasOwnProperty = Object.prototype.hasOwnProperty;
var hasOwn = (value, key) => hasOwnProperty.call(value, key);

// packages/runtime-core/src/createVnode.ts
function isVnode(vnode) {
  return !!vnode.__v_isVnode;
}
var Text = Symbol("Text");
var Fragment = Symbol("Fragment");
function isSameVnode(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
function createVnode(type, props, children) {
  const shapeFlag = isString(type) ? 1 /* ELEMENT */ : isObject(type) ? 4 /* STATEFUL_COMPONENT */ : isFunction(type) ? 2 /* FUNCTIONAL_COMPONENT */ : 0;
  const vnode = {
    __v_isVnode: true,
    type,
    props,
    children,
    shapeFlag,
    el: null,
    // 虚拟节点对应的真实节点是谁
    key: props?.key,
    // diff 算法后面需要的 key
    ref: props?.ref
  };
  if (Array.isArray(children)) {
    vnode.shapeFlag |= 16 /* ARRAY_CHILDREN */;
  } else if (isObject(children)) {
    vnode.shapeFlag |= 32 /* SLOTS_CHILDREN */;
  } else {
    vnode.shapeFlag |= 8 /* TEXT_CHILDREN */;
  }
  return vnode;
}

// packages/runtime-core/src/h.ts
function h(type, propsOrChildren, children) {
  const len = arguments.length;
  if (len === 2) {
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      if (isVnode(propsOrChildren)) {
        return createVnode(type, null, [propsOrChildren]);
      }
      return createVnode(type, propsOrChildren, null);
    }
    return createVnode(type, null, propsOrChildren);
  } else {
    if (len > 3) {
      children = [...arguments].slice(2);
    }
    if (len === 1) {
      propsOrChildren = null;
      children = null;
    } else if (len === 3 && isVnode(children)) {
      children = [children];
    }
    return createVnode(type, propsOrChildren, children);
  }
}

// packages/runtime-core/src/seq.ts
function getSequence(arr) {
  const result = [0];
  const p2 = result.slice(0);
  let start;
  let end;
  let middle;
  const len = arr.length;
  for (let i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      let resultLastIndex = result[result.length - 1];
      if (arr[resultLastIndex] < arrI) {
        p2[i] = result[result.length - 1];
        result.push(i);
        continue;
      }
    }
    start = 0;
    end = result.length - 1;
    while (start < end) {
      middle = (start + end) / 2 | 0;
      if (arr[result[middle]] < arrI) {
        start = middle + 1;
      } else {
        end = middle;
      }
    }
    if (arrI < arr[result[start]]) {
      p2[i] = result[start - 1];
      result[start] = i;
    }
  }
  let l = result.length;
  let last = result[l - 1];
  while (l-- > 0) {
    result[l] = last;
    last = p2[last];
  }
  return result;
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

// packages/runtime-core/src/schedulder.ts
var queue = [];
var isFlushing = false;
var resolvePromise = Promise.resolve();
function queueJob(job) {
  if (!queue.includes(job)) {
    queue.push(job);
  }
  if (!isFlushing) {
    isFlushing = true;
    resolvePromise.then(() => {
      isFlushing = false;
      const copyQueue = queue.slice(0);
      queue.length = 0;
      for (const job2 of copyQueue) {
        job2();
      }
      copyQueue.length = 0;
    });
  }
}

// packages/runtime-core/src/component.ts
function createComponentInstance(vnode, parent) {
  const instance = {
    data: null,
    isMounted: false,
    // 是否挂载完成
    vnode,
    // 组件的虚拟节点
    update: null,
    // 组件的更新函数
    subTree: null,
    // 组件 render 返回的虚拟节点
    propsOptions: vnode.type.props,
    // 组件实例对象上的 props,
    attrs: {},
    // 所有属性 - propsOptions = attrs
    props: {},
    // 响应式的，组件实例对象上的 props
    slots: {},
    // 插槽
    component: null,
    proxy: null,
    // 用来代理 props attrs data 让用户更方便的使用
    render: null,
    // 组件实例的 render
    setupState: {},
    // setup 函数返回的数据
    exposed: null,
    // 暴露
    parent,
    // 父组件 实例
    provides: parent ? parent.provides : /* @__PURE__ */ Object.create(null),
    ctx: {}
    // 如果是 keepalive 组件，就将 dom api 放入到这个属性上
  };
  return instance;
}
var initProps = (instance, rawProps) => {
  const props = {};
  const attrs = {};
  const propsOptions = instance.propsOptions || {};
  for (const key in rawProps) {
    const value = rawProps[key];
    if (key in propsOptions) {
      props[key] = value;
    } else {
      attrs[key] = value;
    }
  }
  instance.props = reactive(props);
  instance.attrs = attrs;
};
var publicProperty = {
  $attrs: (instance) => instance.attrs,
  $slots: (instance) => instance.slots
};
var handler = {
  get(target, key, receiver) {
    const { data, props, setupState } = target;
    if (setupState && hasOwn(setupState, key)) {
      return setupState[key];
    }
    if (props && hasOwn(props, key)) {
      return props[key];
    }
    const getter = publicProperty[key];
    if (getter) {
      return getter(target);
    }
    if (data && hasOwn(data, key)) {
      return data[key];
    }
  },
  set(target, key, newValue, receiver) {
    const { data, props, setupState } = target;
    if (setupState && hasOwn(setupState, key)) {
      setupState[key] = newValue;
      return true;
    }
    if (props && hasOwn(props, key)) {
      console.warn(`props.${key.toString()} is readonly`);
      return false;
    }
    if (data && hasOwn(data, key)) {
      data[key] = newValue;
    }
    return true;
  }
};
var initSlots = (instance, slots) => {
  if (instance.vnode.shapeFlag & 32 /* SLOTS_CHILDREN */) {
    instance.slots = slots;
  } else {
    instance.slots = {};
  }
};
function setupComponent(instance) {
  const { type, props, children } = instance.vnode;
  initProps(instance, props);
  initSlots(instance, children);
  instance.proxy = new Proxy(instance, handler);
  const { data, render: render2, setup } = type;
  if (setup) {
    const setupContext = {
      slots: instance.slots,
      attrs: instance.attrs,
      expose(value) {
        instance.exposed = value;
      },
      emit(event, ...payload) {
        const eventName = `on${event[0].toUpperCase()}${event.slice(1)}`;
        props[eventName]?.(...payload);
      }
    };
    setCurrentInstance(instance);
    const res = setup(instance.props, setupContext);
    unsetCurrentInstance();
    if (isFunction(res)) {
      instance.render = res;
    } else {
      instance.setupState = proxyRefs(res);
    }
  }
  if (data !== void 0 && !isFunction(data)) {
    console.warn("data must a function");
  }
  if (isFunction(data)) {
    instance.data = reactive(data.call(instance.proxy));
  }
  if (!instance.render) {
    instance.render = render2;
  }
}
var currentInstance = null;
var getCurrentInstance = () => {
  return currentInstance;
};
var setCurrentInstance = (instance) => {
  currentInstance = instance;
};
var unsetCurrentInstance = () => {
  currentInstance = null;
};

// packages/runtime-core/src/apiLifeCycle.ts
var LifeCycle = /* @__PURE__ */ ((LifeCycle2) => {
  LifeCycle2["BEFORE_MOUNT"] = "bm";
  LifeCycle2["MOUNTED"] = "m";
  LifeCycle2["BEFORE_UPDATE"] = "bu";
  LifeCycle2["UPDATED"] = "u";
  return LifeCycle2;
})(LifeCycle || {});
function createHook(type) {
  return (hook) => {
    let target = currentInstance;
    if (target) {
      if (!target[type]) {
        target[type] = [];
      }
      const wrapHook = () => {
        setCurrentInstance(target);
        hook();
        unsetCurrentInstance();
      };
      target[type].push(wrapHook);
    }
  };
}
var onBeforeMount = createHook("bm" /* BEFORE_MOUNT */);
var onMounted = createHook("m" /* MOUNTED */);
var onBeforeUpdate = createHook("bu" /* BEFORE_UPDATE */);
var onUpdated = createHook("u" /* UPDATED */);
function invokeLifeCycleHooks(hooks) {
  for (const hook of hooks) {
    hook();
  }
}

// packages/runtime-core/src/components/KeepAlive.ts
var KeepAlive = {
  __isKeepAlive: true,
  props: {
    max: Number
  },
  setup(props, { slots }) {
    const { max } = props;
    const keys = /* @__PURE__ */ new Set();
    const cache = /* @__PURE__ */ new Map();
    let pendingCacheKey = null;
    const instance = getCurrentInstance();
    const cacheSubTree = () => {
      cache.set(pendingCacheKey, instance.subTree);
    };
    const { move, createElement, unmount: _unmount } = instance.ctx.renderer;
    function reset(vnode) {
      let shapeFlag = vnode.shapeFlag;
      if (shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
        shapeFlag -= 512 /* COMPONENT_KEPT_ALIVE */;
      }
      if (shapeFlag & 256 /* COMPONENT_SHOULD_KEEP_ALIVE */) {
        shapeFlag -= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
      }
      vnode.shapeFlag = shapeFlag;
    }
    function unmount(vnode) {
      reset(vnode);
      _unmount(vnode);
    }
    function purneCacheEntry(key) {
      keys.delete(key);
      const cached = cache.get(key);
      unmount(cached);
    }
    instance.ctx.activate = function(vnode, container, anchor) {
      move(vnode, container, anchor);
    };
    const storageContent = createElement("div");
    instance.ctx.deactivate = function(vnode) {
      move(vnode, storageContent, null);
    };
    onMounted(cacheSubTree);
    onUpdated(cacheSubTree);
    return () => {
      const vnode = slots.default();
      const comp = vnode.type;
      const key = vnode.key == null ? comp : vnode.key;
      const cacheVNode = cache.get(key);
      pendingCacheKey = key;
      if (cacheVNode) {
        vnode.component = cacheVNode.component;
        vnode.shapeFlag |= 512 /* COMPONENT_KEPT_ALIVE */;
        keys.delete(key);
        keys.add(key);
      } else {
        keys.add(key);
        if (max && keys.size > max) {
          purneCacheEntry(keys.values().next().value);
        }
      }
      vnode.shapeFlag |= 256 /* COMPONENT_SHOULD_KEEP_ALIVE */;
      return vnode;
    };
  }
};
var isKeepAlive = (value) => value.type.__isKeepAlive;

// packages/runtime-core/src/renderer.ts
function createRenderer(renderOptions2) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp
  } = renderOptions2;
  const normalize = (children) => {
    if (Array.isArray(children)) {
      for (let i = 0; i < children.length; i++) {
        if (typeof children[i] === "string" || typeof children[i] === "number") {
          children[i] = createVnode(Text, null, String(children[i]));
        }
      }
    }
    return children;
  };
  const mountChildren = (ele, children) => {
    normalize(children);
    for (const item of children) {
      patch(null, item, ele);
    }
  };
  const mountElement = (n2, container, anchor) => {
    const { shapeFlag, type, children, props } = n2;
    const ele = hostCreateElement(type);
    n2.el = ele;
    if (props) {
      for (const key in props) {
        hostPatchProp(ele, key, null, props[key]);
      }
    }
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      hostSetElementText(ele, children);
    } else if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
      mountChildren(ele, children);
    }
    hostInsert(ele, container, anchor);
  };
  const processElement = (n1, n2, container, anchor) => {
    if (n1 === null) {
      mountElement(n2, container, anchor);
    } else {
      patchElement(n1, n2, container);
    }
  };
  const patchProps = (oldProps, newProps, el) => {
    for (const key in newProps) {
      hostPatchProp(el, key, oldProps[key], newProps[key]);
    }
    for (const key in oldProps) {
      if (!newProps[key]) {
        hostPatchProp(el, key, oldProps[key], null);
      }
    }
  };
  const unmountChildren = (children) => {
    for (const vnode of children) {
      hostRemove(vnode.el);
    }
  };
  const patchKeyedChildren = (c1, c2, el) => {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVnode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        let nextPos = e2 + 1;
        let anchor = c2[nextPos]?.el;
        while (i <= e2) {
          patch(null, c2[i], el, anchor);
          i++;
        }
      }
    } else if (i > e2) {
      if (i <= e1) {
        while (i <= e1) {
          unmount(c1[i]);
          i++;
        }
      }
    } else {
      let s1 = i;
      let s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      let toBepatched = e2 - s2 + 1;
      let newIndexToOldMapIndex = new Array(toBepatched).fill(0);
      for (let i2 = s2; i2 <= e2; i2++) {
        const vnode = c2[i2];
        keyToNewIndexMap.set(vnode.key, i2);
      }
      for (let i2 = s1; i2 <= e1; i2++) {
        const vnode = c1[i2];
        const newIndex = keyToNewIndexMap.get(vnode.key);
        if (newIndex === void 0) {
          unmount(vnode);
        } else {
          newIndexToOldMapIndex[newIndex - s2] = i2 + 1;
          patch(vnode, c2[newIndex], el);
        }
      }
      const seq = getSequence(newIndexToOldMapIndex);
      let j = seq.length - 1;
      for (let i2 = toBepatched - 1; i2 >= 0; i2--) {
        let newIndex = s2 + i2;
        let anchor = c2[newIndex + 1]?.el;
        let vnode = c2[newIndex];
        if (!vnode.el) {
          patch(null, vnode, el, anchor);
        } else {
          if (i2 === seq[j]) {
            j--;
          } else {
            hostInsert(vnode.el, el, anchor);
          }
        }
      }
    }
  };
  const patchChildren = (n1, n2, el) => {
    const c1 = n1.children;
    const c2 = normalize(n2.children);
    const preShapeFlag = n1.shapeFlag;
    const shapeFlag = n2.shapeFlag;
    if (shapeFlag & 8 /* TEXT_CHILDREN */) {
      if (preShapeFlag & 16 /* ARRAY_CHILDREN */) {
        unmountChildren(c1);
        hostSetElementText(el, c2);
      } else if (preShapeFlag & 8 /* TEXT_CHILDREN */) {
        hostSetElementText(el, c2);
      }
    } else {
      if (preShapeFlag & 16 /* ARRAY_CHILDREN */) {
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
          patchKeyedChildren(c1, c2, el);
        } else {
          unmountChildren(c1);
        }
      } else {
        if (preShapeFlag & 8 /* TEXT_CHILDREN */) {
          hostSetElementText(el, "");
        }
        if (shapeFlag & 16 /* ARRAY_CHILDREN */) {
          mountChildren(el, c2);
        }
      }
    }
  };
  const patchElement = (n1, n2, container) => {
    const el = n2.el = n1.el;
    const oldProps = n1.props || {};
    const newProps = n2.props || {};
    patchProps(oldProps, newProps, el);
    patchChildren(n1, n2, el);
  };
  const processText = (n1, n2, container) => {
    if (n1 === null) {
      const textNode = hostCreateText(n2.children);
      n2.el = textNode;
      hostInsert(n2.el, container);
    } else {
      const el = n2.el = n1.el;
      if (n1.children !== n2.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processFragment = (n1, n2, container) => {
    if (n1 === null) {
      mountChildren(container, n2.children);
    } else {
      patchChildren(n1, n2, container);
    }
  };
  const updateComponentPreRender = (instance, next) => {
    instance.next = null;
    instance.vnode = next;
    updateProps(instance, instance.props, next.props);
    Object.assign(instance.slots, next.children);
  };
  function renderComponent(instance) {
    const { vnode, render: render3, proxy, attrs } = instance;
    if (vnode.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
      return render3.call(proxy, proxy);
    } else {
      return vnode.type(attrs);
    }
  }
  function setupRenderEffect(instance, container, anchor) {
    const componentUpdateFn = () => {
      const { next, bm, m, bu, u } = instance;
      let subTree;
      if (!instance.isMounted) {
        if (bm) {
          invokeLifeCycleHooks(bm);
        }
        subTree = renderComponent(instance);
        patch(null, subTree, container, anchor, instance);
        instance.isMounted = true;
        if (m) {
          invokeLifeCycleHooks(m);
        }
      } else {
        if (next) {
          updateComponentPreRender(instance, next);
        }
        if (bu) {
          invokeLifeCycleHooks(bu);
        }
        subTree = renderComponent(instance);
        patch(instance.subTree, subTree, container, anchor, instance);
        if (u) {
          invokeLifeCycleHooks(u);
        }
      }
      instance.subTree = subTree;
    };
    const effect2 = new ReactiveEffect(componentUpdateFn, () => {
      queueJob(update);
    });
    const update = () => {
      effect2.run();
    };
    update();
    instance.update = update;
  }
  const mountComponent = (vnode, container, anchor, parentComponent) => {
    const instance = createComponentInstance(vnode, parentComponent);
    vnode.component = instance;
    if (isKeepAlive(vnode)) {
      instance.ctx.renderer = {
        createElement: hostCreateElement,
        // 内部需要创建一个 div 来缓存 dom
        move(vnode2, container2) {
          hostInsert(vnode2.component.subTree.el, container2);
        },
        unmount
        // 如果组件切换需要将现在容器中的元素移除
      };
    }
    setupComponent(instance);
    setupRenderEffect(instance, container, anchor);
  };
  const hasPropsChange = (preProps, nextProps) => {
    if (nextProps === null) {
      nextProps = {};
    }
    const preKeys = Object.keys(preProps);
    const nextKeys = Object.keys(nextProps);
    if (preKeys.length !== nextKeys.length) {
      return true;
    }
    for (const key of nextKeys) {
      if (nextProps[key] !== preProps[key]) {
        return true;
      }
    }
    return false;
  };
  const updateProps = (instance, preProps, nextProps) => {
    if (hasPropsChange(preProps, nextProps)) {
      for (const key in nextProps) {
        instance.props[key] = nextProps[key];
      }
      for (const key in preProps) {
        if (!(key in nextProps)) {
          delete instance.props[key];
        }
      }
    }
  };
  const shouldComponentUpdate = (n1, n2) => {
    const { props: preProps, children: preChildren } = n1;
    const { props: nextProps, children: nextChildren } = n2;
    if (preChildren || nextChildren) {
      return true;
    }
    if (preProps === nextProps) {
      return false;
    }
    return hasPropsChange(preProps, nextProps);
  };
  const updateComponent = (n1, n2) => {
    const instance = n2.component = n1.component;
    if (shouldComponentUpdate(n1, n2)) {
      instance.next = n2;
      instance.update();
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent) => {
    if (n1 === null) {
      if (n2.shapeFlag & 512 /* COMPONENT_KEPT_ALIVE */) {
        parentComponent.ctx.activate(n2, container, anchor);
      } else {
        mountComponent(n2, container, anchor, parentComponent);
      }
    } else {
      updateComponent(n1, n2);
    }
  };
  const patch = (n1, n2, container, anchor = null, parentComponent = null) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVnode(n1, n2)) {
      unmount(n1);
      n1 = null;
      container._vnode = n2;
    }
    const { type, shapeFlag, ref: ref2 } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container);
        break;
      case Fragment:
        processFragment(n1, n2, container);
        break;
      default:
        if (shapeFlag & 6 /* COMPONENT */) {
          processComponent(n1, n2, container, anchor, parentComponent);
        } else {
          processElement(n1, n2, container, anchor);
        }
        break;
    }
    if (ref2) {
      setRef(ref2, n2);
    }
  };
  const setRef = (ref2, n2) => {
    let val;
    if (n2.shapeFlag & 4 /* STATEFUL_COMPONENT */) {
      val = n2.component.exposed || n2.component.proxy;
    } else {
      val = n2.el;
    }
    if (isRef(ref2)) {
      ref2.value = val;
    }
  };
  const unmount = (vnode) => {
    if (vnode.type === Fragment) {
      unmountChildren(vnode.children);
    } else if (vnode.shapeFlag & 6 /* COMPONENT */) {
      unmount(vnode.component.subTree);
    } else {
      hostRemove(vnode.el);
    }
  };
  const render2 = (vnode, container) => {
    if (vnode === null) {
      if (container._vnode) {
        unmount(container._vnode);
      }
    } else {
      patch(container._vnode || null, vnode, container);
      container._vnode = vnode;
    }
  };
  return {
    render: render2
  };
}

// packages/runtime-core/src/apiProvide.ts
function provide(key, value) {
  if (!currentInstance) {
    return;
  }
  const parentProvide = currentInstance.parent?.provides;
  let provides = currentInstance.provides;
  if (parentProvide === provides) {
    provides = currentInstance.provides = Object.create(parentProvide);
  }
  provides[key] = value;
}
function inject(key, defaultVal) {
  if (!currentInstance) {
    return;
  }
  const provides = currentInstance.parent?.provides;
  if (provides?.[key]) {
    return currentInstance.provides[key];
  } else {
    return defaultVal;
  }
}

// packages/runtime-dom/src/index.ts
var renderOptions = {
  ...nodeOps,
  patchProp
};
var render = (vNode, container) => {
  return createRenderer(renderOptions).render(vNode, container);
};
export {
  Fragment,
  KeepAlive,
  LifeCycle,
  ReactiveEffect,
  Text,
  activeEffect,
  computed,
  createComponentInstance,
  createRenderer,
  createVnode,
  currentInstance,
  effect,
  getCurrentInstance,
  h,
  inject,
  invokeLifeCycleHooks,
  isKeepAlive,
  isReactive,
  isRef,
  isSameVnode,
  isVnode,
  onBeforeMount,
  onBeforeUpdate,
  onMounted,
  onUpdated,
  provide,
  proxyRefs,
  reactive,
  ref,
  render,
  setCurrentInstance,
  setupComponent,
  targetEffects,
  toReactive,
  toRef,
  toRefs,
  trackComputedRef,
  triggerComputedRef,
  unsetCurrentInstance,
  watch,
  watchEffect
};
//# sourceMappingURL=runtime-dom.js.map
