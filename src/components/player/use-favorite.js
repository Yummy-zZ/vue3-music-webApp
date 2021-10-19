import { computed } from 'vue'
import { useStore } from 'vuex'
import { FAVORITE_KEY } from '../../assets/js/constant'
import { save, remove } from '../../assets/js/array-store'

export default function () {
  // data
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList) // 喜欢歌曲列表
  // methods
  function getFavoriteIcon(currentSong) { // 根据是否在storage变换相应样式
    return isFavorite(currentSong) ? 'icon-favorite' : 'icon-not-favorite'
  }

  function toggleFavorite(currentSong) { // 点击喜欢图标进行增删
    let list // 接收喜欢歌曲数组
    if (isFavorite(currentSong)) {
      list = remove(FAVORITE_KEY, compare) // 已喜欢,删除
    } else {
      list = save(currentSong, FAVORITE_KEY, compare) // 未喜欢,添加
    }
    store.commit('setFavoriteList', list) // 更新喜欢歌曲数组
    function compare(item) { // 比较函数
      return item.id === currentSong.id
    }
  }

  function isFavorite(currentSong) { // 是否是喜欢歌曲
    return favoriteList.value.findIndex((item) => { // 根据喜欢歌曲列表是否能找到对应歌曲
      return item.id === currentSong.id
    }) > -1 // 是否已存在
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
