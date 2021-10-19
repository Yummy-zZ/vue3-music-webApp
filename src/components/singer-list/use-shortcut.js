import { computed, ref } from 'vue'

export default function useShortcut(props, groupRef) {
  const ANCHOR_HEIGHT = 22 // 字母所占的高度
  const scrollRef = ref(null) // BScroll的实例
  const touch = {} // 用对象保存当前手指接触到的字母对应的pageY(相对于整个 document 的 Y 坐标值)

  const shortcutList = computed(() => { // 将title做成列表返回
    return props.data.map(group => {
      return group.title
    })
  })

  function onShortcutTouchStart(e) {
    const anchorIndex = parseInt(e.target.dataset.index) // 获取到点击字母后的索引值
    touch.y1 = e.touches[0].pageY // 拿到初次点击字母的pageY
    touch.anchorIndex = anchorIndex // 拿到对应字母的索引值
    scrollToEl(anchorIndex) // 跳转到对应索引
  }
  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0 // 点击前后索引差值
    let anchorIndex = delta + touch.anchorIndex // 手指松开时对应索引
    if (anchorIndex < 0) anchorIndex = 0 // 不越字母索引上界
    if (anchorIndex > props.data.length - 1) anchorIndex = props.data.length - 1 // 不越字母索引下界
    scrollToEl(anchorIndex) // 滚动到手指松开的索引位置
  }
  function scrollToEl(index) {
    if (isNaN(index)) {
      return
    }
    const targetEl = groupRef.value.children[index] // 获取到点击后目标的el元素
    const scroll = scrollRef.value.scroll // 准备使用BScroll的实例的scroll的API
    scroll.scrollToElement(targetEl) // 利用BScroll的实例的方法实现点击到对应位置
  }
  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
