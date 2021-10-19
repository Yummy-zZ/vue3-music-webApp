import { createRouter, createWebHashHistory } from 'vue-router'
// import Recommend from '@/views/recommend/recommend'
// import Singer from '@/views/singer/singer'
// import TopList from '@/views/top-list/top-list'
// import UserCenter from '@/views/user-center/user-center'
// import SingerDetail from '@/views/singer/child/singer-detail'
// import AlbumDetail from '@/views/recommend/components/album-detail'
// import TopDetail from '@/views/top-list/top-detail'
const Recommend = () => import('@/views/recommend/recommend'/* webpackChunkName: "recommend" */)
const Singer = () => import('@/views/singer/singer'/* webpackChunkName: "singer" */)
const TopList = () => import('@/views/top-list/top-list'/* webpackChunkName: "top-list" */)
const SingerDetail = () => import('@/views/singer/child/singer-detail'/* webpackChunkName: "singer-detail" */)
const AlbumDetail = () => import('@/views/recommend/components/album-detail'/* webpackChunkName: "album-detail" */)
const TopDetail = () => import('@/views/top-list/top-detail'/* webpackChunkName: "top-detail" */)
const UserCenter = () => import('@/views/user-center/user-center'/* webpackChunkName: "user-center" */)

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    component: Recommend,
    children: [
      {
        path: 'detail/:id',
        component: AlbumDetail
      }
    ]
  },
  {
    path: '/singer',
    component: Singer,
    children: [
      {
        path: 'detail/:id',
        component: SingerDetail
      }
    ]
  },
  {
    path: '/top-list',
    component: TopList,
    children: [
      {
        path: 'detail/:id',
        component: TopDetail
      }
    ]
  },
  {
    path: '/user',
    components: {
      user: UserCenter
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
