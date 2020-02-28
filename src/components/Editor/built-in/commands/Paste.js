import { guid, executeBatch } from '../../utils';
import { ItemType } from '../../common/constants';

export default {
  name: 'Paste',

  params: {
    models: [],
  },

  canExecute(graph, commandManager) {
    return !!commandManager.core.clipboard.models.length;
  },

  init(graph, commandManager) {
    const { models } = commandManager.core.clipboard;

    const offsetX = 10;
    const offsetY = 10;

    this.params = {
      models: models.map(model => {
        const { x, y } = model;

        return {
          ...model,
          id: guid(),
          x: x + offsetX,
          y: y + offsetY,
        };
      }),
    };
  },

  execute(graph) {
    const { models } = this.params;

    executeBatch(graph, () => {
      models.forEach(model => {
        graph.addItem(ItemType.Node, model);
      });
    });

    this.setSelectedItems(
      graph,
      models.map(model => model.id),
    );
  },

  undo(graph) {
    const { models } = this.params;

    executeBatch(graph, () => {
      models.forEach(model => {
        graph.removeItem(model.id);
      });
    });
  },

  shortcuts: [
    ['metaKey', 'v'],
    ['ctrlKey', 'v'],
  ],
}
