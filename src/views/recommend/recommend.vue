<template>
  <div class="recommend" v-loading="loading">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <albums :albums="albums"
                :loading="loading"
                @selectAlbum="selected"
        ></albums>
      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component"
                   @selectedAlbum="selected"
                   :data="selectedAlbum"
        />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { getRecommend } from '../../service/recommend'
import Slider from '../../components/base/slider/slider'
import Scroll from '../../components/wrap-scroll'
import Albums from './components/albums'
import storage from 'good-storage'
import { ALBUM_KEY } from '@/assets/js/constant'

export default {
  name: 'recommend',
  emits: ['selectedAlbum'],
  data() {
    return {
      sliders: [],
      albums: [],
      selectedAlbum: null // album数据
    }
  },
  methods: {
    // album的点击逻辑
    selected(album) {
      this.selectedAlbum = album
      this.cacheSinger(album) // sessionStorage存储singer对象(目的是为了在歌手详情页刷新不会报错)
      this.$router.push({
        path: `/recommend/detail/${album.id}`
      })
    },
    // album的点击逻辑
    cacheSinger(album) { // sessionStorage存储singer对象
      storage.session.set(ALBUM_KEY, album)
    }
  },
  computed: {
    loading() {
      return !this.sliders.length && !this.albums.length // 轮播图和推荐栏都没有加载完成时,loading为true
    }
  },
  components: {
    Slider,
    Scroll,
    Albums
  },
  async created () {
    const result = await getRecommend()
    this.sliders = result.sliders
    this.albums = result.albums
  }
}
</script>

<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
