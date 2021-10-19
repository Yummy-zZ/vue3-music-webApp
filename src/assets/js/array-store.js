import storage from 'good-storage'

function insertSong(storageSongs, currentSong, compare) { // 当前歌曲加入喜欢storage
  const index = storageSongs.findIndex(compare) // 拿到歌曲storage数据
  if (index > -1) return // 已有歌曲,返回
  storageSongs.unshift(currentSong) // 加入目前的歌曲
}
function removeSong(storageSongs, compare) { // 移除歌曲
  const index = storageSongs.findIndex(compare) // 拿到歌曲storage数据
  if (index > -1) {
    storageSongs.splice(index, 1)
  }
}
export function save(currentSong, key, compare) {
  const storageSongs = storage.get(key, []) // 拿到localStorage里的歌曲
  insertSong(storageSongs, currentSong, compare) // 插入
  storage.set(key, storageSongs) // 写入
  return storageSongs
}
export function remove(key, compare) {
  const storageSongs = storage.get(key, []) // 拿到localStorage里的歌曲
  removeSong(storageSongs, compare) // 删除
  storage.set(key, storageSongs)
  return storageSongs
}
// 刷新时让vuex里的favoriteList加载localStorage数据
export function load(key) {
  return storage.get(key, [])
}

export function saveAll(songs, key) {
  storage.set(key, songs)
}
