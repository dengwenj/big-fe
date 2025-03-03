<template>
  <div>
    {{ val }}
    {{ num }}
    <button @click="handlerClick">点击+1</button>
  </div>
</template>

<script>
export default {
  props: {
    num: {
      type: Number,
      default: 100
    }
  },
  data() {
    return {
      val: "A 组件"
    }
  },
  methods: {
    handlerClick(e) {
      this.$emit('emitNum')
    }
  }
}
</script>
