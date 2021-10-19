<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
      <div
        class="normal-player"
        v-show="fullScreen"
      >
  <!--      歌曲背景-->
        <div class="background">
          <img :src="currentSong.pic">
        </div>
  <!--      歌曲顶部栏-->
        <div class="top">
          <div
            class="back"
            @click="goBack"
          >
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
  <!--      歌曲中部-->
        <div class="middle"
             @touchstart.prevent="onMiddleTouchStart"
             @touchmove.prevent="onMiddleTouchMove"
             @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="middle-l" :style="middleLStyle">
    <!--          CD-->
            <div class="cd-wrapper" ref="cdWrapperRef">
              <div class="cd"
                   ref="cdRef"
              >
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic">
              </div>
            </div>
    <!--          cd下歌词-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
    <!--        单独歌词部分-->
          <scroll class="middle-r" ref="lyricScrollRef" :style="middleRStyle">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{'current': currentLineNum ===index}"
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{line.txt}}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
  <!--      歌曲底部栏-->
        <div class="bottom">
    <!--        歌词切换的点-->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
    <!--          进度条-->
          <div class="progress-wrapper">
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :progress="progress"
                            @progress-changing="onProgressChanging"
                            @progress-changed="onProgressChanged"
                            ref="progressBarRef"
              ></progress-bar>
            </div>
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <div class="operators">
    <!--          播放模式-->
            <div class="icon i-left">
              <i
                 @click="changeMode"
                 :class="modeIcon"
              ></i>
            </div>
    <!--          上一首-->
            <div class="icon i-left" :class="disableCls">
              <i @click="prevSong" class="icon-prev"></i>
            </div>
    <!--          播放/暂停-->
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
    <!--          下一首-->
            <div class="icon i-right" :class="disableCls">
              <i @click="nextSong" class="icon-next"></i>
            </div>
    <!--          我喜欢-->
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)"
                 :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!--    迷你播放器-->
    <mini-player :progress="progress"
                 :togglePlay="togglePlay"
    ></mini-player>
<!--    播放器-->
    <audio ref="audioRef"
           @pause="pause"
           @canplay="ready"
           @error="error"
           @timeupdate="updateTime"
           @ended="songEnd"
    ></audio>
  </div>
</template>

