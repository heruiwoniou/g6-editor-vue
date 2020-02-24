<template>
  <div id="app">
    <Editor mode="edit">
      <div class="editor-layout--container">
        <ul class="editor-layout--toolbar">
          <li v-for="item in toolbar" :key="item.name">
            <el-divider v-if="item === '|'" direction="vertical" />
            <Command tag="el-button" :name="item.name" v-else>
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
      </div>
    </Editor>
  </div>
</template>

<script>
import data from '../mock/data.json'
import Editor, { Graph, Command, EditorBuiltInCommand } from '@/components/Editor'
export default {
  name: 'App',
  components: { Editor, Graph, Command },
  data() {
    return {
      data,
      toolbar: [
        { name: EditorBuiltInCommand.Undo, icon: 'el-icon-back' },
        { name: EditorBuiltInCommand.Redo, icon: 'el-icon-right' },
        '|',
        { name: EditorBuiltInCommand.ZoomIn, icon: 'el-icon-zoom-in' },
        { name: EditorBuiltInCommand.ZoomOut, icon: 'el-icon-zoom-out' }
      ]
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
