<template>
  <div class="detail-list"
       v-loading="loading"
  >
<!--    返回图标    -->
    <div
      class="back"
      @click="goBack"
    >
      <i class="icon-back"></i>
    </div>
<!--   歌手名    -->
    <h1 class="title">{{ title }}</h1>
<!--    图片    -->
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
      v-if="!loading"
    >
  <!--    随机播放    -->
      <div
        class="play-btn-wrapper"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
  <!--    图片滤镜    -->
      <div
        class="filter"
      ></div>
    </div>
<!--    歌曲列表    -->
    <scroll class="list"
            :style="scrollStyle"
            :probeType="3"
            @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list :songs="songs"
                   @select="selectedSong"
                   :rank="rank"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from '@/components/base/song-list/song-list'
  import Scroll from '@/components/wrap-scroll'
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'music-list',
    components: {
      SongList,
      Scroll
    },
    props: {
      // 歌曲数据
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      title: String, // 歌手名
      pic: String, // 图片
      loading: Boolean, // 加载效果
      rank: Boolean
    },
    data() {
      return {
        scrollY: 0 // 滚动位置Y
      }
    },
    methods: {
      goBack() {
        this.$router.back() // 返回上层级
      },
      onScroll(pos) {
        this.scrollY = -pos.y // 拿到歌曲list滚动位置Y
      },
      selectedSong({ song, index }) { // 收集到歌曲列表和索引派发给actions
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      random() {
        this.randomPlay(this.songs)
      },
      ...mapActions([ // 派发actions
        'selectPlay',
        'randomPlay'
      ])
    },
    computed: {
      bgImageStyle() { // 背景图片样式
        const scrollY = this.scrollY // 滚动位置
        let scale = 1
        if (scrollY < 0) {
          scale = 1 + Math.abs(scrollY / this.imageHeight) // 列表下拖图片放大效果
        }
        return {
          backgroundImage: `url(${this.pic})`, // 图片展示
          transform: `scale(${scale})` // 列表下拖图片放大效果
        }
      },
      imageHeight() { // 图片高度
        return this.$refs.bgImage.offsetHeight
      },
      scrollStyle() {
        const bottom = this.playlist.length ? '60px' : '0'
        return {
          bottom
        }
      },
      ...mapState(['playlist'])
    }
  }
</script>

<style lang="scss" scoped>
  .detail-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 3px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-theme;
    }
    .bg-image {
      position: relative;
      height: $image-height;
      transform-origin: top;
      background-size: 100%;
      background-repeat: no-repeat;
      border-left: 1px solid #ffcd32;
      border-right: 1px solid #ffcd32;
      border-bottom: 5px solid #ffcd32;
      border-radius: 0 0 30px 30px;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        padding: 0 2px 10px 2px;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      position: absolute;
      top: $image-height - 5px;
      bottom: 0;
      width: 100%;
      z-index: 0;
      margin-top: 10px;
      .song-list-wrapper {
        padding: 10px 30px;
        background: $color-background;
      }
    }
  }
</style>
