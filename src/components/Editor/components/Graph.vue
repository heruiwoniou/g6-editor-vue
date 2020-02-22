<template>
  <div class="editor-graph"></div>
</template>
<script>
import { guid } from "../utils";
import EditorCore from "../core";
export default {
  inject: ['core'],
  props: {
    data: Object,
    graphConfig: {
      type: Object,
      default() { return {} }
    }
  },
  data() {
    const guid = guid();
    return {
      guid
    };
  },
  mounted() {
    this.core = new EditorCore({ container: this.guid, ...this.graphConfig })
  }
};
</script>
