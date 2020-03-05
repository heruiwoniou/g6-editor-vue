import { EditorEvent } from '../common/constants'
import inject from '../common/inject'
import { GraphState } from '../common/constants'
import { getSelectedNodes, getSelectedEdges } from '../utils'
import UpdateCommand from '../built-in/commands/Update'

export default {
  mixins: [inject],
  data() {
    return {
      models: [],
      graphState: GraphState.CanvasSelected,
      loaded: false
    }
  },
  async mounted() {
    const core = await this.delayCore
    core.graph.on(EditorEvent.onGraphStateChange, ({ graphState }) => {
      if (
        [
          GraphState.CanvasSelected,
          GraphState.NodeSelected,
          GraphState.EdgeSelected,
          GraphState.MultiSelected
        ].includes(graphState)
      ) {
        const nodes = getSelectedNodes(this.core.graph)
        const edges = getSelectedEdges(this.core.graph)

        const models = [...nodes, ...edges].map(o => o.getModel())
        this.models = models
        this.graphState = graphState
      }
    })
    this.core = core
    this.loaded = true
  },
  methods: {
    commit(model) {
      const { id, ...values } = model
      this.core.commandManager.execute(UpdateCommand.name, {
        id: id,
        updateModel: {
          ...values
        }
      })
    }
  },
  render() {
    if (this.loaded) {
      return this.$scopedSlots.default({ models: this.models, graphState: this.graphState, commit: this.commit })
    }
    return null
  }
}
