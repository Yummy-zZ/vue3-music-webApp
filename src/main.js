import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/scss/index.scss' // 引入全局样式,需要sass-loader10.1.0以上, node-sass5.0.0以上
import lazyPlugin from 'vue3-lazy' // 图片懒加载
import loadingDirective from './components/base/loading/directive' // 自定义指令
import noResultDirective from '@/components/base/no-result/directive' // 自定义指令
import { processSongs } from './service/song' // 更新我喜欢和最近播放歌曲的url
import { saveAll, load } from './assets/js/array-store' // 存储所有歌曲并缓存
import { FAVORITE_KEY, PLAYED_KEY } from './assets/js/constant'

const app = createApp(App)

const favoriteSongs = load(FAVORITE_KEY)
if (favoriteSongs.length > 0) {
  processSongs(favoriteSongs).then((songs) => {
    store.commit('setFavoriteList', songs)
    saveAll(songs, FAVORITE_KEY)
  })
}

const historySongs = load(PLAYED_KEY)
if (historySongs.length > 0) {
  processSongs(historySongs).then((songs) => {
    store.commit('setPlayHistory', songs)
    saveAll(songs, PLAYED_KEY)
  })
}

app.use(store)
   .use(router)
   .directive('loading', loadingDirective)
   .directive('no-result', noResultDirective)
   .use(lazyPlugin, { loading: require('@/assets/loading/loading.gif') })
   .mount('#app')
