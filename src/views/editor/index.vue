<template>
  <Editor
    mode="edit"
    @before-execute-command="onBeforeExecuteCommand"
    @after-execute-command="onAfterExecuteCommand"
  >
    <div class="editor-layout__container">
      <ul class="editor-layout__toolbar">
        <li v-for="item in toolbar" :key="item.name">
          <el-divider v-if="item === '|'" direction="vertical" />
          <Command tag="el-button" :name="item.cmd" :params="item.params" v-else>
            <template v-slot="{ disabled }">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="bottom">
                <el-button
                  type="primary"
                  :disabled="disabled"
                  size="mini"
                  plain
                  :icon="item.icon"
                />
              </el-tooltip>
            </template>
          </Command>
        </li>
      </ul>
      <div class="editor-layout__main">
        <Items>
          <template v-slot="{ shapes }">
            <div class="editor-layout__items">
              <Item v-for="(config, name) in shapes" :key="name">
                <div class="editor-layout__item">
                  <div class="editor-layout__item_image">
                    <i class="el-icon-loading" v-if="config.preview === 'loading'"></i>
                    <img :src="config.preview" alt="" v-else />
                  </div>
                  <h5>{{ name }}</h5>
                </div>
              </Item>
            </div>
          </template>
        </Items>
        <Graph :data="data">
          <div class="editor-layout__graph"></div>
        </Graph>
        <div class="editor-layout__other">
          <div class="editor-layout__detail"></div>
          <div class="editor-layout__minimap"></div>
        </div>
      </div>
      <RegisterNode :name="shapes.Diamond.name" :config="shapes.Diamond" />
      <RegisterNode :name="shapes.Circle.name" :config="shapes.Circle" />
    </div>
  </Editor>
</template>
<script>
import data from '@/mock/data.json'
import Diamond from './shapes/Diamond'
import Circle from './shapes/Circle'
import Editor, {
  Graph,
  Command,
  Items,
  Item,
  RegisterNode,
  EditorBuiltInCommand,
  ItemType
} from '@/components/Editor'

export default {
  name: 'App',
  components: { Editor, Graph, Command, Items, Item, RegisterNode },
  data() {
    return {
      data,
      shapes: {
        Diamond,
        Circle
      },
      toolbar: [
        { name: '撤销', cmd: EditorBuiltInCommand.Undo, icon: 'el-icon-back' },
        { name: '重做', cmd: EditorBuiltInCommand.Redo, icon: 'el-icon-right' },
        '|',
        {
          name: '添加FlowNode',
          cmd: EditorBuiltInCommand.Add,
          icon: 'el-icon-circle-plus-outline'
        },
        {
          name: '添加CustomRect',
          cmd: EditorBuiltInCommand.Add,
          icon: 'el-icon-circle-plus-outline',
          params: { model: { shape: Diamond.name } }
        },
        { name: '删除', cmd: EditorBuiltInCommand.Remove, icon: 'el-icon-delete' },
        '|',
        { name: '放大', cmd: EditorBuiltInCommand.ZoomIn, icon: 'el-icon-zoom-in' },
        { name: '缩小', cmd: EditorBuiltInCommand.ZoomOut, icon: 'el-icon-zoom-out' }
      ]
    }
  },
  methods: {
    onBeforeExecuteCommand(cfg) {
      // switch (cfg.name) {
      //   case EditorBuiltInCommand.Add: {
      //     if (cfg.params.type === ItemType.Node) {
      //       let name
      //       if ((name = prompt('请输入名称'))) {
      //         cfg.params.model.label = name || 'Node'
      //       } else {
      //         return false
      //       }
      //     }
      //   }
      // }
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

.editor-layout__container {
  flex-direction: column;
  flex: 1;
  display: flex;
  .editor-layout__toolbar {
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
  .editor-layout__main {
    display: flex;
    flex: 1;
  }
  .editor-layout__other {
    width: 300px;
    display: flex;
    flex-direction: column;
    border-left: 1px solid #ccc;
  }
  .editor-layout__items {
    width: 100px;
    border-right: 1px solid #ccc;
    display: flex;
    flex-direction: column;
  }
  .editor-layout__item {
    display: flex;
    flex-direction: column;
    width: 90%
    height: 110px
    h5 { margin: 0; height: 25px; line-height: 25px;}
    margin-left: 5%;
    margin-top: 5%;
    border-radius: 5px;
    background #ccc;
  }
  .editor-layout__item_image {
    width: 80%;
    margin: 5% 10%;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
      object-fit: contain;
    }
  }
  .editor-layout__detail {
    flex: 1;
  }
  .editor-layout__minimap {
    height: 200px;
    background: rgba(0,0,0,.07);
    border-top: 1px solid #ccc;
  }
  .editor-layout__graph {
    background: rgba(0,0,0,.065);
    flex: 1;
  }
}
</style>
