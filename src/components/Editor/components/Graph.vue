<template>
  <div class="editor-graph" :id="guid"></div>
</template>
<script>
import { guid } from '../utils'
import EditorCore from '../core'
export default {
  inject: ['context'],
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
      guid: guid()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const { clientWidth: width = 0, clientHeight: height = 0 } = this.$el || {}
      const core = new EditorCore({ container: this.guid, width, height, ...this.graphConfig })
      const graph = core.graph
      this.context.core = core
      this.context.graph = graph
      this.context.executeCommand = (...args) => core.executeCommand(...args)
    }
  }
}
</script>
<style lang="stylus">
.editor-graph {
  position: relative;
  flex: 1;
}
</style>
