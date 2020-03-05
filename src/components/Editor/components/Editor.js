import { createDelayCore, transformVueEventName } from '../utils'
import { EditorEvent } from '../common/constants'
import cloneDeep from 'lodash/cloneDeep'

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
    save() {
      return cloneDeep(this.graph.save())
    },
    async bind() {
      const { graph } = await this.context.delayCore.get
      this.graph = graph;

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
