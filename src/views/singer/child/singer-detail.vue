<template>
  <div class="singer-detail">
    <detail-list :title="title"
                :pic="pic"
                :songs="songs"
                :loading="loading"
    ></detail-list>
  </div>
</template>

<script>
import { getSingerDetail } from '@/service/singer'
import { SINGER_KEY } from '@/assets/js/constant' // sessionStorage存储singer对象
import createDetailComponent from '@/assets/js/create-detail-component' // 逻辑封装

export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
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
