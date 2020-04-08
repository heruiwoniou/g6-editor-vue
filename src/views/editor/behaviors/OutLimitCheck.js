import { ItemState } from '@/components/Editor'
import { checkOutAndInEdge } from '../utils'
export default {
  name: 'OutLimitCheck',
  getEvents() {
    return {
      afteritemstatechange: 'afteritemstatechange'
    }
  },
  shouldBegin(ev) {
    const { item } = ev
    const typeName = item.get('type')
    // 如果点击的不是锚点就结束
    if (typeName === 'node') return true
    else return false
  },
  afteritemstatechange(e) {
    if (!this.shouldBegin(e)) return
    const { state, enabled, item } = e
    const { graph } = this
    const states = item.getStates()
    if (state === ItemState.Active && !states.includes('addingEdge')) {
      if (enabled && !checkOutAndInEdge(item, 'out', graph.get('defaultEdge').linkRule)) {
        graph.setItemState(item, 'limitLink', true)
      } else {
        graph.setItemState(item, 'limitLink', false)
      }
    }
  }
}
