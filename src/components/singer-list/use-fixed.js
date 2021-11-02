import { nextTick, ref, watch, computed } from 'vue'

export default function useFixed(props) {
  const TITLE_HEIGHT = 30 // fixed顶部栏的高度
  const groupRef = ref(null) // 歌手data的ref
  const listHeights = ref([]) // list的高度的数组
  const scrollY = ref(0) // 滚动的位置
  const currentIndex = ref(0) // 目前滚动时的list索引值
  const distance = ref(0) // 获取当前List与滑动顶部的距离

  // 监听group是否已经挂载,并使用calculate计算每个List高度
  watch(() => props.data,
    async () => {
      await nextTick() // 等到dom挂载后再执行calculate
      calculate() // 计算每个group高度,放到listHeights数组里
    })
  // 监听滚动时Y的位置
  watch(scrollY, async (newY) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length; i++) { // 对group做循环
      const heightTop = listHeightsVal[i] // list上部高度
      const heightBottom = listHeightsVal[i + 1] // list下部高度
      if (newY >= heightTop && newY <= heightBottom) { // 如果此时滚动位置在某个list之间
        currentIndex.value = i // 获取索引值
        distance.value = heightBottom - newY // 当前List底部距离顶部的距离
      }
    }
  })

  const fixedTitle = computed(() => { // 最终目的——获取到了list的固定标题
    if (scrollY.value < 0) { // 防止顶部回弹时也出现固定标题
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : null
  })
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0 // List与滑动顶部的距离是否小于30px
    return {
      transform: `translate3d(0,${diff}px,0` // 固定标题向上移动
    }
  })

  function calculate() { // 获取每个字母组的高度
    const list = groupRef.value.children // 获取每个list
    const listHeightsVal = listHeights.value
    let height = 0 // 滚动list从0开始
    listHeightsVal.push(height) // 从0开始
    for (let i = 0; i < list.length; i++) {
      height += list[i].offsetHeight // 计算每个list的高度
      listHeightsVal.push(height) // 将每个group的高度Push到一个数组里
    }
  }
  function onScroll(pos) { // 滚动事件,pos值来自scroll组件,pos有x,y值
    scrollY.value = -pos.y // 获取垂直滚动高度
  }
  return {
    groupRef,
    listHeights,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
