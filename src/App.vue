<template>
  <Editor mode="edit" >
    <Graph />
  </Editor> 
</template>

<script>
import Editor, { Graph } from "@/components/Editor";
export default {
  name: "App",
  components: { Editor, Graph }
};
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
  margin-top: 60px;
}
</style>
