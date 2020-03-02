import inject from '../common/inject'
import { EditorEvent } from '../common/constants'

export const Items = {
  mixins: [inject],
  data() {
    return {
      data: {
        shapes: {}
      }
    }
  },
  async mounted() {
    const core = await this.delayCore
    core.once(EditorEvent.onAfterEditorReady, () => {
      this.data.shapes = core.shapes
    })
  },
  render() {
    return this.$scopedSlots.default({ shapes: this.data.shapes })
  }
}

export const Item = {
  mixins: [inject],
  render() {
    return this.$scopedSlots.default()
  }
}