import { getFlowRecallEdges, getMindRecallEdges, executeBatch } from '../../utils'
import { ItemState } from '../../common/constants'

const RecallEdgeBehavior = {
  edgeIds: [],

  getEvents() {
    return {
      'node:click': 'handleNodeClick',
      'edge:click': 'handleEdgeClick',
      'canvas:click': 'handleCanvasClick'
    }
  },

  setHighLightState(edges) {
    const { graph } = this

    this.clearHighLightState()

    executeBatch(graph, () => {
      edges.forEach(item => {
        graph.setItemState(item, ItemState.HighLight, true)
      })
    })

    this.edgeIds = edges.map(edge => edge.get('id'))
  },

  clearHighLightState() {
    const { graph } = this

    executeBatch(graph, () => {
      this.edgeIds.forEach(id => {
        const item = graph.findById(id)

        if (item && !item.destroyed) {
          graph.setItemState(item, ItemState.HighLight, false)
        }
      })
    })

    this.edgeIds = []
  },

  handleNodeClick({ item }) {
    const { graph } = this
    let edges

    edges = getFlowRecallEdges(graph, item)
    this.setHighLightState(edges)
  },

  handleEdgeClick() {
    this.clearHighLightState()
  },

  handleCanvasClick() {
    this.clearHighLightState()
  }
}

export default RecallEdgeBehavior