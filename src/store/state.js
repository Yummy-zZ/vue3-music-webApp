import { PLAY_MODE } from '../assets/js/constant'

export const state = {
  playing: false, // 是否正在播放
  sequenceList: [], // 顺序播放列表
  playlist: [], // 正在播放的列表
  playMode: PLAY_MODE, // 播放模式 1.顺序2.单曲循环3.随机
  currentIndex: 0, // 目前播放歌曲的索引值
  fullScreen: false, // 是否全屏
  favoriteList: [], // 我喜欢列表
  playHistory: [] // 播放历史
}
