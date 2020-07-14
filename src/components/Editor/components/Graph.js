import { guid } from '../utils'
import EditorCore from '../core'
import inject from '../common/inject'
import { EditorEvent } from '../common/constants'
import debounce from 'lodash/debounce'
export default {
  mixins: [inject],
  props: {
    data: Object,
    graphConfig: {
      type: Object,
      default() {
        return {}
      }
    }
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
      { guid: this.guid, container: this.$el, width, height, ...this.graphConfig }
    )
    core.once(EditorEvent.onAfterEditorReady, () => core.read(this.data))
    this.context.delayCore.resolve(core)
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestory() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    resizeHandler: debounce(function() {
      const { clientWidth: width = 0, clientHeight: height = 0 } = this.$el || {}
      this.delayCore.then(core => core.graph.changeSize(width, height))
    })
  },
  render() {
    return <div id={this.guid}></div>
  }
}
