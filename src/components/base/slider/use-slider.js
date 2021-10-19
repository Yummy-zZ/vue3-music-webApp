import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(Slide)

export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)

  onMounted(() => {
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      click: true, // 能点击勒
      scrollX: true, // 横向dots
      scrollY: false,
      momentum: false, // 避免页面快速滑动闪烁和滚动多页问题
      bounce: false, // 防止循环衔接时闪烁
      probeType: 2, // 获取pageIndex的改变
      slide: {
        loop: true,
        threshold: 0.1, // 切换上下页的阈值
        speed: 1680,
        listenFlick: true, // 轻抚过 slide 区域时，会触发上下页切换
        easing: 'easy-out', // transition-timing-function
        autoplay: true,
        interval: 2880
      }
    })

    sliderVal.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    slider.value.destroy() // 销毁轮播图
  })

  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    currentPageIndex
  }
}
