export default {
  name: 'Copy',

  canExecute(graph) {
    return !!this.getSelectedNodes(graph).length;
  },

  canUndo() {
    return false;
  },

  execute(graph, commandManager) {
    const selectedNodes = this.getSelectedNodes(graph);

    commandManager.core.clipboard.models = selectedNodes.map(node => node.getModel());
  },

  shortcuts: [
    ['metaKey', 'c'],
    ['ctrlKey', 'c'],
  ],
};

