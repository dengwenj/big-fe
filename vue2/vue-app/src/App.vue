<template>
  <div>
    vue app
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
    console.log('beforeCreate', this)
    console.log(this.num) // undefined
  },
  created() {
    console.log('created', this);
    console.log(this.num) // 1
  }
}
</script>
