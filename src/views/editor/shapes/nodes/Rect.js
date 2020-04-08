import merge from 'lodash/merge'
import isArray from 'lodash/isArray'
import { ItemState, optimizeMultilineText } from '@/components/Editor'

const WRAPPER_BORDER_WIDTH = 1
const WRAPPER_HORIZONTAL_PADDING = 10

const WRAPPER_CLASS_NAME = 'node-wrapper'
const CONTENT_CLASS_NAME = 'node-content'
const LABEL_CLASS_NAME = 'node-label'

const Rect = {
  name: 'Rect',
  options: {
    // require
    size: [120, 60],
    // require
    stateClassNames: [WRAPPER_CLASS_NAME, CONTENT_CLASS_NAME, LABEL_CLASS_NAME],
    wrapperStyle: {
      fill: '#5487ea',
      shadowBlur: 0,
      shadowColor: null
    },
    contentStyle: {
      fill: '#ffffff'
    },
    labelStyle: {
      fill: '#000000',
      textAlign: 'center',
      textBaseline: 'middle'
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
    const keyShape = this.drawWapper(model, group)
    this.drawContent(model, group)
    this.drawLabel(model, group)

    return keyShape
  },
  drawWapper(model, group) {
    const {
      size: [width, height],
      wrapperStyle
    } = this.getOptions(model)
    return group.addShape('rect', {
      className: WRAPPER_CLASS_NAME,
      attrs: {
        x: 0,
        y: 0,
        width,
        height: height,
        ...wrapperStyle
      }
    })
  },
  drawContent(model, group) {
    const {
      size: [width, height],
      contentStyle
    } = this.getOptions(model)
    group.addShape('rect', {
      className: CONTENT_CLASS_NAME,
      attrs: {
        x: WRAPPER_BORDER_WIDTH,
        y: 3 * WRAPPER_BORDER_WIDTH,
        width: width - 2 * WRAPPER_BORDER_WIDTH,
        height: height - 4 * WRAPPER_BORDER_WIDTH,
        ...contentStyle
      }
    })
  },
  drawLabel(model, group) {
    const {
      size: [width, height],
      labelStyle
    } = this.getOptions(model)

    group.addShape('text', {
      className: LABEL_CLASS_NAME,
      attrs: {
        x: width / 2,
        y: height / 2,
        text: model.label,
        ...labelStyle
      }
    })

    this.setLabelText(model, group)
  },
  setLabelText(model, group) {
    const shape = group.findByClassName(LABEL_CLASS_NAME)

    if (!shape) {
      return
    }

    const {
      size: [width]
    } = this.getOptions(model)
    const { fontStyle, fontWeight, fontSize, fontFamily } = shape.attr()

    const text = model.label
    const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

    shape.attr('text', optimizeMultilineText(text, font, 2, width - WRAPPER_HORIZONTAL_PADDING * 2))
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

export default Rect
