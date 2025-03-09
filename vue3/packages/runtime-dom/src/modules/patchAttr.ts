export default function patchAttr(el: HTMLDivElement, key, value) {
  if (!value) {
    el.removeAttribute(key)
  } else {
    el.setAttribute(key, value)
  }
}
