### Vue3

### Vu3 设计思想
* vue3 注重模块上的拆分 vue3 中的模块之间耦合度低，模块可以独立使用。拆分模块
* 通过构建工具 Tree-shaking 机制实现按需引入，减少用户打包后体积。组合式 API
* vue3 允许自定义渲染器，扩展能力强，扩展更方便

### Monorepo 管理项目
* Monorepo 是管理项目代码的一个方式，指在一个项目仓库(repo)中管理多个模块/包
* vue3 源码采用 monorepo 方式进行管理，将模块拆分到 package 目录中，作为一个个包来管理，这样职责划分更加明确
* 一个仓库可维护多个模块，不用到处找仓库
* 方便版本管理和依赖管理，模块之间的引用，调用都非常方便

### Composition API(组合式)
* CompositionAPI 不存在 this 指向不明确问题
* CompositionAPI 对 tree-shaking 更加友好，代码也更容易压缩
* reactivity 模块中就包含了很多我们经常使用的 API：computed、reactive、ref、effect

### 响应式的核心
* 响应式的核心就是收集依赖和派发更新（vue2 用 Object.defineProperty，vue3用 proxy）
* 当访问的时候触发 getter 函数收集依赖
* 当修改的时候触发 setter 函数派发更新
* 收集的是什么依赖呢？依赖就是函数(effect)，即收集函数

