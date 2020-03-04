import pick from 'lodash/pick';

export default {
  params: {
    id: '',
    originModel: {},
    updateModel: {}
  },

  canExecute(graph) {
    const selectedNodes = this.getSelectedNodes(graph);
    const selectedEdges = this.getSelectedEdges(graph);
    return (selectedNodes.length || selectedEdges.length) && (selectedNodes.length === 1 || selectedEdges.length === 1)
      ? true
      : false;
  },

  init(graph) {
    const { id, updateModel } = this.params;

    const updatePaths = Object.keys(updateModel);
    const originModel = pick(graph.findById(id).getModel(), updatePaths);

    this.params.originModel = originModel;
  },

  execute(graph) {
    const { id, updateModel } = this.params;

    graph.updateItem(id, updateModel);
  },

  undo(graph) {
    const { id, originModel } = this.params;

    graph.updateItem(id, originModel);
  },
}
