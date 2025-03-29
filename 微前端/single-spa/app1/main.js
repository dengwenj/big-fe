export const bootstrap = () => {
  console.log("bootstrap1")
  return Promise.resolve()
}

export const mount = () => {
  console.log("mount1")
  return Promise.resolve().then(() => {
    const div1 = document.createElement('div')
    div1.innerHTML = 'app1'
    document.querySelector('#app').appendChild(div1)
  })
}

export const unmount = () => {
  console.log("unmount1")
  return Promise.resolve()
}
