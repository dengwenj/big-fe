/**
 * computed 计算属性和 methods 有什么区别
 * 1、在使用时，computed 当做属性使用，而 methods 则当做方法调用
 * 2、computed 可以具有 getter 和 setter，因此可以赋值，而 methods 不行
 * 3、computed 无法接收多个参数，而 methods 可以
 * 4、computed 具有缓存(就是因为有脏值 dirty 的判断)，而 methods 没有
 * 这里的缓存是因为有个 dirty 的变量
 * dirty 的作用就是是否为脏值，如果 dirty 为 true 说明为脏值，是在属性被修改(watcher)的时候会触发函数设置为 true 的，
 * 然后再运行 computed 的时候会判断 dirty 是否为脏值，不为脏值(false)直接返回，为脏值就允许下面的代码(就会执行 getter)，最后再把 dirty 设置为 false
 */ 
