import { computed } from 'vue'
import { useStore } from 'vuex'
import { PLAY_MODE } from '../../assets/js/constant'

export default function () {
  const store = useStore()
  // computed
  const playMode = computed(() => store.state.playMode) // 播放模式
  const modeIcon = computed(() => { // 模式图标改变
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random ? 'icon-random' : 'icon-loop'
  })
  const modeText = computed(() => { // 模式图标改变
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence ? '顺序播放'
      : playModeVal === PLAY_MODE.random ? '随机播放' : '单曲循环'
  })
  // methods
  function changeMode() { // 切换播放模式
    const mode = (playMode.value + 1) % 3
    store.dispatch('changeMode', mode)
  }
  return {
    // computed
    modeIcon,
    modeText,
    // methods
    changeMode
  }
}
