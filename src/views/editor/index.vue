<script>
import data from '@/mock/data.json'
import { BaseEdge } from './shapes/edges'
import {
  Knowledge,
  Variable,
  VariableValue,
  VariableReference,
  VariableCollect,
  Condition,
  ExternalOperation,
  Answer
} from './shapes/nodes'
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

import Grid from '@antv/g6/build/grid'
import MiniMap from '@antv/g6/build/minimap'

export default {
  name: 'App',
  components: {
    Editor,
    Graph,
    RegisterNode,
    RegisterEdge,
    RegisterBehavior
  },
  data() {
    const guid = `editor-${createGuid()}`
    const HoverAnchorBehavior = `${HoverAnchor.name}-${guid}`
    const DragAddEdgeBehavior = `${DragAddEdge.name}-${guid}`
    const InLimitCheckBehavior = `${InLimitCheck.name}-${guid}`
    const OutLimitCheckBehavior = `${OutLimitCheck.name}-${guid}`

    this.graphConfig = {
      // Graph conf
      plugins: [new Grid()],
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
      canDragNode: e => !['anchor', 'banAnchor'].some(item => item === e.target.get('className'))
    }

    return {
      data
    }
  },
  methods: {
    bindEvents() {
      // 事件列表 https://g6-v3-2.antv.vision/zh/docs/api/Event
      // 或 src/components/Editor/common/constants.js 中的事件枚举
      
      this.$refs.editor.context.delayCore.get.then(core => {
        core.graph.on('node:dblclick', ({ item }) => console.log(item.get('model')))
      })
    },
    save() {
      const data = this.$refs.editor.save()
      return data;
    }
  },
  mounted() {
    this.bindEvents()
  },
  render() {
    return (
      <Editor ref="editor" class="kb-editor" mode="edit">
        <div class="kb-editor__left">
          <el-tabs type="border-card" class="kb-editor__left-objects">
            <el-tab-pane label="对象">
              <Items
                class="kb-editor__items"
                scopedSlots={{
                  default: ({ shapes }) =>
                    Object.entries(structure).map(([type, conf]) => {
                      const shape = conf.shape
                      const shapeKey = `${shape}-${type}`
                      const hasShapeConf = !!shapes[shape]
                      const { preview, options, ...shapeConf } = shapes[shape] || {}
                      return hasShapeConf ? (
                        <Item
                          key={shapeKey}
                          params={{ ...shapeConf, ...conf, options: { size: options?.size || [] } }}
                        >
                          <div class="kb-editor__item">
                            {preview === 'loading' ? (
                              <i class="el-icon-loading" />
                            ) : (
                              <img src={preview} alt="" />
                            )}
                            <h5>{conf.name}</h5>
                          </div>
                        </Item>
                      ) : (
                        <div class="kb-editor__item">
                          <i class="el-icon-loading" />
                          <h5>{name}</h5>
                        </div>
                      )
                    })
                }}
              />
            </el-tab-pane>
            <el-tab-pane label="全局变量"></el-tab-pane>
          </el-tabs>
          <el-tabs type="border-card" class="kb-editor__left-variables">
            <el-tab-pane label="流程变量"></el-tab-pane>
          </el-tabs>
          <div class="kb-editor__left-minimap" />
        </div>
        <div class="kb-editor__right">
          <Graph class="kb-editor__graph-wrapper" data={this.data} graphConfig={this.graphConfig} />
        </div>
        <RegisterBehavior name={DragAddEdge.name} config={DragAddEdge} />
        <RegisterBehavior name={HoverAnchor.name} config={HoverAnchor} />
        <RegisterBehavior name={InLimitCheck.name} config={InLimitCheck} />
        <RegisterBehavior name={OutLimitCheck.name} config={OutLimitCheck} />
        <RegisterEdge name={BaseEdge.name} config={BaseEdge} />
        <RegisterNode name={Knowledge.name} config={Knowledge} />
        <RegisterNode name={Variable.name} config={Variable} />
        <RegisterNode name={VariableValue.name} config={VariableValue} />
        <RegisterNode name={VariableReference.name} config={VariableReference} />
        <RegisterNode name={VariableCollect.name} config={VariableCollect} />
        <RegisterNode name={Condition.name} config={Condition} />
        <RegisterNode name={ExternalOperation.name} config={ExternalOperation} />
        <RegisterNode name={Answer.name} config={Answer} />
      </Editor>
    )
  }
}
</script>

<style lang="less">
.kb-editor {
  width: calc(100vw - 5px);
  height: calc(100vh - 5px);
  margin: 5px 0 0 5px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  .kb-editor__left {
    width: 300px;
    margin-right: 5px;
    .el-tabs__content {
      height: calc(100% - 40px);
      overflow: hidden;
      overflow-y: auto;
      padding: 0px;
    }
    .kb-editor__left-objects {
      height: 50%;
    }
    .kb-editor__left-variables {
      margin: 5px 0;
      // 200px为 minimap 的高度,
      // 15px 为三个框之间的间距,
      // 6px为 三个框多出来的边的高度
      height: calc(50% - 200px - 15px - 6px);
    }
    .kb-editor__left-minimap {
      height: 200px;
      background: #fff;
      border: 1px solid #dcdfe6;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    }
    .kb-editor__items {
      .kb-editor__item {
        width: 50%;
        height: 60px;
        padding: 5px 0px;
        margin: 10px 0;
        position: relative;
        float: left;
        display: flex;
        justify-content: center;
        box-sizing: border-box;
        align-items: center;
        user-select: none;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          -webkit-user-drag: none;
        }
        h5 {
          font-size: 12px;
          margin: 0px;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
  .kb-editor__right {
    flex: 1;
    margin: 0 5px 5px 0;
    overflow: hidden;
    border: 1px solid #dcdfe6;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    .kb-editor__graph-wrapper {
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
  }
}
</style>
