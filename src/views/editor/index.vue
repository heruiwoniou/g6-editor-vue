<template>
  <Editor ref="editor" mode="edit">
    <div class="editor-layout__container">
      <div class="editor-layout__row editor-layout--auto-grow">
        <div class="editor-layout__col editor-layout--auto-grow left-content">
          <div class="editor-layout__row editor-layout--auto-grow">
            <div class="editor-layout__col editor-layout--auto-grow graph-container"></div>
          </div>
          <div class="editor-layout__row">
            <div class="editor-layout__col editor-layout--auto-grow bottom-menu-bar">
              <div class="editor-card">
                <div class="editor-card__title">

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="editor-layout__col right-menu-bar"></div>
      </div>
    </div>
  </Editor>
</template>
<script>
import data from '@/mock/data.json'
import { BaseEdge } from './shapes/edges'
import { BaseNode, Circle, Diamond } from './shapes/nodes'
import Editor, {
  Graph,
  Command,
  Items,
  Item,
  Detail,
  RegisterNode,
  RegisterEdge,
  EditorBuiltInCommand,
  ItemType
} from '@/components/Editor'

import DetailForLabel from './components/DetailForLabel'
import Grid from '@antv/g6/build/grid'
import MiniMap from '@antv/g6/build/minimap'

export default {
  name: 'App',
  components: {
    Editor
    // Graph,
    // Items,
    // Item,
    // Detail,
    // RegisterNode,
    // RegisterEdge,
    // DetailForLabel
  },
  data() {
    return {
      graphConfig: {
        needPreview: true,
        plugins: [new Grid()],
        defaultNode: {
          shape: 'BaseNode'
        },
        defaultEdge: {
          shape: 'BaseEdge'
        }
      },
      data,
      shapes: {
        BaseEdge,
        BaseNode,
        Diamond,
        Circle
      }
    }
  },
  methods: {
    onBeforeExecuteCommand(cfg) {},
    onAfterExecuteCommand(params) {},
    save() {
      const data = this.$refs.editor.save()
    }
  }
}
</script>

<style lang="scss">
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  display: flex;
}
.editor-layout__container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .editor-layout__row {
    display: flex;
    flex-direction: row;
  }
  .editor-layout__row,
  .editor-layout__col {
    &.editor-layout--auto-grow {
      flex: 1;
    }
  }

  .left-content {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  & > .editor-layout__row {
    width: 100%;
    overflow: hidden;
  }

  .right-menu-bar {
    margin-left: 5px;
    background: #ccc;
  }
  .bottom-menu-bar {
    margin-top: 5px;
    background: #ccc;
  }
}
</style>
