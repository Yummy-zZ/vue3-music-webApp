import { useStore } from 'vuex'
import { computed, watch } from 'vue'
import { getLyric } from '../../../service/song'
// import Lyric from 'lyric-parser' // 歌词解析

export default function useLyric() {
  // const currentLyric = ref(null) // 当前歌词
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)
  watch(currentSong, async (newSong) => {
    if (!newSong.url || !newSong.id) return
    const lyric = await getLyric(newSong) // 拿到歌词
    store.commit('addSongLyric', { // 当前歌曲对象添加一个lyric属性存放歌词
      song: newSong,
      lyric
    })
    // if (currentSong.value.lyric !== lyric) { // 切换歌曲,但歌词未加载完
    //   return
    // }
    // currentLyric.value = new Lyric(lyric, handleLyric) // 解析歌词
  })
}
