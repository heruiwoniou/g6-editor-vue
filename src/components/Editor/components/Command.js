import { EditorEvent } from '../common/constants'
import inject from '../common/inject'
import cloneDeep from 'lodash/cloneDeep'

export default {
  inheritAttrs: false,
  mixins: [inject],
  props: {
    name: String,
    params: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      disabled: false
    }
  },
  mounted() {
    this.delayCore.then(({ graph, commandManager }) => {
      graph.on(
        EditorEvent.onGraphStateChange,
        () => (this.disabled = !commandManager.canExecute(this.name))
      )
      this.disabled = !commandManager.canExecute(this.name)
    })
  },
  methods: {
    handleClick() {
      this.delayCore.then(({ commandManager }) => {
        commandManager.execute(this.name, cloneDeep(this.params))
      }) 
    }
  },
  render() {
    const vnodes = this.$scopedSlots.default({ disabled: this.disabled })
    if (vnodes && vnodes.length) {
      vnodes[0].data.on = {
        ...vnodes[0].data.on,
        click: this.handleClick
      }
    }
    return vnodes
  }
}
