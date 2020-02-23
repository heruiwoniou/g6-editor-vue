import { EditorEvent } from '../common/constants'
import BaseCommand from '../built-in/commands/Base'
import builInCommands from '../built-in/commands'
import inject from '../common/inject'

export default {
  inheritAttrs: false,
  mixins: [inject],
  props: {
    name: String,
    comfig: {
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
  async mounted() {
    const { graph, commandManager } = await this.core.get
    if (!commandManager.isBuiltInCommand(this.name)) {
      commandManager.register(this.name, {
        ...BaseCommand,
        ...this.config
      })
    }
    graph.on(
      EditorEvent.onGraphStateChange,
      () => (this.disabled = !commandManager.canExecute(this.name))
    )
    this.disabled = !commandManager.canExecute(this.name)
  },
  methods: {
    async handleClick() {
      const { commandManager } = await this.core.get
      commandManager.execute(this.name)
    }
  },
  render(h) {
    const vnodes = this.$scopedSlots.default({ disabled: this.disabled })
    if (vnodes && vnodes.length) {
      vnodes[0].data.on = {
        click: this.handleClick
      }
    }
    return vnodes
  }
}
