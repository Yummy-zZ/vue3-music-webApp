import { get } from './base'

// 拿到歌曲url
export function processSongs(songs) {
  if (!songs.length) {
    return Promise.resolve(songs)
  }
  return get('/api/getSongsUrl', {
    mid: songs.map(song => {
      return song.mid
    })
  }).then((result) => {
    const map = result.map
    return songs.map(song => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

const lyricMap = {} // 存储歌曲mid -> lyric
export function getLyric(song) {
  if (song.lyric) return Promise.resolve(song.lyric) // 歌曲有缓存歌词直接返回,与下面的不矛盾,因为可能对象不相等,但mid相等(例如歌单的歌曲和歌手的歌曲)
  const mid = song.mid
  const lyric = lyricMap[mid] // 拿到lyric
  if (lyric) { // 存在返回
    return Promise.resolve(lyric)
  }
  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric // 存储歌曲mid -> lyric
    return lyric
  })
}
