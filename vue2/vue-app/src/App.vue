<template>
  <div class="app" a="1" b="2" @click="ww">
    <!-- <div>vue app</div> -->
    <!-- <A :num="num" @emitNum="num++" /> -->

    <!-- <B :number="number" @change="number = $event"/> -->
    <!-- <B v-model="number" /> -->
    
    <!-- <button @click="handleA">handleA</button>
    <div>{{ a }}</div> -->

    <VList 
      class="v_list"
      :dataSource="dataSource"
      :itemSize="54"
    >
      <template #item="{ item }">
        <Item :item="item" />
      </template>
    </VList>
  </div>
</template>

<script>
import A from './views/A.vue';
import B from './views/B.vue';
import VList from './views/VList.vue';
import Item from './views/Item.vue';

export default {
  components: {
    A,
    B,
    VList,
    Item
  },
  data() {
    return {
      num: 1,
      number: 0,
      dataSource: []
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
    for (let i = 0; i < 1000; i++) {
      this.dataSource.push({
        name: `name${i}`,
        age: `age${i}`,
        id: i
      })
    }   
  },
  mounted() {
    // console.log("虚拟 dom", this._vnode)
    // console.log(this) 
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

<style>
.v_list {
  margin: 100px auto;
  height: 600px;
  width: 400px;
  border-radius: 8px;
  border: 1px solid #ccc;
}
</style>