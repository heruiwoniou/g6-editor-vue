import merge from 'lodash/merge'
import isArray from 'lodash/isArray'
import { ItemState, optimizeMultilineText } from '@/components/Editor'

const WRAPPER_BORDER_WIDTH = 2
const WRAPPER_HORIZONTAL_PADDING = 10

const WRAPPER_CLASS_NAME = 'node-wrapper'
const CONTENT_CLASS_NAME = 'node-content'
const LABEL_CLASS_NAME = 'node-label'

const BaseNode = {
  name: 'BaseNode',
  options: {
    size: [120, 60],
    wrapperStyle: {
      fill: '#5487ea',
      radius: 8
    },
    contentStyle: {
      fill: '#ffffff',
      radius: 6
    },
    labelStyle: {
      fill: '#000000',
      textAlign: 'center',
      textBaseline: 'middle'
    },
    stateStyles: {
      [ItemState.Active]: {
        wrapperStyle: {},
        contentStyle: {},
        labelStyle: {}
      },
      [ItemState.Selected]: {
        wrapperStyle: {},
        contentStyle: {},
        labelStyle: {}
      }
    }
  },

  getOptions(model) {
    return merge({}, this.options, model)
  },

  draw(model, group) {
    const keyShape = this.drawWrapper(model, group)

    this.drawContent(model, group)
    this.drawLabel(model, group)

    return keyShape
  },

  drawWrapper(model, group) {
    const [width, height] = this.getSize(model)
    const { wrapperStyle } = this.getOptions(model)

    const shape = group.addShape('rect', {
      className: WRAPPER_CLASS_NAME,
      attrs: {
        x: 0,
        y: 0,
        width,
        height: height,
        ...wrapperStyle
      }
    })

    return shape
  },

  drawContent(model, group) {
    const [width, height] = this.getSize(model)
    const { contentStyle } = this.getOptions(model)

    const shape = group.addShape('rect', {
      className: CONTENT_CLASS_NAME,
      attrs: {
        x: 0,
        y: WRAPPER_BORDER_WIDTH * 2,
        width,
        height: height - WRAPPER_BORDER_WIDTH * 2,
        ...contentStyle
      }
    })

    return shape
  },

  drawLabel(model, group) {
    const [width, height] = this.getSize(model)
    const { labelStyle } = this.getOptions(model)

    const shape = group.addShape('text', {
      className: LABEL_CLASS_NAME,
      attrs: {
        x: width / 2,
        y: height / 2,
        text: model.label,
        ...labelStyle
      }
    })

    this.setLabelText(model, group)

    return shape
  },

  setLabelText(model, group) {
    const shape = group.findByClassName(LABEL_CLASS_NAME)

    if (!shape) {
      return
    }

    const [width] = this.getSize(model)
    const { fontStyle, fontWeight, fontSize, fontFamily } = shape.attr()

    const text = model.label
    const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

    shape.attr('text', optimizeMultilineText(text, font, 2, width - WRAPPER_HORIZONTAL_PADDING * 2))
  },

  update(model, item) {
    const group = item.getContainer()

    this.setLabelText(model, group)
  },

  setState(name, value, item) {

    const group = item.getContainer()
    const model = item.getModel()
    const states = item.getStates()

    ;[WRAPPER_CLASS_NAME, CONTENT_CLASS_NAME, LABEL_CLASS_NAME].forEach(className => {
      const shape = group.findByClassName(className)
      const options = this.getOptions(model)

      const shapeName = className.split('-')[1]

      shape.attr({
        ...options[`${shapeName}Style`]
      })

      states.forEach(state => {
        if (options.stateStyles[state] && options.stateStyles[state][`${shapeName}Style`]) {
          shape.attr({
            ...options.stateStyles[state][`${shapeName}Style`]
          })
        }
      })
    })

    if (name === ItemState.Selected) {
      const wrapperShape = group.findByClassName(WRAPPER_CLASS_NAME)

      const [width, height] = this.getSize(model)

      if (value) {
        wrapperShape.attr({
          x: -WRAPPER_BORDER_WIDTH,
          y: 0,
          width: width + WRAPPER_BORDER_WIDTH * 2,
          height: height + WRAPPER_BORDER_WIDTH
        })
      } else {
        wrapperShape.attr({
          x: 0,
          y: 0,
          width,
          height,
        })
      }
    }
  },

  getSize(model) {
    const { size } = this.getOptions(model)

    if (!isArray(size)) {
      return [size, size]
    }

    return size
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

export default BaseNode
