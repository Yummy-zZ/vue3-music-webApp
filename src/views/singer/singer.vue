<template>
  <div class="singer" v-loading="!data.length">
    <singer-list :data="data"
                 @select="selectSinger"
    ></singer-list>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component"
                   :data="selectedSinger"
        />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getSingerList } from '@/service/singer' // 拿到歌手列表
import { SINGER_KEY } from '@/assets/js/constant' // sessionStorage存储singer对象
import storage from 'good-storage' // 可存储对象的storage
import SingerList from '@/components/singer-list/singer-list' // 歌手列表

export default {
  name: 'singer',
  data() {
    return {
      data: [],
      selectedSinger: null
    }
  },
  methods: {
    selectSinger(singer) { // 来自singerList的点击事件
      this.selectedSinger = singer
      this.cacheSinger(singer) // sessionStorage存储singer对象(目的是为了在歌手详情页刷新不会报错)
      this.$router.push({
        path: `/singer/detail/${singer.mid}`
      })
    },
    cacheSinger(singer) { // sessionStorage存储singer对象
      storage.session.set(SINGER_KEY, singer)
    }
  },
  components: {
    SingerList
  },
  async created () {
    const result = await getSingerList()
    this.data = result.singers
  }
}
</script>

<style lang="scss" scoped>
  .singer {
    position: fixed;
    top: 88px;
    width: 100%;
    bottom: 0;
  }
</style>
