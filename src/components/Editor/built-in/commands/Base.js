import { getSelectedNodes, getSelectedEdges, setSelectedItems } from '../../utils';
import { LabelState, EditorEvent } from '../../common/constants'

export default {
  name : null,
  params : null,
  shortcuts : [],
  canExecute(graph, commandManager) { return true },
  shouldExecute(graph, commandManager) { return true },
  canUndo(graph, commandManager) { return true },
  init(graph, commandManager) {},
  execute(graph, commandManager) {},
  undo(graph, commandManager) {},
  getSelectedNodes,
  getSelectedEdges,
  setSelectedItems,
  editSelectedNode(graph) {
    graph.emit(EditorEvent.onLabelStateChange, {
      labelState: LabelState.Show,
    });
  }
}