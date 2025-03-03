<template>
  <div class="app" a="1" b="2" @click="ww">
    <div>vue app</div>
    <A :num="num" @emitNum="num++" />

    <!-- <B :number="number" @change="number = $event"/> -->
    <B v-model="number" />
    
    <button @click="handleA">handleA</button>
    <div>{{ a }}</div>
  </div>
</template>

<script>
import A from './views/A.vue';
import B from './views/B.vue';

export default {
  components: {
    A,
    B
  },
  data() {
    return {
      num: 1,
      number: 0
    }
  },
  beforeCreate() {
    // console.log('beforeCreate', this)
    // console.log(this.num) // undefined
    this.a = 100
  },
  created() {
    // console.log('created', this);
    // console.log(this.num) // 1
  },
  mounted() {
    console.log("虚拟 dom", this._vnode)
    console.log(this)
  },
  methods: {
    ww() {
      console.log("ww")
    },
    handleA() {
      console.log(this.a++)
    }
  }
  // render(h) {
  //   const vDom = h('div', 'ww')
  //   return vDom
  // }
}
</script>
