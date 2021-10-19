import BScroll from '@better-scroll/core'
import slider from '@better-scroll/slide'
import { computed, nextTick, onActivated, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

BScroll.use(slider)

export default function () {
  // data
  const store = useStore()
  const sliderWrapperRef = ref(null)

  // computed
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const currentIndex = computed(() => store.state.currentIndex)
  const miniIsShow = computed(() => { // 迷你歌曲是否已经展示
    return !fullScreen.value && !!playlist.value
  })

  // 生命周期钩子
  onMounted(() => {
    let sliderVal
    watch(miniIsShow, async (newShow) => { // 观察miniShow是否已经展示
      if (newShow) {
        await nextTick()
        if (!sliderVal) {
          // 获取BScroll实例
          sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
            click: true,
            scrollX: true,
            scrollY: false,
            momentum: false,
            bounce: false,
            probeType: 2,
            slide: {
              autoplay: false,
              loop: true
            }
          })
          // 修改当前歌曲索引值,并设置播放状态为true
          sliderVal.on('slidePageChanged', ({ pageX }) => { // slidePageChanged(BScroll的slider插件的方法,可以检测到当前轮播图的索引值)
            store.commit('setCurrentIndex', pageX)
            // store.commit('setPlayingState', true)
          })
        } else { // 重新计算 BetterScroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
          sliderVal.refresh()
        }
        // 滚动到对应索引
        sliderVal.goToPage(currentIndex.value, 0, 0)
      }
    })
    // 歌曲索引值变化,轮播图到对应位置
    watch(currentIndex, (newIndex) => {
      if (sliderVal && miniIsShow.value) {
        sliderVal.goToPage(newIndex, 0, 0)
      }
    })
    // 歌曲列表变化轮播图重新计算
    watch(playlist, async (newList) => {
      if (sliderVal && miniIsShow.value && newList.length) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })
  onUnmounted(() => {
    if (slider.value) {
      slider.value.destroy()
    }
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
    sliderWrapperRef
  }
}
