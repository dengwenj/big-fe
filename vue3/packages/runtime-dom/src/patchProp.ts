// 对节点元素的属性操作 class style event

import patchAttr from "./modules/patchAttr";
import patchClass from "./modules/patchClass";
import patchEvent from "./modules/patchEvent";
import patchStyle from "./modules/patchStyle";

// 内部调用的
export default function patchProp(el: HTMLDivElement, key: string, preVal: any, value: any) {
  console.log(el, key, preVal, value)
  if (key === 'class') {
    return patchClass(el, value)
  } else if(key === 'style') {
    return patchStyle(el, preVal, value)
  } else if (/^on[^a-z]/.test(key)) {
    // 事件
    return patchEvent(el, key, value)
  } else {
    return patchAttr(el, key, value)
  }
}
