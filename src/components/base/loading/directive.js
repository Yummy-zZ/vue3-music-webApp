// import Loading from './loading'
// import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive'
// const loadingDirective = createLoadingLikeDirective(Loading)
// export default loadingDirective

import Loading from './loading'
import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom' // 给loading元素增添relative样式

const relativeCls = 'g-relative' // g-relative为{position: relative;},在scss文件的base.scss下

const loadingDirective = {
  mounted(el, binding) {
    const app = createApp(Loading) // 创建loading组件的实例
    const instance = app.mount(document.createElement('div')) // loading组件的实例挂载到一个空div上
    el.instance = instance // loading组件的实例赋值给使用指令的元素
    const title = binding.arg // 是否有v-loading:参数
    if (typeof title !== 'undefined') {
      instance.setTitle(title) // loading组件中重新设置title
    }
    if (binding.value) { // 参数的值是否为真
      append(el) // loading组件挂载到使用指令的元素上
    }
  },
  updated(el, binding) {
    const title = binding.arg // 是否有v-loading:参数
    if (typeof title !== 'undefined') {
      el.instance.setTitle(title) // loading组件中重新设置title
    }
    if (binding.value !== binding.oldValue) { // 前后参数的值不一样
      binding.value ? append(el) : remove(el) // true挂载,false销毁
    }
  }
}

function append(el) {
  const style = getComputedStyle(el, 'position') // getComputedStyle找到对应元素上的css值
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) { // 如果el上没有这三个定位的话添加el的relative定位
    addClass(el, relativeCls) // 添加el的relative定位
  }
  el.appendChild(el.instance.$el) // 将loading组件添加到el上
}
function remove(el) {
  removeClass(el, relativeCls) // 移除el的relative定位
  el.removeChild(el.instance.$el) // 移除loading组件
}
export default loadingDirective
