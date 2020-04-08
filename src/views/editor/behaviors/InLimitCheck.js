import { checkOutAndInEdge, nextNodeCheck } from '../utils'
import { linkRule } from '../common/constants'

export default {
  name: 'InLimitCheck',
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
    if (state === 'addingEdge') {
      const sources = graph.findAllByState('node', 'addingSource')
      if (
        enabled &&
        (
          !checkOutAndInEdge(item, 'in', linkRule)
          // ||
          // (sources.length && !nextNodeCheck(sources[0], item, linkRule))
        )
      ) {
        graph.setItemState(item, 'limitLink', true)
      } else {
        graph.setItemState(item, 'limitLink', false)
      }
    }
  }
}
