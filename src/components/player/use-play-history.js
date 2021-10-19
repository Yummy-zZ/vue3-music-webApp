import { useStore } from 'vuex'
import { PLAYED_KEY } from '@/assets/js/constant'
import { save } from '@/assets/js/array-store'

export default function usePlayHistory() {
  const store = useStore()

  const maxLen = 100

  function savePlay(song) {
    const songs = save(song, PLAYED_KEY, (item) => {
      return item.id === song.id
    }, maxLen)

    store.commit('setPlayHistory', songs)
  }

  return {
    savePlay
  }
}
