import { useStore } from 'vuex'
import { computed, ref, watch } from 'vue'

export default function useCd() {
  const store = useStore()
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const playing = computed(() => store.state.playing)
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })
  watch(playing, (newVal) => {
    if (!newVal) { // 不旋转的时候改变角度
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })
  function syncTransform(wrapper, inner) {
    const wrapperTransform = getComputedStyle(wrapper).transform // 外层旋转角度
    const innerTransform = getComputedStyle(inner).transform // 内层旋转角度
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform
      : innerTransform + wrapperTransform // 计算出旋转角度
  }
  return {
    cdCls,
    cdRef,
    cdImageRef
  }
}
