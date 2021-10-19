<template>
  <div class="singer-detail">
    <h1>歌手详情页</h1>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'

export default {
  name: 'singerDetail',
  props: {
    singer: Object
  },
  async created () {
    const detail = await getSingerDetail(this.singer)
    const songs = await processSongs(detail.songs)
    console.log(detail)
    console.log(songs)
  }
}
</script>

<style lang="scss" scoped>
// 覆盖歌手页面
.singer-detail {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
