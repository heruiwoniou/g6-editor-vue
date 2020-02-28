import { ItemState, optimizeMultilineText } from './node_modules/@/components/Editor'

const WRAPPER_BORDER_WIDTH = 2
const WRAPPER_HORIZONTAL_PADDING = 20
const WRAPPER_CLASS_NAME = 'diamond-wrapper'

export default {
  name: 'Diamond',
  options: {
    size: [120, 80],
    wrapperStyle: {
      fill: '#5487ea',
      radius: 8
    },
    contentStyle: {
      fill: '#ffffff',
      radius: 6
    }
  },
  draw(model, group) {
    const {
      size: [width, height],
      wrapperStyle,
      contentStyle
    } = this.options

    const wrapper = group.addShape('polygon', {
      className: WRAPPER_CLASS_NAME,
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...wrapperStyle,
        points: [
          [width / 2, -WRAPPER_BORDER_WIDTH * 2],
          [width, height / 2 - WRAPPER_BORDER_WIDTH * 2],
          [width / 2, height - WRAPPER_BORDER_WIDTH * 2],
          [0, height / 2 - WRAPPER_BORDER_WIDTH * 2]
        ]
      }
    })

    group.addShape('polygon', {
      attrs: {
        x: 0,
        y: 0,
        width,
        height,
        ...contentStyle,
        points: [
          [width / 2, 0],
          [width, height / 2],
          [width / 2, height],
          [0, height / 2]
        ]
      }
    })

    if (model.label) {
      const textShape = group.addShape('text', {
        attrs: {
          x: width / 2,
          y: height / 2,
          textAlign: 'center',
          textBaseline: 'middle',
          text: model.label,
          fill: '#666'
        }
      })
      const { fontStyle, fontWeight, fontSize, fontFamily } = textShape.attr()
      const text = model.label
      const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

      textShape.attr({
        text: optimizeMultilineText(model.label, font, 2, width - WRAPPER_HORIZONTAL_PADDING * 2)
      })
    }
    return wrapper
  },
  setState(name, value, item) {
    const group = item.getContainer()
    const {
      size: [width, height]
    } = this.options
    const wrapperShape = group.findByClassName(WRAPPER_CLASS_NAME)
    if (name === ItemState.Selected) {
      if (value) {
        wrapperShape.attr({
          points: [
            [width / 2, -WRAPPER_BORDER_WIDTH * 2],
            [width + WRAPPER_BORDER_WIDTH, height / 2],
            [width / 2, height + WRAPPER_BORDER_WIDTH],
            [-WRAPPER_BORDER_WIDTH, height / 2]
          ]
        })
      } else {
        wrapperShape.attr({
          points: [
            [width / 2, -WRAPPER_BORDER_WIDTH * 2],
            [width + WRAPPER_BORDER_WIDTH, height / 2],
            [width / 2, height - WRAPPER_BORDER_WIDTH * 2],
            [-WRAPPER_BORDER_WIDTH, height / 2]
          ]
        })
      }
    }
  },
  getAnchorPoints() {
    return [
      [0, 0.5],
      [1, 0.5],
      [0.5, 0],
      [0.5, 1]
    ]
  }
}
