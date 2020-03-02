import { guid } from '../utils'
import EditorCore from '../core'
import inject from '../common/inject'
import { EditorEvent } from '../common/constants'
export default {
  mixins: [inject],
  props: {
    data: Object,
    graphConfig: {
      type: Object,
      default() {
        return {}
      }
    },
    canDragNode: Function,
    canDragOrZoomCanvas: Function
  },
  data() {
    return {
      guid: `editor-${guid()}`
    }
  },
  mounted() {
    const { clientWidth: width = 0, clientHeight: height = 0 } = this.$el || {}
    const { canDragNode, canDragOrZoomCanvas } = this
    const core = new EditorCore(
      { guid: this.guid, container: this.$el, width, height, ...this.graphConfig },
      {
        canDragNode,
        canDragOrZoomCanvas
      }
    )
    core.once(EditorEvent.onAfterEditorReady, () => core.read(this.data))
    this.context.delayCore.resolve(core)
  },
  render() {
    let vnodes
    if (this.$scopedSlots.default) {
      vnodes = this.$scopedSlots.default()
      vnodes[0].data.attrs = { ...vnodes[0].data.attrs, id: this.guid }
      return vnodes
    }
    return <div id={this.guid} />
  }
}
