<template>
  <div id="app">
    <Editor mode="edit" 
      @before-execute-command="onBeforeExecuteCommand"
      @after-execute-command="onAfterExecuteCommand"
    >
      <div class="editor-layout--container">
        <ul class="editor-layout--toolbar">
          <li v-for="item in toolbar" :key="item.name">
            <el-divider v-if="item === '|'" direction="vertical" />
            <Command tag="el-button" :name="item.cmd" :params="item.params" v-else>
              <template v-slot="{ disabled }">
                <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                  <el-button type="primary" :disabled="disabled" size="mini" plain :icon="item.icon" />
                </el-tooltip>
              </template>
            </Command>
          </li>
        </ul>
        <Graph :data="data">
          <div class="editor-layout--graph"></div>
        </Graph>
        <RegisterNode :name="Diamond.name" :config="Diamond" />
      </div>
    </Editor>
  </div>
</template>

<script>
import data from '../mock/data.json'
import Diamond from './components/Custom/Nodes/Diamond'
import Editor, { Graph, Command, RegisterNode, EditorBuiltInCommand, ItemType } from '@/components/Editor'
export default {
  name: 'App',
  components: { Editor, Graph, Command, RegisterNode },
  data() {
    return {
      Diamond,
      data,
      toolbar: [
        { name: '撤销', cmd: EditorBuiltInCommand.Undo, icon: 'el-icon-back' },
        { name: '重做', cmd: EditorBuiltInCommand.Redo, icon: 'el-icon-right' },
        '|',
        { name: '添加FlowNode', cmd: EditorBuiltInCommand.Add, icon: 'el-icon-circle-plus-outline' },
        { name: '添加CustomRect', cmd: EditorBuiltInCommand.Add, icon: 'el-icon-circle-plus-outline' ,params: { model: { shape: Diamond.name }} },
        { name: '删除', cmd: EditorBuiltInCommand.Remove, icon: 'el-icon-delete' },
        '|',
        { name: '放大', cmd: EditorBuiltInCommand.ZoomIn, icon: 'el-icon-zoom-in' },
        { name: '缩小', cmd: EditorBuiltInCommand.ZoomOut, icon: 'el-icon-zoom-out' }
      ]
    }
  },
  methods: {
    onBeforeExecuteCommand(cfg) {
      switch(cfg.name) {
        case EditorBuiltInCommand.Add: {
          if (cfg.params.type === ItemType.Node) {
            let name
            if ((name = prompt('请输入名称'))) {
              cfg.params.model.label = name || 'Node' 
            } else {
              return false
            }
          }
        }
      }
    },
    onAfterExecuteCommand(params) {
     console.log(params) 
    }
  }
}
</script>

<style lang="stylus">
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  overflow hidden
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

.editor-layout--container {
  flex-direction: column;
  flex: 1;
  display: flex;
  .editor-layout--toolbar {
    padding: 2px;
    margin: 0;
    display: flex;
    list-style: none;
    box-sizing: content-box;
    border-bottom: 1px solid #ccc;
    button {
      margin-right: 2px;
    }
  }
  .editor-layout--graph {
    background: rgba(0,0,0,.065);
    flex: 1;
  }
}
</style>
