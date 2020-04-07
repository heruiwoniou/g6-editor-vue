import isArray from 'lodash/isArray';
import { guid } from '../../utils';
import { ItemType, GraphMode, EditorBuiltInCommand } from '../../common/constants';

export default  {
  shape: null,
  graphMode: GraphMode.AddNode,

  getEvents() {
    return {
      'canvas:mouseenter': 'handleCanvasMouseEnter',
      mousemove: 'handleMouseMove',
      mouseup: 'handleMouseUp',
    };
  },

  handleCanvasMouseEnter(e) {
    const { graph, shape, core } = this;

    if (shape) {
      return;
    }

    const group = graph.get('group');
    const model= core.fromModel

    const { options: { size: [ width, height = width ] = [100, 100] } = {} } = model;

    const x = e.x - width / 2;
    const y = e.y - height / 2;

    this.shape = group.addShape('rect', {
      className: core.fromModelClassName,
      attrs: {
        x,
        y,
        width,
        height,
        fill: '#f3f9ff',
        fillOpacity: 0.5,
        stroke: '#1890ff',
        strokeOpacity: 0.9,
        lineDash: [5, 5],
      },
    });

    graph.paint();
  },

  handleMouseMove(e) {
    const { graph } = this;
    const { width, height } = this.shape.getBBox();

    const x = e.x - width / 2;
    const y = e.y - height / 2;

    this.shape.attr({
      x,
      y,
    });

    graph.paint();
  },

  handleMouseUp(e) {
    const { graph, core } = this;
    const { width, height } = this.shape.getBBox();

    let x = e.x;
    let y = e.y;

    const model = core.fromModel

    // TODO: 后继设置一个中心参数, 让控制定位
    x -= width / 2;
    y -= height / 2;

    this.shape.remove(true);

    this.core.commandManager.execute(EditorBuiltInCommand.Add, {
      type: ItemType.Node,
      model: {
        id: guid(),
        x,
        y,
        ...model,
      },
    });
  },
};
