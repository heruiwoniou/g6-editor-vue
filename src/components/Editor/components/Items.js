import inject from '../common/inject'
import { EditorEvent, GraphMode } from '../common/constants'
import isArray from 'lodash/isArray'

export const Items = {
  mixins: [inject],
  data() {
    return {
      data: {
        shapes: {}
      }
    }
  },
  mounted() {
    this.delayCore.then(core => {
      core.once(EditorEvent.onAfterEditorReady, () => {
        this.data.shapes = core.shapes
        this.bind()
      })
    })
  },
  methods: {
    bind() {
      document.addEventListener('mouseup', this.onMouseUp)
    },
    onMouseUp() {
      this.delayCore.then(core => {
        const { graph } = core

        if (graph.getCurrentMode() === GraphMode.Default) {
          return
        }

        const group = graph.get('group')
        const shape = group.findByClassName(core.fromModelClassName)

        if (shape) {
          shape.remove(true)
          graph.paint()
        }

        core.fromModel = null
        graph.setMode(GraphMode.Default)
      })
    }
  },
  render() {
    return this.$scopedSlots.default({ shapes: this.data.shapes })
  }
}

export const Item = {
  mixins: [inject],
  props: {
    config: Object
  },
  methods: {
    handleMouseDown() {
      this.delayCore.then(core => {
        const {
          name,
          options: { size }
        } = this.config

        const [width, height = width] = isArray(size) ? size : [size]

        core.fromModel = {
          shape: name,
          size: [width, height]
        }
        core.graph.setMode(GraphMode.AddNode)
      })
    }
  },
  render() {
    const vnodes = this.$scopedSlots.default()
    if (vnodes && vnodes.length) {
      vnodes[0].data.on = {
        ...vnodes[0].data.on,
        mousedown: this.handleMouseDown
      }
    }
    return vnodes
  }
}
