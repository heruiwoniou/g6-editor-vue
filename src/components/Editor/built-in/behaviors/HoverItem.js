import { ItemState } from '../../common/constants'

export default {
  getEvents() {
    return {
      'node:mouseenter': 'handleItemMouseenter',
      'edge:mouseenter': 'handleItemMouseenter',
      'node:mouseleave': 'handleItemMouseleave',
      'edge:mouseleave': 'handleItemMouseleave'
    }
  },

  handleItemMouseenter({ item }) {
    const { graph } = this

    graph.setItemState(item, ItemState.Active, true)
  },

  handleItemMouseleave({ item }) {
    const { graph } = this

    graph.setItemState(item, ItemState.Active, false)
  }
}

