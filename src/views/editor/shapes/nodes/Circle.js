import { ItemState, optimizeMultilineText } from '@/components/Editor'
import merge from 'lodash/merge'

const WRAPPER_BORDER_WIDTH = 2
const WRAPPER_HORIZONTAL_PADDING = 20
const WRAPPER_CLASS_NAME = 'circle-wrapper'

export default {
  name: 'Circle',
  options: {
    size: [100],
    stateClassNames: [WRAPPER_CLASS_NAME],
    wrapperStyle: {
      fill: '#5487ea',
      shadowBlur: 0,
      shadowColor: null
    },
    contentStyle: {
      fill: '#ffffff'
    },
    stateStyles: {
      [ItemState.Selected]: {
        wrapperStyle: {
          shadowBlur: 5,
          shadowColor: '#4ea4ff'
        }
      }
    }
  },

  getOptions(model) {
    return merge({}, this.options, model)
  },

  draw(model, group) {
    const {
      size: [width, height = width],
      wrapperStyle,
      contentStyle
    } = this.getOptions(model)
  
    const r = width / 2

    const wrapper = group.addShape('circle', {
      className: WRAPPER_CLASS_NAME,
      attrs: {
        x: r,
        y: r,
        r: r - WRAPPER_BORDER_WIDTH,
        width,
        height,
        ...wrapperStyle
      }
    })

    group.addShape('circle', {
      attrs: {
        x: r,
        y: r,
        r: r - 2 * WRAPPER_BORDER_WIDTH,
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
  getAnchorPoints() {
    return [
      [0, 0.5],
      [1, 0.5],
      [0.5, 0],
      [0.5, 1]
    ]
  }
}
