import { getGraphState, clearSelectedState } from '../../utils';
import { ItemState, GraphState, EditorEvent } from '../../common/constants';

export default {
  getDefaultCfg() {
    return {
      multiple: true,
      keydown: false,
      keyCode: 17,
    };
  },

  getEvents() {
    return {
      'node:click': 'handleItemClick',
      'edge:click': 'handleItemClick',
      'canvas:click': 'handleCanvasClick',
      'keydown': 'handleKeyDown',
      'keyup': 'handleKeyUp',
    };
  },

  handleItemClick({ item }) {
    const { graph } = this;

    const isSelected = item.hasState(ItemState.Selected);

    if (this.multiple && this.keydown) {
      graph.setItemState(item, ItemState.Selected, !isSelected);
    } else {
      clearSelectedState(graph, selectedItem => {
        return selectedItem !== item;
      });

      if (!isSelected) {
        graph.setItemState(item, ItemState.Selected, true);
      }
    }

    graph.emit(EditorEvent.onGraphStateChange, {
      graphState: getGraphState(graph),
    });
  },

  handleCanvasClick() {
    const { graph } = this;

    clearSelectedState(graph);

    graph.emit(EditorEvent.onGraphStateChange, {
      graphState: GraphState.CanvasSelected,
    });
  },

  handleKeyDown(e) {
    this.keydown = (e.keyCode || e.which) === this.keyCode;
  },

  handleKeyUp() {
    this.keydown = false;
  },
}
