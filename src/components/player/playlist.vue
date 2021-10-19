<template>
  <teleport to="body">
    <transition name="list-fade">
      <div
        class="playlist"
        v-show="visible && playlist.length"
        @click="hide"
      >
<!--        整个列表-->
        <div class="list-wrapper" @click.stop>
<!--          列表头部-->
          <div class="list-header">
            <h1 class="title">
  <!--              修改模式-->
              <i class="icon"
                 :class="modeIcon"
                 @click.stop="changeMode"
              ></i>
              <div class="text">
                <div class="innerText" @click.stop="changeMode">{{modeText}}</div>
              </div>
  <!--              清除列表-->
              <span class="clear" @click="confirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
  <!--          歌曲列表-->
          <scroll class="list-content" ref="scrollRef">
            <transition-group ref="listRef"
                              name="list"
                              tag="ul"
            >
              <li
                class="item"
                v-for="(song, index) in sequenceList"
                :key="song.id"
                @click="selectItem(index)"
              >
                <i class="current"
                   :class="getCurrentIcon(song)"
                ></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete"
                      @click.stop="removeSong(index)"
                      :class="{'disable': removing}"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
<!--          关闭列表-->
          <div class="list-footer" @click.stop="hide">
            <span>关闭</span>
          </div>
        </div>
<!--        确认警告-->
        <confirm
          ref="confirmRef"
          @confirm="confirmClear"
          text="是否清空播放列表？"
          confirm-btn-text="清空"
        ></confirm>
      </div>
    </transition>
  </teleport>
</template>

<script>
import { useStore } from 'vuex'
import { computed, nextTick, ref, watch } from 'vue'
// 组件导入
import Scroll from '../base/scroll/scroll'
import Confirm from '../base/confirm/confirm'
// hooks导入
import useMode from './use-mode'
import useFavorite from './use-favorite'

export default {
  name: 'playlist',
  components: {
    Scroll,
    Confirm
  },
  setup() {
    const store = useStore()
    // data
    const visible = ref(false) // 是否可见
    const scrollRef = ref(null)
    const listRef = ref(null)
    const removing = ref(false) // 是否正在移除
    const confirmRef = ref(null)
    // computed
    const sequenceList = computed(() => store.state.sequenceList)
    const playlist = computed(() => store.state.playlist)
    const currentSong = computed(() => store.getters.currentSong)
    // watch
    watch(currentSong, async (newSong) => {
      if (!visible.value || newSong) return
      await nextTick()
      scrollToCurrentSong()
    })
    // hooks
    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    // methods
    function getCurrentIcon(song) {
      if (song.id === currentSong.value.id) {
        return 'icon-play'
      }
    }
    async function show() {
      visible.value = true
      await nextTick()
      refreshScroll() // 重新渲染scroll
      scrollToCurrentSong()
    }
    function hide() {
      visible.value = false
    }
    function refreshScroll() {
      scrollRef.value.scroll.refresh()
    }
    function scrollToCurrentSong() {
      const index = playlist.value.findIndex((item) => currentSong.value.id === item.id) // 拿到当前歌曲index
      if (index === -1) {
        return
      }
      const targetEl = listRef.value.$el.children[index] // 拿到当前播放元素
      scrollRef.value.scroll.scrollToElement(targetEl, 300) // 滚动到对应元素
    }
    function selectItem(index) {
      store.commit('setCurrentIndex', index)
    }
    function removeSong(index) {
      if (removing.value) return
      removing.value = true
      store.dispatch('removeSong', index)
      if (!playlist.value.length) hide() // 下次播放不会弹出
      setTimeout(() => {
        removing.value = false
      }, 300)
    }
    function confirm() {
      confirmRef.value.show()
    }
    function confirmClear() {
      store.dispatch('clearPlaylist') // 清空列表
      hide() // 下次播放不会弹出
    }
    return {
      // data
      visible,
      scrollRef,
      listRef,
      removing,
      confirmRef,
      // computed
      sequenceList,
      playlist,
      currentSong,
      // methods
      getCurrentIcon,
      show,
      hide,
      selectItem,
      removeSong,
      confirm,
      confirmClear,
      // hooks-mode
      modeIcon,
      modeText,
      changeMode,
      // hooks-favorite
      getFavoriteIcon,
      toggleFavorite
    }
  }
}
</script>

<style lang="scss" scoped>
.playlist {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active {
    transition: opacity .3s;
    .list-wrapper {
      transition: all .3s;
    }
  }
  &.list-fade-enter-from, &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .list-wrapper {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .list-header {
      position: relative;
      padding: 20px 30px 10px 20px;
      .title {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 10px;
          font-size: 24px;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          display: block;
          width: 50px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .innerText {
            width: 60px;
          }
        }
        .clear {
          @include extend-click();
          .icon-clear {
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content {
      max-height: 240px;
      overflow: hidden;
      .item {
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .current {
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text {
          flex: 1;
          @include no-wrap();
          font-size: $font-size-medium;
          color: $color-text-d;
        }
        .favorite {
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
        .delete {
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto 30px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer {
      text-align: center;
      line-height: 50px;
      background: $color-background;
      font-size: $font-size-medium-x;
      color: $color-text-l;
    }
  }
}
</style>
