import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export function selectPlay({ commit }, { list, index }) { // 点击某个歌手的歌曲时,将歌曲加入播放列表
  commit('setPlayingState', true)
  commit('setSequenceList', list)
  commit('setPlaylist', list)
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setCurrentIndex', index)
  commit('setFullScreen', true)
}

export function randomPlay({ commit }, list) { // 点击随机播放全部,将歌曲播放列表打乱顺序
  commit('setPlayingState', true)
  commit('setSequenceList', list) // 顺序播放列表
  commit('setPlaylist', shuffle(list)) // playlist修改成随机列表
  commit('setPlayMode', PLAY_MODE.random)
  commit('setCurrentIndex', 0)
  commit('setFullScreen', true)
}

export function changeMode({ commit, state, getters }, mode) {
  const currentId = getters.currentSong.id
  if (mode === PLAY_MODE.random) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex((song) => song.id === currentId)
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function removeSong({ commit, state }, index) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  if (currentIndex > index) currentIndex-- // 如果删除了当前歌曲前面的歌曲,则当前索引需要--
  playlist.splice(index, 1) // 删除当前播放列表的in歌曲
  sequenceList.splice(index, 1) // 删除顺序播放列表的歌曲
  commit('setCurrentIndex', currentIndex)
  commit('setPlaylist', playlist)
  commit('setSequenceList', sequenceList)
  if (!playlist.length) commit('setPlayingState', false)
}

export function clearPlaylist({ commit }) {
  commit('setPlaylist', [])
  commit('setSequenceList', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

export function addSong({ commit, state }, song) {
  const playlist = state.playlist.slice() // 当前歌曲列表
  const sequenceList = state.sequenceList.slice() // 顺序列表
  let currentIndex = state.currentIndex // 当前播放歌曲索引
  const playIndex = findIndex(playlist, song) // 点击的歌曲索引

  if (playIndex > -1) { // 点击索引大于-1
    currentIndex = playIndex // 修改当前索引
  } else { // 未在列表中找到歌曲
    playlist.push(song) // 存入歌曲
    currentIndex = playlist.length - 1 // 播放最后一首
  }

  const sequenceIndex = findIndex(sequenceList, song) // 顺序列表中歌曲的索引
  if (sequenceIndex === -1) { // 未找到歌曲
    sequenceList.push(song) // 加入歌曲
  }
  // 修改歌曲状态
  commit('setSequenceList', sequenceList)
  commit('setPlaylist', playlist)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}
