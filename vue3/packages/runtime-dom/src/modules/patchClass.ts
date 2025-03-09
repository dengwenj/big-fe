export default function patchClass(el: Element, value: any) {
  if (!value) {
    el.removeAttribute('class')
  } else {
    el.className = value
  }
}
