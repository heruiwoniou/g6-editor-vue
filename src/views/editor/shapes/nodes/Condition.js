import merge from 'lodash/merge'
import { ItemState, optimizeMultilineText } from '@/components/Editor'

const OFFSET_SIZE = 10
const WRAPPER_HORIZONTAL_PADDING = 10

const WRAPPER_CLASS_NAME = 'node-wrapper'
const LABEL_CLASS_NAME = 'node-label'

export default {
  name: 'Condition',
  options: {
    // required
    size: [120, 60],
    // required
    stateClassNames: [WRAPPER_CLASS_NAME, LABEL_CLASS_NAME],
    wrapperStyle: {
      fill: '#ffffff',
      stroke: '#5487ea',
      radius: 10,
      lineWidth: 2,
      shadowBlur: 0,
      shadowColor: null
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
    this.drawLabel(model, group)

    return keyShape
  },
  drawWapper(model, group) {
    const {
      size: [width, height],
      wrapperStyle
    } = this.getOptions(model)
    return group.addShape('polygon', {
      className: WRAPPER_CLASS_NAME,
      attrs: {
        x: 0,
        y: 0,
        points: [
          [0, height / 2],
          [width / 2, 0],
          [width, height / 2],
          [width / 2, height],
        ],
        width,
        height: height,
        ...wrapperStyle
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