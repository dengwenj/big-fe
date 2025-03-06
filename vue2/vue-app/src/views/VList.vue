<template>
  <div class="control" ref="control" @scroll="setPool">
    <div
      class="v"
      :style="{ 
        height: `${totalSize}px`,
      }"
    >
      <!-- 每行数据 -->
      <div
        class="item" 
        v-for="poolItem in pool" 
        :key="poolItem.item[keyFiled]"
        :style="{
          transform: `translateY(${poolItem.position}px)`
        }"
      >
        <slot name="item" :item="poolItem.item"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dataSource: {
      type: Array,
      default: () => []
    },
    // item 的高度
    itemSize: {
      type: Number,
      default: 0
    },
    keyFiled: {
      type: String,
      default: 'id'
    }
  },
  data() {
    return {
      // 当前渲染的数据
      pool: []
    }
  },
  computed: {
    totalSize() {
      return this.dataSource.length * this.itemSize
    }
  },
  mounted() {
    this.setPool()
  },
  methods: {
    setPool() {
      // 滚动了多少
      const scrollTop = this.$refs.control.scrollTop
      const height = this.$refs.control.clientHeight
      
      // scrollTop / this.itemSize 就知道滚动了几个 item
      let startIndex = Math.floor((scrollTop / this.itemSize))
      let endIndex = Math.ceil((height + scrollTop) / this.itemSize)

      // 多给几个，防止白屏
      let c = 10
      startIndex -= c
      if (startIndex < 0) {
        startIndex = 0
      }
      endIndex += c

      // 移动了多少。起始下标的偏移量。不能直接加上 scrollTop，要用这种方式(startIndex * this.itemSize)，往上滑一个才移动一个的距离，不要实时
      const p = startIndex * this.itemSize
      this.pool = this.dataSource.slice(startIndex, endIndex).map((it, idx) => {
        return {
          item: it,
          // 起始的偏移量 + 依次往后偏移
          position: p + idx * this.itemSize
          // 以下错误的做法
          // position: scrollTop + idx * this.itemSize
        }
      })
    }
  }
}
</script>

<style>
.control {
  overflow: auto;
}
.v {
  position: relative;
}
.item {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
</style>