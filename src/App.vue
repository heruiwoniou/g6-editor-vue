<template>
  <div id="app">
    <Editor mode="edit">
      <Graph :data="data" />
    </Editor>
  </div>
</template>

<script>
import data from '../mock/data.json'
import Editor, { Graph } from '@/components/Editor'
export default {
  name: 'App',
  components: { Editor, Graph },
  data() {
    return {
      data
    }
  }
}
</script>

<style>
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
