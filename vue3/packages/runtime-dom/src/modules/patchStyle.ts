export default function patchStyle(el: HTMLDivElement, preVal, value) {
  const style = el.style

  // 把新的属性加上
  for (const key in value) {
    style[key] = value[key]
  }

  if (preVal) {
    // 把老的有没用到的移除掉
    for (const key in preVal) {
      if (value) {
        if (value[key] === null) {
          style[key] = null
        } 
      }
    } 
  }
}
