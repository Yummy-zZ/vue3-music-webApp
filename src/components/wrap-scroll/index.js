import Scroll from '../base/scroll/scroll'
import { useStore } from 'vuex'
import { h, mergeProps, withCtx, renderSlot, computed, nextTick, ref, watch } from 'vue'

export default {
  name: 'wrap-scroll',
  /**
   *相当于模板
   * <template>
       <scroll @scroll="emit('scroll', $event)"
       ref="scrollRef"
       v-bind="$props" // 拿到scroll组件对应props
       ></scroll>
       <slot></slot>
     </template>
   */
  render(ctx) {
    return h(Scroll, mergeProps({
      ref: 'scrollRef'
    }, ctx.$props, {
      onScroll: (e) => {
        ctx.$emit('scroll', e)
      }
    }), {
      default: withCtx(() => {
        return [renderSlot(ctx.$slots, 'default')]
      })
    })
  },
  setup() {
    const store = useStore()
    const scrollRef = ref(null)
    const scroll = computed(() => scrollRef.value.scroll)
    const playlist = computed(() => store.state.playlist) // 歌曲列表
    watch(playlist, async () => {
      await nextTick() // dom加载完
      scroll.value.refresh()
    })
    return {
      scrollRef,
      scroll
    }
  }
}
