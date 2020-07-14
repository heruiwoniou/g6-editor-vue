import { ItemType } from '../../common/constants'
import { guid } from '../../utils'

const NODE_DEFAULT_NAME = '请设置内容'
const EDGE_DEFAULT_NAME = ''

export default {
  name: 'Add',
  params: {
    type: ItemType.Node,
    model: {
      id: '',
      label: ''
    }
  },
  init() {
    const { model, type } = this.params

    if (!model.label) {
      model.label = type === ItemType.Node ? NODE_DEFAULT_NAME : EDGE_DEFAULT_NAME
    }

    if (ItemType.Node === type) {
      model.x = model.x || 10
      model.y = model.y || 10
    }

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
