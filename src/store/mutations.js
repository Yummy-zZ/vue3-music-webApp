export const mutations = {
  setPlayingState(state, playing) { // 修改是否正在播放
    state.playing = playing
  },
  setSequenceList(state, list) { // 修改顺序播放顺序
    state.sequenceList = list
  },
  setPlaylist(state, list) { // 修改当前播放列表
    state.playlist = list
  },
  setPlayMode(state, mode) { // 修改播放模式
    state.playMode = mode
  },
  setCurrentIndex(state, index) { // 修改当前索引
    state.currentIndex = index
  },
  setFullScreen(state, fullScreen) { // 修改是否满屏
    state.fullScreen = fullScreen
  },
  setFavoriteList(state, list) { // 修改喜欢列表
    state.favoriteList = list
  },
  addSongLyric(state, { song, lyric }) { // 添加歌词
    state.playlist.map(item => {
      if (song.mid === item.mid) {
        item.lyric = lyric
      }
      return item
    })
  },
  setPlayHistory(state, songs) { // 添加历史播放列表
    state.playHistory = songs
  }
}
