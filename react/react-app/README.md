## react 的组件有哪些常用的声明方式
- 函数式组件
- 类组件

## react 常见的 hook 有哪些？
### 官方的 hook
- useEffect
  - 模拟一些生命周期，处理一些状态的副作用，请求接口
- useState
  - 更新 UI，useState 的返回值为 状态数据和修改状态的方法
- useLayoutEffect
  - 比 useEffect 的时机更提前一些
- useMemo
  - 返回一个可缓存的值，一般作为一些优化的手段
- useCallback
  - 返回一个可缓存的函数
- useRef
  - 在组件的生命周期中，保持全局不变
  - 一般用来定位一个具体的元素
- useReducer
  - 让我们的状态变更可控
  - reducer 明确具体的 action
- useContext
  - 构建一个全局的上下文
  - 生产消费的模式
### 非官方的 hook
  - ahooks
  - react-use

### 第三方库提供的 hook
  - react-router-dom
    - useLocation
    - useNavigate

### useMemo
* useMemo 和 vue 的computed 类似，都是有缓存的，当依赖项没发生改变(dirty)的时候，直接返回原来的值