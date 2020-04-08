<script>
import data from '@/mock/data.json'
import { BaseEdge } from './shapes/edges'
import { Rect, Circle } from './shapes/nodes'
import { DragAddEdge, HoverAnchor, InLimitCheck, OutLimitCheck } from './behaviors'
import { structure, linkRule } from './common/constants'
import Editor, {
  Graph,
  Command,
  Items,
  Item,
  Detail,
  RegisterNode,
  RegisterEdge,
  RegisterBehavior,
  EditorBuiltInCommand,
  ItemType,
  guid as createGuid
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
    RegisterEdge,
    RegisterBehavior
  },
  data() {
    const guid = `editor-${createGuid()}`;
    const HoverAnchorBehavior = `${HoverAnchor.name}-${guid}`
    const DragAddEdgeBehavior = `${DragAddEdge.name}-${guid}`
    const InLimitCheckBehavior = `${InLimitCheck.name}-${guid}`
    const OutLimitCheckBehavior = `${OutLimitCheck.name}-${guid}`
    this.graphConfig = {
      // Graph conf
      plugins: [new Grid()],
      defaultNode: {
        shape: 'Rect'
      },
      defaultEdge: {
        shape: 'BaseEdge',
        linkRule
      },
      modes: {
        default: {
          [HoverAnchorBehavior]: { type: HoverAnchorBehavior },
          [DragAddEdgeBehavior]: { type: DragAddEdgeBehavior },
          [InLimitCheckBehavior]: { type: InLimitCheckBehavior },
          [OutLimitCheckBehavior]: { type: OutLimitCheckBehavior }
        }
      },
      // Editor conf
      guid,
      needPreview: true,
      canDragNode: (e) =>
        !['anchor', 'banAnchor'].some((item) => item === e.target.get('className'))
    }
    
    return {
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
                    <EditorCardContent name="节点">
                      <Items
                        scopedSlots={{
                          default: ({ shapes }) => {
                            return (
                              <div class="editor-layout__items-container">
                                {Object.entries(structure).map(([type, conf]) => {
                                  const shape = conf.shape
                                  const shapeKey = `${shape}-${type}`
                                  const shapeConf = shapes[shape]
                                  return shapeConf ? (
                                    <Item key={shapeKey} params={{ ...shapeConf, ...conf }}>
                                      <div class="editor-layout__item">
                                        <div class="editor-layout__item_image">
                                          {shapeConf.preview === 'loading' ? (
                                            <i class="el-icon-loading" />
                                          ) : (
                                            <img src={shapeConf.preview} alt="" />
                                          )}
                                        </div>
                                        <h5>{conf.label}</h5>
                                      </div>
                                    </Item>
                                  ) : (
                                    <div class="editor-layout__item">
                                      <div class="editor-layout__item_image">
                                        <i class="el-icon-loading" />
                                      </div>
                                      <h5>{name}</h5>
                                    </div>
                                  )
                                })}
                              </div>
                            )
                          }
                        }}
                      />
                    </EditorCardContent>
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
          <RegisterBehavior name={DragAddEdge.name} config={DragAddEdge} />
          <RegisterBehavior name={HoverAnchor.name} config={HoverAnchor} />
          <RegisterBehavior name={InLimitCheck.name} config={InLimitCheck} />
          <RegisterBehavior name={OutLimitCheck.name} config={OutLimitCheck} />
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
  .editor-layout__items-container {
    display: flex;
    .editor-layout__item {
      height: 170px;
      width: 170px;
      text-align: center;
      user-select: none;
    }

    .editor-layout__item_image {
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        -webkit-user-drag: none;
      }
    }

    h5 {
      line-height: 30px;
      margin: 0;
    }
  }
}
</style>
