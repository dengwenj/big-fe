// 位运算组合起来是唯一的，不会有奇异
export enum ShapeFlags {
  ELEMENT = 1, // 1
  FUNCTIONAL_COMPONENT = 1 << 1, // 左移一位，二进制 10，即 2
  STATEFUL_COMPONENT = 1 << 2, // 左移一位，二进制 100，即 4
  TEXT_CHILDREN = 1 << 3, // 8 
  ARRAY_CHILDREN = 1 << 4, // 16
  SLOTS_CHILDREN = 1 << 5, // 32
  TELEPORT = 1 << 6, // 64
  SUSPENSE = 1 << 7, // 128
  COMPONENT_SHOULD_KEEP_ALIVE = 1 << 8, // 256
  COMPONENT_KEPT_ALIVE = 1 << 9, // 512
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT, // 6
}
