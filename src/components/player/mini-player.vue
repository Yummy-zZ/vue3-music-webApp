<template>
  <transition name="mini">
    <div
      class="mini-player"
      v-show="!fullScreen"
      @click="showNormalPlayer"
    >
<!--      CD展示-->
      <div class="cd-wrapper">
        <div class="cd"
             ref="cdRef"
        >
          <img ref="cdImageRef"
               width="40"
               height="40"
               :class="cdCls"
               :src="currentSong.pic"
          >
        </div>
      </div>
<!--      歌曲轮播图切换-->
      <div ref="sliderWrapperRef"
           class="slider-wrapper"
      >
        <div class="slider-group">
          <div
            class="slider-page"
            v-for="song in playlist"
            :key="song.id"
          >
  <!--      歌曲名和歌手名-->
            <h2 class="name">{{song.name}}</h2>
            <p class="desc">{{song.singer}}</p>
          </div>
        </div>
      </div>
<!--      播放逻辑-->
  <!--      播放/暂停,进度显示-->
      <div class="control">
        <progress-circle :radius="32"
                         :progress="progress"
        >
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progress-circle>
      </div>
  <!--      播放列表-->
      <div class="control">
        <i class="icon-playlist" @click.stop="showPlaylist"></i>
      </div>
      <playlist ref="playlistRef"></playlist>
    </div>
  </transition>
</template>

<script>
import { useStore } from 'vuex'
import { computed, ref } from 'vue'
// hooks导入
import useCd from './use-cd'
import useMiniSlider from './use-mini-slider'
// 组件导入
import progressCircle from './components/progress-circle'
import Playlist from './playlist'

export default {
  name: 'mini-player',
  components: {
    progressCircle, // 进度效果
    Playlist
  },
  props: {
    progress: {
      type: Number,
      default: 0
    },
    togglePlay: Function
  },
  setup() {
    // data
    const store = useStore()
    const playlistRef = ref(null)
    // computed
    const fullScreen = computed(() => store.state.fullScreen) // 是否满屏
    const currentSong = computed(() => store.getters.currentSong) // 当前歌曲
    const playing = computed(() => store.state.playing) // 播放状态
    const playlist = computed(() => store.state.playlist) // 播放列表
    const miniPlayIcon = computed(() => playing.value ? 'icon-pause' : 'icon-play') // 计算暂停和播放按钮的样式
    // hooks
    const { cdRef, cdCls, cdImageRef } = useCd() // 复用player的轮子
    const { slider, sliderWrapperRef } = useMiniSlider() // 迷你播放器切轮播图换歌曲逻辑
    // methods
    function showNormalPlayer() {
      store.commit('setFullScreen', true)
    }
    function showPlaylist() {
      playlistRef.value.show()
    }
    // 导出
    return {
      // data
      playlistRef,
      // computed
      fullScreen,
      currentSong,
      playing,
      playlist,
      miniPlayIcon,
      // methods
      showNormalPlayer,
      showPlaylist,
      // cd-hooks
      cdRef,
      cdCls,
      cdImageRef,
      // slider-hooks
      slider,
      sliderWrapperRef
    }
  }
}
</script>

<style lang="scss" scoped>
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 20px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    line-height: 20px;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        width: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme;
      font-size: 32px;
    }
  }
  &.mini-enter-active, &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from, &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0)
  }
}
</style>
