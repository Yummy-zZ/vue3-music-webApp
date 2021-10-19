import { useStore } from 'vuex'
import { computed, watch, ref } from 'vue'
import { getLyric } from '../../service/song'
import Lyric from 'lyric-parser' // 歌词解析

export default function useLyric({ songReady, currentTime }) {
  const store = useStore()
  // data
  const currentLyric = ref(null) // 当前歌词
  const currentLineNum = ref(0) // 当前行号
  const lyricScrollRef = ref(null) // ref
  const lyricListRef = ref(null) // ref
  const pureMusicLyric = ref('') // 无歌词
  const playingLyric = ref('') // cd页面txt歌词
  // computed
  const currentSong = computed(() => store.getters.currentSong)
  // watch
  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) return
    // 切歌将清除以下逻辑
    stopLyric()
    currentLyric.value = null // 当前歌词
    currentLineNum.value = 0 // 当前行号
    pureMusicLyric.value = '' // 纯音乐歌词
    playingLyric.value = null // cd页面txt歌词

    const lyric = await getLyric(newSong) // 拿到歌词
    store.commit('addSongLyric', { // 当前歌曲添加一个lyric属性存放歌词
      song: newSong,
      lyric
    })
    if (currentSong.value.lyric !== lyric) { // 切换歌曲,但歌词未加载完
      return
    }
    currentLyric.value = new Lyric(lyric, handleLyric) // 解析歌词
    const hasLyric = currentLyric.value.lines.length
    if (hasLyric) {
      if (songReady.value) {
        playLyric()
      }
    } else {
      pureMusicLyric.value = lyric.replace(/\[(\d{2}):(\d{2}):(\d{2})\]/g, '')
    }
  })
  // methods
  function handleLyric({ lineNum, txt }) { // 解析歌词
    currentLineNum.value = lineNum // 当前行号
    playingLyric.value = txt // cd页面txt歌词
    const scrollCom = lyricScrollRef.value // scroll的Ref
    const listEl = lyricListRef.value // 歌词的Ref
    if (!listEl) { // 如果没有歌词直接return
      return
    }
    if (lineNum > 7) { // 高亮歌词居中
      const lineEl = listEl.children[lineNum - 7] // 拿到偏移位置元素
      scrollCom.scroll.scrollToElement(lineEl, 1000) // 滚动到偏移位置是歌词居中
    } else {
      scrollCom.scroll.scrollTo(0, 0, 1000)
    }
  }
  function playLyric() { // 播放歌词
    const currentLyricVal = currentLyric.value // 拿到当前歌词
    if (currentLyricVal) {
      currentLyricVal.seek(currentTime.value * 1000) // 找到对应事件并播放
    }
  }
  function stopLyric() { // 暂停歌词
    const currentLyricVal = currentLyric.value // 拿到当前歌词
    if (currentLyricVal) {
      currentLyricVal.stop() // 停止播放
    }
  }

  return {
    currentLyric,
    currentLineNum,
    pureMusicLyric,
    playingLyric,
    playLyric,
    stopLyric,
    lyricScrollRef,
    lyricListRef
  }
}
