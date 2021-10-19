import { processSongs } from '@/service/song'
import DetailList from '@/components/detail-list/detail-list'
import storage from 'good-storage' // 可存储对象的storage

export default function (name, key, fetch) {
  return {
    name,
    components: {
      DetailList
    },
    props: {
      data: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      // 获取到来自singer点击时sessionStorage的数据
      computedData() {
        let ret
        const data = this.data
        if (data) {
          ret = data
        } else {
          const cached = storage.session.get(key)
          // sessionStorage里有数据，而且mid和路由参数的id相等,返回data里的数据
          if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
            ret = cached
          }
        }
        return ret
      },
      // 获取歌手图片
      pic() {
        const computedData = this.computedData
        return computedData && computedData.pic
      },
      // 获取歌手名字作为标题
      title() {
        const computedData = this.computedData
        return computedData && (computedData.name || computedData.title)
      }
    },
    async created () {
      const computedData = this.computedData
      // 歌手详情页url发生改变而且没有对应的数据,返回上一级
      if (!computedData) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      // detail中的内容和songs是重叠的,
      // 先获取detail在获取songs是因为后端需要detail的mid来获取歌曲的url，
      // 而mid可能每天都在变化,算是一个防盗
      const detail = await fetch(computedData)
      this.songs = await processSongs(detail.songs)
      this.loading = false
    }
  }
}
