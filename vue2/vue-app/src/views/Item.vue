<template>
  <div class="item_data">
    <div class="id">{{ item.id }}</div>
    <div class="name">{{ item.name }}</div>
    <div class="age">{{ item.age }}</div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style>
.item_data {
  height: 54px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}
.id, .name, .age {
  flex: 1;
  text-align: center;
}
</style>