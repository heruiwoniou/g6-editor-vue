import { ItemState } from '../../common/constants'
export default {
  name: 'ActiveEdge',
  getEvents() {
    return {
      'edge:mouseenter': 'setAllItemStates',
      'edge:mouseleave': 'clearAllItemStates'
    }
  },

  shouldBegin(e) {
    // 拖拽过程中没有目标节点，只有 x, y 坐标，不点亮
    const edge = e.item
    if (edge.getTarget().x) return false
    return true
  },

  setAllItemStates(e) {
    if (!this.shouldBegin(e)) return
    // 1.激活当前选中的边
    const { graph } = this
    const edge = e.item
    graph.setItemState(edge, ItemState.Active, true)

    // 2. 激活边关联的 sourceNode 与 targetNode
    graph.setItemState(edge.getTarget(), ItemState.Active, true)
    graph.setItemState(edge.getSource(), ItemState.Active, true)
  },

  clearAllItemStates(e) {
    if (!this.shouldBegin(e)) return
    // 状态还原
    const { graph } = this
    const edge = e.item
    graph.setItemState(edge, 'active', false)
    graph.setItemState(edge.getTarget(), ItemState.Active, false)
    graph.setItemState(edge.getSource(), ItemState.Active, false)
  }
}
