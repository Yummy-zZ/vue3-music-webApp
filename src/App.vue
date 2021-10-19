<template>
  <m-header/>
  <tab></tab>
  <router-view v-slot="{ Component }" :style="fixedScroll">
    <keep-alive>
      <component :is="Component"/>
    </keep-alive>
  </router-view>
  <router-view v-slot="{ Component }"
               :style="fixedScroll"
               name="user"
  >
    <transition appear name="slide">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
    </transition>
  </router-view>
  <player></player>
</template>

<script>
  import Header from '@/components/header/header' // 头部
  import Tab from '@/components/tab/tab' // 导航栏
  import Player from './components/player/player' // 音乐播放器
  import { mapState } from 'vuex'

  export default {
    components: {
      MHeader: Header,
      Tab,
      Player
    },
    computed: {
      fixedScroll() {
        const bottom = this.playlist.length ? '60px' : '0'
        return {
          bottom
        }
      },
      ...mapState(['playlist'])
    }
  }
</script>

<style lang="scss">

</style>