### 怎么收集依赖的呢？
* 设置一个全局变量
* effect(() => {// 这个回调函数首次会执行一次})
* 首次会执行一次函数(effect)中的回调方法，然后会执行内部的 run 方法，在方法前面赋值当前这个函数(effect)给全局变量，代码往下执行到这个回调函数中，若有访问属性，那就会触发 getter 方法，收集依赖，现在就知道收集的是哪个函数了，因为在方法的前面保存过，等方法执行完后把全局变量保存的函数(effect)置空就行。

### 怎么派发更新呢？
* 当有属性修改时会触发 setter 方法，就知道哪个属性对应了哪些依赖，因为在收集依赖的时候保存过属性和函数的映射关系(属性对象 => {函数, 函数})。就会调用依赖(函数)，一调用触发 effect 中的 调度器方法，在调度器方法中执行 effect.run 就会触发回调函数的执行，即响应式

### 清除依赖

```ts
const state = reactive({ name: '朴睦' })
effect(() => {
  // 首次执行这里输出 朴睦, 1秒钟后再次执行输出 dwj
  log(state.name)
})

setTimeout(() => {
  state.name = 'dwj'
}, 1000)

// ======================================================================================
export function reactive(target) {
  return createReactiveObject(target)
}

function createReactiveObject(target) {
  // 是否是对象
  if (!isObject(target)) {
    return target
  }

  // 如果传入的对象已经是 proxy，直接返回 proxy
  if (target[ReactiveFlags.IS_REACTIVE]) {
    return target
  }

  // 如果对象已经缓存
  const exitsProxy = reactiveMap.get(target)
  if (exitsProxy) {
    return exitsProxy
  }

  const proxy = new Proxy(target, mutableHandler)
  reactiveMap.set(target, proxy)
  return proxy
}

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}

// ========================================================================
export const mutableHandler: ProxyHandler<any> = {
  // receiver 代理对象
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    // 当取值的时候，应该让响应式属性和 effect 映射起来
    // 收集依赖：谁用了我，保存函数
    track(target, key)

    const res = Reflect.get(target, key, receiver)
    // 递归代理，深度代理
    if (isObject(res)) {
      return reactive(res)
    }

    return res // Reflect.get(target, key, receiver) === receiver[key]，但它不会递归调用
  },

  set(target, key, newValue, receiver) {
    // 找到属性，让对应的 effect 重新执行
    const oldValue = target[key]
    const res = Reflect.set(target, key, newValue, receiver)
    if (oldValue !== newValue) {
      // 派发更新，当修改了属性去调用 effect 函数
      trigger(target, key, newValue, oldValue)
    }
    return res
  },
}

// ==============================================================================================
// 这就是保存的全局函数 effect，收集依赖时用到
export const activeEffect: ReactiveEffect[] = []

class ReactiveEffect {
  // 创建的 effect 是响应式的
  public active = true

  public isRunning = false

  // 记录之前的
  private cleanPreEffect: Map<ReactiveEffect, Map<object, Record<string, number>>> = new Map()

  constructor(public fn: () => void, public schedulder: () => void) { }

  // 执行 fn 函数，这个 fn 函数就是 effect 中的回调函数
  run() {
    if (!this.active) {
      return this.fn()
    }

    // 收集依赖：当 effect 函数中用了，就要收集该 effect
    // 用全局变量保存当前属性使用了 effect
    try {
      // activeEffect = this
      activeEffect.push(this)

      // 执行回调函数之前，先把之前的 effect 清除掉
      this.clearEffect()

      this.isRunning = true
      return this.fn()
    } finally {
      // 执行完后置为空
      // activeEffect = null
      // 删除最后一个，函数调用栈，后进先出
      activeEffect.pop()
      this.isRunning = false
    }
  }

  public getCleanPreEffect() {
    return this.cleanPreEffect
  }

  public setCleanPreEffect(
    effect: ReactiveEffect, 
    target: object, 
    keyAndIndex: Record<string, number>
  ): void {
    // 以前存过 effect 了
    if (this.cleanPreEffect.has(effect)) {
      const targetData = this.cleanPreEffect.get(effect)
      if (targetData.has(target)) {
        // 之前的
        const preKeyAndIndex = targetData.get(target)

        // 对象合并起来
        targetData.set(target, {
          ...preKeyAndIndex,
          ...keyAndIndex
        })
      } else {
        targetData.set(target, keyAndIndex)
      }
    } else {
      const targetData = new Map<object, Record<string, number>>()
      targetData.set(target, keyAndIndex)
      this.cleanPreEffect.set(effect, targetData)
    }
  }

  /**
   * vue 里面做的是拿老的依赖和新的依赖比对，没用的清除
   * 我这里做的是直接把之前的依赖清除，没有比对
   */
  private clearEffect(): void {
    // 清除这个 effect 实例所有
    const targetToKeyAndIndex = this.cleanPreEffect.get(this)
    if (!targetToKeyAndIndex) {
      return
    }
    targetToKeyAndIndex.forEach((val, target) => {
      // console.log(val, 'val')
      const effectsObj = targetMap.get(target)
      const keys = Object.keys(val)
      for (const key of keys) {
        const effects = effectsObj[key] as ReactiveEffect[]
        const idx = val[key]
        // 置为 null
        effects.splice(idx, 1, null)
      }
    })

    // 执行完后清除 null 的元素
  }
}

export function targetEffects(effects: ReactiveEffect[]) {
  for (const effect of effects) {
    if (effect) {
      // 是否正在执行
      if (!effect.isRunning) {
        effect.schedulder() // 执行这个方法就会只执行 _effect.run() 就会触发 effect 里的回调方法 
      }
    }
  }
}

// 用weakmap保存的依赖，结构如下
export const targetMap = new WeakMap()
// {
//   { name: 'pumu', age: 25 }: {
//     name: [effect1, effect2],
//     age: [effect1]
//   }
// }


/**
 * 收集依赖
 * @param target 
 * @param key 
 */
export function track(target: object, key: any) {
  // effect 回调函数用了多次一样的属性，只保存一个 effect
  const _effect = activeEffect[activeEffect.length - 1]
  if (_effect) {
    let idx = -1
    if (targetMap.has(target)) {
      const data = targetMap.get(target)
      if (data[key]) {
        data[key].push(_effect)
        idx = data[key].length - 1
      } else {
        data[key] = [_effect]
        idx = 0
      } 
    } else {
      targetMap.set(target, {
        [key]: [_effect]
      })
      idx = 0
    }
    _effect.setCleanPreEffect(_effect, target, {[key]: idx})
  }
}
console.log(targetMap)

/**
 * 修改了属性，派发更新
 * @param target 
 * @param key 
 * @param oldValue 
 * @param newValue 
 */
export function trigger(target: object, key: any, newValue: any, oldValue: any) {
  if (!targetMap.has(target)) {
    return
  }

  const data = targetMap.get(target)
  if (data[key]) {
    // 更新
    targetEffects([...data[key]]) // 这里不能传引用，不然 push 的时候添加(收集依赖的时候会 push)，会一直循环
  }
}
```

### 虚拟 DOM
* 用一个对象(js 对象)来描述真实 DOM，h 函数最终就是返回的一个虚拟dom。然后把 h 函数放入 render 函数中，内部做一系列事情，最终渲染出真实 dom
* 像我们写的模版(<template></template>)，最终都是要被编译成虚拟dom的，放入到 render 函数中，通过渲染器渲染出真实dom
* 主要作用就是**提升性能**，开发者可以专注于组件的状态和逻辑，而不需要手动操作 DOM 元素，降低了开发难度和出错的概率。

### Diff 算法
* 当前一次的虚拟dom和后一次的虚拟dom不同时就会去 diff 比较。 diff 算法，比较的是 前一次的虚拟 dom 和后一次的 虚拟 dom
* 何为一样的虚拟dom？type 一样，key 一样，说明前后是一样的虚拟dom
* 全量 diff：
* 1、首先会从头比较，前一次的虚拟dom和后一次的虚拟dom，第一个对应第一个，如果是一样的虚拟dom，就会去 patch 更新内容
* 2、会再从尾比较，前一次的虚拟dom和后一次的虚拟dom，从尾一一对应，如果是一样的虚拟dom，就会去 patch 更新内容
* 3、在 diff 过程中，如果发现新节点在旧节点中不存在，那么就会创建新的真实 DOM 节点并插入到相应位置。如果旧节点在新节点中不存在，那么就会删除对应的真实 DOM 节点
* 4、当双端比较无法处理所有情况时，Vue 3 会使用最长递增子序列算法来处理节点的移动
* 在模版编译的时候会对节点做性能优化，当是动态节点的时候会打个标记 patchFlag，**靶向更新**时 diff 比较就只会对动态节点比较，不会对静态节点比较，节省性能。

### vue3 初始化组件（3步，具体实现在 renderer 文件的 mountComponent 函数）
* 1、先创建组件实例
* 2、给实例的属性赋值
* 3、创建一个 effect (在这里里面去 render 渲染的，最终呈现到页面上)

### 性能优化
* 如果在编写 vue 的时候，直接采用 jsx 或者 h 的写法，得不到优化的。vue 对模版的写法进行了优化。如下：
* 1、PatchFlag 优化：diff算法无法避免新旧虚拟 dom 中无用的比较操作，通过 patchFlags 来标记**动态内容**，可以实现快速 diff 算法。就是静态写死的不用比较，只比较动态的。放入到一个队列里，前队列和后队列，一个对一个比较
* 2、block 用于收集动态节点的。PatchFlag 是用来标识动态内容。blockTree 收集复杂的结构（v-if v-else v-for 不稳定的结构）
* 靶向更新：避免了不必要的 DOM 重新渲染，减少了浏览器的重排和重绘操作，从而提高了应用的性能。（PatchFlag 优化），靶向更新：只比较动态节点，不会全量 diff。
* 为什么能做到比之前的全量 diff 性能更高？就是在模版编译的时候加了很多动态内容的标识。然后 renderer 时，一系列判断是否进入全量diff。这就是为什么 vue 用模版编写性能比较高

### 编译
* 1、语法转化成一个对象 ast 语法树
* 2、对树进行优化（打标记 patchFlag）
* 3、根据转化后的代码生成一个字符串
