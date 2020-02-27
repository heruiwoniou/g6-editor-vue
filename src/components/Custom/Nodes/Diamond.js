export default {
  name: 'Diamond',
  draw(cfg, group) {
    // 如果 cfg 中定义了 style 需要同这里的属性进行融合
    const shape = group.addShape('path', {
      attrs: {
        path: this.getPath(cfg), // 根据配置获取路径
        stroke: '#ff0000', // 颜色应用到描边上，如果应用到填充，则使用 fill: cfg.color
        fill: '#ff00dd'
      },
    });
    if (cfg.label) {
      // 如果有文本
      // 如果需要复杂的文本配置项，可以通过 labeCfg 传入
      // const style = (cfg.labelCfg && cfg.labelCfg.style) || {};
      // style.text = cfg.label;
      group.addShape('text', {
        // attrs: style
        attrs: {
          x: 0, // 居中
          y: 0,
          textAlign: 'center',
          textBaseline: 'middle',
          text: cfg.label,
          fill: '#666',
        },
      });
    }
    return shape;
  },
  // 返回菱形的路径
  getPath(cfg) {
    const size = cfg.size || [100, 100]; // 如果没有 size 时的默认大小
    const width = size[0];
    const height = size[1];
    //  / 1 \
    // 4     2
    //  \ 3 /
    const path = [
      ['M', 0, 0 - height / 2], // 上部顶点
      ['L', width / 2, 0], // 右侧顶点
      ['L', 0, height / 2], // 下部顶点
      ['L', -width / 2, 0], // 左侧顶点
      ['Z'], // 封闭
    ];
    return path;
  }
}