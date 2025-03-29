export const bootstrap = () => {
  console.log("bootstrap2")
  return Promise.resolve()
}

export const mount = async () => {
  console.log("mount2")
  await Promise.resolve()
  const div2 = document.createElement('div')
  div2.innerHTML = 'app2'
  document.querySelector('#app').appendChild(div2)
}

export const unmount = () => {
  console.log("unmount2")
  return Promise.resolve()
}