<script>
  import { useStore } from 'vuex'
  import { computed, nextTick, ref, watch } from 'vue'
  import { PLAY_MODE } from '../../assets/js/constant'
  // 辅助模块
  import { formatTime } from '../../assets/js/util'
  // hooks导入
  import useMode from './use-mode'
  import useFavorite from './use-favorite'
  import useCd from './use-cd'
  import useLyric from './use-lyric'
  import useMiddleInteractive from './use-middle-interactive'
  import useAnimation from './use-animation'
  import usePlayHistory from './use-play-history'
  // 组件导入
  import ProgressBar from './components/progress-bar'
  import Scroll from '../base/scroll/scroll'
  import miniPlayer from './mini-player'

  export default {
    name: 'player',
    components: {
      ProgressBar,
      Scroll,
      miniPlayer
    },
    setup() {
      const store = useStore() // 组合式API使用store方式
// —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      // 非响应式data
      let progressChanging = false // 是否正在拖动
// —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      // data
      const audioRef = ref(null) // 播放器ref
      const songReady = ref(false) // 歌曲是否缓存好了
      const currentTime = ref(null) // 目前播放时间
      const progressBarRef = ref(null)
// —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      // computed
      const fullScreen = computed(() => store.state.fullScreen) // 计算是否全屏
      const currentSong = computed(() => store.getters.currentSong) // 计算当前歌曲
      const playing = computed(() => store.state.playing) // 计算是否正在播放
      const playIcon = computed(() => playing.value ? 'icon-pause' : 'icon-play') // 计算暂停和播放按钮的样式
      const currentIndex = computed(() => store.state.currentIndex) // 当前歌曲索引
      const playlist = computed(() => store.state.playlist) // 歌曲列表
      const disableCls = computed(() => songReady.value ? '' : 'disable') // 未缓存时的样式
      const progress = computed(() => currentTime.value / currentSong.value.duration) // 歌曲当前时间戳,duration是歌曲长度s
// —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      // hooks
      const { modeIcon, changeMode } = useMode() // 改变播放模式
      const { getFavoriteIcon, toggleFavorite } = useFavorite()
      const { cdCls, cdRef, cdImageRef } = useCd() // cd样式动态变化
      const { currentLyric, currentLineNum, playLyric, lyricScrollRef, playingLyric, lyricListRef, stopLyric, pureMusicLyric } =
        useLyric({ songReady, currentTime }) // 歌词
      const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()
      const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()
      const { savePlay } = usePlayHistory()
// —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      // watch
      watch(currentSong, (newSong) => { // 获取当前歌曲
        if (!newSong.id || !newSong.url) return // 歌曲不存在返回
        songReady.value = false // 歌曲变化需要缓冲
        const audioEl = audioRef.value // 拿到当前歌曲元素
        audioEl.src = newSong.url // 歌曲的url赋值给audio
        audioEl.play() // 播放
        store.commit('setPlayingState', true)
      })
      watch(playing, (isPlaying) => {
        if (!songReady.value) return // 如果歌曲还未缓冲则返回
        const audioEl = audioRef.value // 拿到播放器的元素
        if (isPlaying) { // 歌词暂停与否
          audioEl.play()
          playLyric()
        } else {
          audioEl.pause()
          stopLyric()
        }
      })
      watch(fullScreen, async (newFull) => { // 全屏更新进度条
        await nextTick()
        console.log(progressBarRef)
        if (newFull) {
          progressBarRef.value.setOffset(progress.value)
        }
      })
// —————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
      // methods
      function goBack() { // 退出全屏
        store.commit('setFullScreen', false)
      }
      function togglePlay() { // 播放和暂停
        if (!songReady.value) return // 歌曲列表长度为0 返回
        store.commit('setPlayingState', !playing.value)
      }
      function pause() { // 当休眠时歌曲自动暂停需要将playing修改为false
        store.commit('setPlayingState', false)
      }
      function prevSong() { // 切换上一首歌
        let index = currentIndex.value // 当前歌曲索引值
        const listLength = playlist.value.length // 当前歌曲长度
        if (!songReady.value || !listLength) return // 歌曲列表长度为0 返回
        index-- // 上一首
        if (index < 0) index = listLength - 1 // 第一首退回到最后一首
        if (!playing.value) store.commit('setPlayingState', true) // 切换上一首自动播放
        store.commit('setCurrentIndex', index)
      }
      function nextSong() { // 切换下一首歌
        let index = currentIndex.value // 当前歌曲索引值
        const listLength = playlist.value.length // 歌曲列表长度
        if (!songReady.value || !listLength) return // 歌曲列表长度为0 返回
        index++ // 下一首
        if (index === listLength) index = 0 // 最后一首退回到第一首
        if (!playing.value) store.commit('setPlayingState', true) // 切换下一首自动播放
        store.commit('setCurrentIndex', index)
      }
      function loopSong() { // 循环播放
        const audioEl = audioRef.value
        audioEl.play()
        store.commit('setPlayingState', true)
      }
      function ready() {
        if (songReady.value) return // 歌曲已经缓存好了
        songReady.value = true // 设置歌曲缓存为true
        playLyric() // 执行播放
        savePlay(currentSong.value) // 歌曲记录到播放历史
      }
      function error() {
        songReady.value = true
      }
      function updateTime(e) { // 更新currentTime
        if (!progressChanging) {
          currentTime.value = e.target.currentTime
        }
      }
      function onProgressChanging(progress) { // 拖动进度条
        progressChanging = true // 设置优先级高于update
        currentTime.value = currentSong.value.duration * progress
        playLyric() // 进度条随着进度位置改变
        stopLyric()
      }
      function onProgressChanged(progress) { // 进度条位置改变
        progressChanging = false
        audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress // 改变进度
        playLyric()
      }
      function songEnd() {
        const playMode = computed(() => store.state.playMode) // 播放模式
        if (playMode.value === PLAY_MODE.loop) {
          loopSong()
        } else {
          nextSong()
        }
      }
      return {
        // middle-interactive
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd,
        // hooks-lyric-data
        currentLyric,
        currentLineNum,
        pureMusicLyric,
        playingLyric,
        lyricScrollRef,
        lyricListRef,
        // hooks-mode-data
        modeIcon,
        // hooks-mode-methods
        changeMode,
        // hooks-favorite-methods
        getFavoriteIcon,
        toggleFavorite,
        // hooks-cd-data
        cdCls,
        cdRef,
        cdImageRef,
        // hooks-animation
        cdWrapperRef,
        enter,
        afterEnter,
        leave,
        afterLeave,
        // data
        audioRef,
        songReady,
        currentTime,
        playlist,
        progressBarRef,
        // computed
        fullScreen,
        currentSong,
        playing,
        playIcon,
        disableCls,
        progress,
        // methods
        goBack,
        togglePlay,
        pause,
        prevSong,
        nextSong,
        ready,
        error,
        updateTime,
        formatTime,
        onProgressChanging,
        onProgressChanged,
        songEnd
      }
    }
  }
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);
        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 50px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }
  }
</style>
