/**
 * 插槽的本质就是一个函数方法
 */
const obj = {
  default: function(data) {
    return vnode
  }
}
// 传了数据是作用域插槽
父组件: `<template v-slot:default="data">{{data.content}}</template>`
子组件: `<slot name="default" :content="content"></slot>`
