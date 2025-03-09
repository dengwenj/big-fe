function createInovker(eventCb) {
  const inovker = (e) => {
    inovker.value(e)
  }
  inovker.value = eventCb
  return inovker
}

export default function patchEvent(el: any, key: string, value) {
  // 先把事件保存起来
  const inovkers = el.vei || (el.vei = {})

  // 已经绑定过
  const exisitInvoker = inovkers[key]
  if (exisitInvoker && value) {
    exisitInvoker.value = value
    return
  }

  const eventName = key.slice(2).toLowerCase()

  if (value) {
    const inovker = createInovker(value)
    // 保存调用函数
    inovkers[key] = inovker
    el.addEventListener(eventName, inovker)
    return
  }
  
  // 现在没有，以前有
  if (exisitInvoker) {
    el.removeEventListener(eventName, exisitInvoker)
    inovkers[key] = undefined
  }
}
