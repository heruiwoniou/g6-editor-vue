import { ItemState } from '@/components/Editor'
import { checkOutAndInEdge } from '../utils'
export default {
  name: 'LimitLinkCheck',
  getEvents() {
    return {
      'afteritemstatechange': 'afteritemstatechange'
    }
  },
  afteritemstatechange({ state, enabled, item }) {
    const { graph } = this
    if (item.get('type') === 'node') {
      if (state === ItemState.Active) {
        if (enabled && !checkOutAndInEdge(item, 'in', graph.get('defaultEdge').linkRule)) {
          graph.setItemState(item, 'limitLink', true)
        } else {
          graph.setItemState(item, 'limitLink', false)
        }
      }
    }
  }
}

