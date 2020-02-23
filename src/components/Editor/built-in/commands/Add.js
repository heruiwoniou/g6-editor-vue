import { ItemType } from '../../common/constants'
import { guid } from '../../utils'

export default {
  name: 'Add',
  params: {
    type: ItemType.Node,
    model: {
      id: ''
    }
  },
  init() {
    const { model } = this.params

    if (model.id) {
      return
    }

    model.id = guid()
  },

  execute(graph) {
    const { type, model } = this.params

    graph.add(type, model)

    this.setSelectedItems(graph, [model.id])
  },

  undo(graph) {
    const { model } = this.params

    graph.remove(model.id)
  }
}
