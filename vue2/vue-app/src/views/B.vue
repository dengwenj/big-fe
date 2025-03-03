<template>
  <div>
    <button @click="handleD(number - 1)">-</button>
    <span>{{ number }}</span>
    <button @click="handleAdd(number + 1)">+</button>
  </div>
</template>

<script>
export default {
  props: ['number'],
  model: {
    prop: 'number',
    event: 'change'
  },
  methods: {
    handleD(val) {
      this.$emit('change', val)
    },
    handleAdd(val) {
      this.$emit('change', val)
    }
  }
}
</script>