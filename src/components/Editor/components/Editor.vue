<template>
  <div class="editor-container"><slot /></div>
</template>
<script>
export default {
  name: "Editor",
  provide: {
    core: {}
  },
  props: {
    mode: {
      type: String,
      default: "view",
      validator(val) {
        return ["view", "edit"].includes(val);
      }
    }
  }
};
</script>
<style lang="stylus">
.editor-container {
  height: 100%;
  width: 100%;
  position: relative;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  .editor-container.bottom-container {
    position: relative;
  }
}
</style>
