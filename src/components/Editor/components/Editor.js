import { createDelayCore, transformVueEventName } from '../utils'
import { EditorEvent } from '../common/constants'

export default {
  name: 'Editor',
  provide() {
    return { context: this.context }
  },
  beforeCreate() {
    this.context = {
      delayCore: createDelayCore()
    }
  },
  props: {
    mode: {
      type: String,
      default: 'view',
      validator(val) {
        return ['view', 'edit'].includes(val)
      }
    }
  },
  mounted() {
    this.bind()
  },
  methods: {
    async bind() {
      const { graph } = await this.context.delayCore.get

      graph.on(EditorEvent.onBeforeExecuteCommand, (...args) => {
        this.$emit(transformVueEventName(EditorEvent.onBeforeExecuteCommand), ...args)
      })
      graph.on(EditorEvent.onAfterExecuteCommand, (...args) =>
        this.$emit(transformVueEventName(EditorEvent.onAfterExecuteCommand), ...args)
      )
    }
  },
  render() {
    return this.$scopedSlots.default()
  }
}
