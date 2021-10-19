<template>
  <div class="recommend-list">
    <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
    <ul>
      <li
        class="item"
        v-for="item in albums"
        :key="item.id"
        @click="selectAlbum(item)"
      >
        <div class="icon">
          <img width="60" height="60" v-lazy="item.pic">
        </div>
        <div class="text">
          <h2 class="name">
            {{ item.username }}
          </h2>
          <p class="title">
            {{item.title}}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'albums',
  props: {
    albums: {
      type: Array,
      default() {
        return []
      }
    },
    loading: Boolean
  },
  methods: {
    selectAlbum(album) { // 来自singerList的点击事件
      this.$emit('selectAlbum', album)
    }
  }
}
</script>

<style lang="scss" scoped>
  .recommend-list {
    .list-title {
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: $font-size-medium;
      color: $color-theme;
    }
    .item {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      padding: 0 20px 20px 20px;
      .icon {
        flex: 0 0 60px; // 0 0不放大不缩小，保持60px宽度
        width: 60px;
        padding-right: 20px;
        img {
          border: 2px ridge $color-theme; // 浮雕效果
        }
      }
      .text {
        display: flex;
        flex-direction: column;
        //justify-content: center;
        flex: 1;
        line-height: 20px;
        overflow: hidden;
        font-size: $font-size-medium;
      }
      .name {
        margin-bottom: 10px;
        color: $color-text;
      }
      .title {
        color: $color-text-d;
      }
    }
  }
</style>
