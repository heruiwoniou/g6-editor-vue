import { ItemState, optimizeMultilineText } from '@/components/Editor'

const WRAPPER_BORDER_WIDTH = 2
const WRAPPER_HORIZONTAL_PADDING = 20
const WRAPPER_CLASS_NAME = 'circle-wrapper'

export default {
  name: 'Circle',
  options: {
    size: [120],
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
      size,
      wrapperStyle,
      contentStyle
    } = this.options

    const width = size
    const height = size
    const r = size / 2

    const wrapper = group.addShape('circle', {
      className: WRAPPER_CLASS_NAME,
      attrs: {
        x: r,
        y: r,
        r,
        width,
        height,
        ...wrapperStyle
      }
    })

    group.addShape('circle', {
      attrs: {
        x: r,
        y: r,
        r: r - WRAPPER_BORDER_WIDTH,
        width,
        height,
        ...contentStyle
      }
    })

    if (model.label) {
      const textShape = group.addShape('text', {
        attrs: {
          x: r,
          y: r,
          textAlign: 'center',
          textBaseline: 'middle',
          text: model.label,
          fill: '#666'
        }
      })
      const { fontStyle, fontWeight, fontSize, fontFamily } = textShape.attr()
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
      size
    } = this.options
    const r = size / 2
    const wrapperShape = group.findByClassName(WRAPPER_CLASS_NAME)
    if (name === ItemState.Selected) {
      if (value) {
        wrapperShape.attr({
          r: r + WRAPPER_BORDER_WIDTH,
        })
      } else {
        wrapperShape.attr({
          r,
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
