import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'
BScroll.use(ObserveDOM)

export function useScroll(rootRef, options, emit) {
  const scroll = ref(null)
  onMounted(() => {
    const scrollVal = scroll.value = new BScroll(rootRef.value, {
      observeDOM: true,
      ...options
    })
    if (options.probeType > 0) { // 1|2|3 越大监听效果越明显
      scrollVal.on('scroll', (pos) => { // BScroll返回的值能进行事件监听,pos有滚动时x,y值
        emit('scroll', pos)
      })
    }
  })
  onUnmounted(() => {
    scroll.value.destroy()
  })
  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })
  return scroll
}
