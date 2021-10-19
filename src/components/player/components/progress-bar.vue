<template>
  <div
    class="progress-bar"
    @click="onClick"
  >
    <div class="bar-inner">
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.passive="onTouchStart"
        @touchmove.passive="onTouchMove"
        @touchend.passive="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const progressBtnWidth = 16 // 进度条按钮宽度
  export default {
    name: 'progress-bar',
    props: {
      progress: { type: Number, default: 0 } // 播放进度,范围0到1
    },
    data() {
      return {
        offset: 0 // 进度偏移量
      }
    },
    created() {
      this.touch = {} // 定义在这是因为不需要监听数据变化,提升性能
    },
    methods: {
      onTouchStart(e) {
        this.touch.x1 = e.touches[0].pageX // 开始位置
        this.touch.beginWidth = this.$refs.progress.clientWidth // 进度条初始宽度
      },
      onTouchMove(e) {
        const delta = e.touches[0].pageX - this.touch.x1 // 偏移量
        const tempWidth = this.touch.beginWidth + delta // 初始宽度 + 偏移量
        const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条宽度
        const progress = Math.min(1, Math.max(tempWidth / barWidth, 0)) // 新的进度0-1
        this.offset = barWidth * progress // 偏移量
        this.$emit('progress-changing', progress) // 发射事件
      },
      onTouchEnd() {
        const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条宽度
        const progress = this.$refs.progress.clientWidth / barWidth // 新的进度0-1
        this.$emit('progress-changed', progress) // 发射事件
      },
      onClick(e) {
        const rect = this.$el.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left // 进度条偏移值
        const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条宽度
        const progress = offsetWidth / barWidth
        this.$emit('progress-changed', progress) // 发射事件
      },
      setOffset(newProgress) {
        const barWidth = this.$el.clientWidth - progressBtnWidth // 进度条按钮右边的进度条宽度
        this.offset = barWidth * newProgress // 偏移量 = 进度条按钮右边的进度条宽度 * 新进度
      }
    },
    computed: {
      progressStyle() { // 进度条追踪
        return `width:${this.offset}px`
      },
      btnStyle() { // 进度条按钮追踪
        return `transform:translateX(${this.offset}px)`
      }
    },
    watch: {
      progress(newProgress) {
        this.setOffset(newProgress)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
