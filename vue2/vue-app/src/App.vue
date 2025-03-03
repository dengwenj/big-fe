<template>
  <div class="app" a="1" b="2" @click="ww">
    <div>vue app</div>
    <A :num="num" @emitNum="num++" />
  </div>
</template>

<script>
import A from './views/A.vue';

export default {
  components: {
    A
  },
  data() {
    return {
      num: 1
    }
  },
  beforeCreate() {
    // console.log('beforeCreate', this)
    // console.log(this.num) // undefined
  },
  created() {
    // console.log('created', this);
    // console.log(this.num) // 1
  },
  mounted() {
    console.log("虚拟 dom", this._vnode)
  },
  methods: {
    ww() {
      console.log("ww")
    }
  }
  // render(h) {
  //   const vDom = h('div', 'ww')
  //   return vDom
  // }
}
</script>
