import { executeBatch } from '../../utils'
import { ItemType } from '../../common/constants'

export default {
  name: 'Remove',
  params: {
    nodes: {},
    edges: {}
  },

  canExecute(graph) {
    const selectedNodes = this.getSelectedNodes(graph)
    const selectedEdges = this.getSelectedEdges(graph)

    return !!(selectedNodes.length || selectedEdges.length)
  },

  init(graph) {
    const selectedNodes = this.getSelectedNodes(graph)
    const selectedEdges = this.getSelectedEdges(graph)

    const { nodes, edges } = this.params

    selectedNodes.forEach(node => {
      const nodeModel = node.getModel()
      const nodeEdges = node.getEdges()

      nodes[nodeModel.id] = nodeModel

      nodeEdges.forEach(edge => {
        const edgeModel = edge.getModel()

        edges[edgeModel.id] = edgeModel
      })
    })

    selectedEdges.forEach(edge => {
      const edgeModel = edge.getModel()

      edges[edgeModel.id] = edgeModel
    })
  },

  execute(graph) {
    const { nodes, edges } = this.params

    executeBatch(graph, () => {
      [...Object.keys(nodes), ...Object.keys(edges)].forEach(id => {
        graph.removeItem(id)
      })
    })
  },

  undo(graph) {
    const { nodes, edges } = this.params

    executeBatch(graph, () => {
      Object.keys(nodes).forEach(id => {
        const model = nodes[id]

        graph.addItem(ItemType.Node, model)
      })

      Object.keys(edges).forEach(id => {
        const model = edges[id]

        graph.addItem(ItemType.Edge, model)
      })
    })
  },

  shortcuts: ['Delete', 'Backspace']
}
