<script>
import data from '@/mock/data.json'
import { BaseEdge } from './shapes/edges'
import { Rect, Circle } from './shapes/nodes'
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

import EditorCard, { EditorCardContent } from './components/EditorCard'

export default {
  name: 'App',
  components: {
    Editor,
    EditorCard,
    EditorCardContent,
    Graph,
    RegisterNode,
    RegisterEdge
  },
  data() {
    return {
      graphConfig: {
        needPreview: true,
        plugins: [new Grid()],
        defaultNode: {
          shape: 'Rect'
        },
        defaultEdge: {
          shape: 'BaseEdge'
        }
      },
      data
    }
  },
  methods: {
    onBeforeExecuteCommand(cfg) {},
    onAfterExecuteCommand(params) {},
    save() {
      const data = this.$refs.editor.save()
    }
  },
  render() {
    return (
      <Editor ref="editor" mode="edit">
        <div class="editor-layout__container">
          <div class="editor-layout__row editor-layout--auto-grow">
            <div class="editor-layout__col editor-layout--auto-grow left-content">
              <div class="editor-layout__row editor-layout--auto-grow">
                <Graph data={this.data} graphConfig={this.graphConfig}>
                  <div class="editor-layout__col editor-layout--auto-grow graph-container"></div>
                </Graph>
              </div>
              <div class="editor-layout__row">
                <div class="editor-layout__col editor-layout--auto-grow bottom-menu-bar">
                  <EditorCard>
                    <EditorCardContent name="节点">节点</EditorCardContent>
                    <EditorCardContent name="数据">数据</EditorCardContent>
                  </EditorCard>
                </div>
              </div>
            </div>
            <div class="editor-layout__col right-menu-bar">
              <EditorCard vertical>
                <EditorCardContent name="属性">属性</EditorCardContent>
              </EditorCard>
            </div>
          </div>
          <RegisterEdge name={BaseEdge.name} config={BaseEdge} />
          <RegisterNode name={Rect.name} config={Rect} />
          <RegisterNode name={Circle.name} config={Circle} />
        </div>
      </Editor>
    )
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
  height: calc(100vh - 10px);
  width: calc(100vw - 10px);
  margin: 5px;
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
    overflow: hidden;
    & > div {
      overflow: hidden;
    }
  }

  & > .editor-layout__row {
    width: 100%;
    overflow: hidden;
  }

  .right-menu-bar {
  }
  .bottom-menu-bar {
  }

  .graph-container {
    background: rgba(240, 240, 240, 0.4);
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }
}
</style>
