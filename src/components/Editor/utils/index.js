import { ItemType, ItemState, GraphState, EditorEvent } from '../common/constants';

export function createDelayCore() {
  const delayCore = {}
  const promise = new Promise(resolve => {
    delayCore.resolve = resolve
  })
  delayCore.get = promise
  return delayCore
}

/** 生成唯一标识 */
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** 执行批量处理 */
export function executeBatch(graph, execute) {
  const autoPaint = graph.get('autoPaint');
  graph.setAutoPaint(false);
  execute();
  graph.paint();
  graph.setAutoPaint(autoPaint);
}


/** 判断是否节点 */
export function isNode(item) {
  return item.getType() === ItemType.Node;
}

/** 判断是否边线 */
export function isEdge(item) {
  return item.getType() === ItemType.Edge;
}

/** 获取选中节点 */
export function getSelectedNodes(graph) {
  return graph.findAllByState(ItemType.Node, ItemState.Selected)
}

/** 获取选中边线 */
export function getSelectedEdges(graph) {
  return graph.findAllByState(ItemType.Edge, ItemState.Selected)
}

/** 获取图表状态 */
export function getGraphState(graph) {
  let graphState = GraphState.MultiSelected;

  const selectedNodes = getSelectedNodes(graph);
  const selectedEdges = getSelectedEdges(graph);

  if (selectedNodes.length === 1 && !selectedEdges.length) {
    graphState = GraphState.NodeSelected;
  }

  if (selectedEdges.length === 1 && !selectedNodes.length) {
    graphState = GraphState.EdgeSelected;
  }

  if (!selectedNodes.length && !selectedEdges.length) {
    graphState = GraphState.CanvasSelected;
  }

  return graphState;
}

/** 设置选中元素 */
export function setSelectedItems(graph, items) {
  executeBatch(graph, () => {
    const selectedNodes = getSelectedNodes(graph);
    const selectedEdges = getSelectedEdges(graph);

    [...selectedNodes, ...selectedEdges].forEach(node => {
      graph.setItemState(node, ItemState.Selected, false);
    });

    items.forEach(item => {
      graph.setItemState(item, ItemState.Selected, true);
    });
  });

  graph.emit(EditorEvent.onGraphStateChange, {
    graphState: getGraphState(graph),
  });
}

/** 清除选中状态 */
export function clearSelectedState(graph, shouldUpdate = () => true) {
  const selectedNodes = getSelectedNodes(graph);
  const selectedEdges = getSelectedEdges(graph);

  executeBatch(graph, () => {
    [...selectedNodes, ...selectedEdges].forEach(item => {
      if (shouldUpdate(item)) {
        graph.setItemState(item, ItemState.Selected, false);
      }
    });
  });
}
