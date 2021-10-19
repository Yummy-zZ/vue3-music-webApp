<template>
  <scroll class="singer-list"
          :probeType="3"
          @scroll="onScroll"
          ref="scrollRef"
  >
    <!--  歌手列表  -->
    <ul ref="groupRef">
      <li class="group"
          v-for="group in data"
          :key="group.title"
      >
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li class="item"
              v-for="item in group.list"
              :key="item.id"
              @click="onItemClick(item)"
          >
            <img class="avatar"
                 :src="item.pic"
                 :alt="item.name"
                 v-lazy="item.pic"
            >
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!--  顶部固定栏  -->
    <div class="fixed"
         v-show="fixedTitle"
         :style="fixedStyle"
    >
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <!--  右边字母表  -->
    <div
      class="shortcut"
    >
      <ul @touchstart.stop.prevent="onShortcutTouchStart"
          @touchmove.stop.prevent="onShortcutTouchMove"
          @touchend.stop.prevent
      >
        <li
          class="item"
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          :class="{'current':currentIndex===index}"
        >
          {{item}}
        </li>
      </ul>
    </div>

  </scroll>
</template>

<script>
import Scroll from '../scroll/scroll'
import useFixed from './use-fixed'
import useShortcut from './use-shortcut'

export default {
  name: 'singer-list',
  components: { Scroll },
  emits: ['select'],
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup(props, { emit }) {
    const { groupRef, listHeights, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)
    const { shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove } = useShortcut(props, groupRef)
    // 歌手数据传递给detail页面
    function onItemClick(item) {
      emit('select', item)
    }
    return {
      onItemClick,
      // fixed
      groupRef,
      listHeights,
      onScroll,
      fixedTitle,
      fixedStyle,
      currentIndex,
      // shortcut
      shortcutList,
      scrollRef,
      onShortcutTouchStart,
      onShortcutTouchMove
    }
  }
}
</script>

<style lang="scss" scoped>
  .singer-list {
    position: relative;
    overflow: hidden;
    height: 100%;
    width: 100%;
    .group {
      overflow: hidden;
      padding-bottom: 30px;
      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 2px ridge $color-theme;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    .fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
    .shortcut {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      //background: $color-background;
      font-family: Helvetica;
      .item {
        padding: 5px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current {
          color: $color-theme
        }
      }
    }
  }
</style>
