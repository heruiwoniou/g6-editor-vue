import merge from 'lodash/merge'
import { ItemState, optimizeMultilineText } from '@/components/Editor'

const MARGIN_SIZE = 10
const ITEM_MARGIN_SIZE = 5
const ITEM_WIDTH = 70 // 不含有5边距
const ITEM_HEIGHT = 50
const NODE_HEIGHT = 90

const WRAPPER_CLASS_NAME = 'node-wrapper'
const CONTENT_CLASS_NAME = 'node-content'
const LABEL_CLASS_NAME = 'node-label'

export default {
  name: 'VariableCollect',
  options: {
    // required
    size: [2 * MARGIN_SIZE + 2 * (ITEM_WIDTH + MARGIN_SIZE), NODE_HEIGHT],
    // required
    stateClassNames: [WRAPPER_CLASS_NAME, CONTENT_CLASS_NAME, LABEL_CLASS_NAME],
    wrapperStyle: {
      fill: '#ffffff',
      stroke: '#5487ea',
      lineWidth: 2,
      shadowBlur: 0,
      shadowColor: null
    },
    contentStyle: {
      fill: '#ffffff',
      stroke: '#5487ea',
      lineWidth: 2,
      shadowBlur: 0,
      shadowColor: null
    },
    itemStyle: {
      fill: '#FFE1B3',
      stroke: '#E6A23C'
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
    const [width] = this.options.size
    return merge({}, this.options, model, { actualWidth: model.isPreview || model.defaultValues.items.length <= 2 ? width : (model.defaultValues.items.length * 80 + MARGIN_SIZE * 2) })
  },
  draw(model, group) {
    const keyShape = this.drawWapper(model, group)
    this.drawContent(model, group)
    if (!model.isPreview) {
      this.drawItems(model, group)
    }
    this.drawLabel(model, group)

    return keyShape
  },
  drawWapper(model, group) {
    const {
      size: [, height],
      actualWidth,
      wrapperStyle
    } = this.getOptions(model)
    return group.addShape('rect', {
      className: WRAPPER_CLASS_NAME,
      attrs: {
        x: 0,
        y: 0,
        width: actualWidth,
        height: height,
        ...wrapperStyle
      }
    })
  },
  drawContent(model, group) {
    const {
      size: [, height],
      actualWidth,
      contentStyle
    } = this.getOptions(model)
    return group.addShape('rect', {
      className: CONTENT_CLASS_NAME,
      attrs: {
        x: MARGIN_SIZE,
        y: 0,
        width: actualWidth - 2 * MARGIN_SIZE,
        height: height,
        ...contentStyle
      }
    })
  },
  drawItems(model, group) {
    const {
      size: [, height],
      itemStyle
    } = this.getOptions(model);
    (model.defaultValues?.items || []).map((o, index) => {
      const offsetX = MARGIN_SIZE + (index + 1) * ITEM_MARGIN_SIZE + index * (ITEM_WIDTH + ITEM_MARGIN_SIZE)
      const offsetY = height / 3 
      group.addShape('polygon', {
        attrs: {
          x: 0,
          y: 0,
          points: [
            [offsetX, offsetY + ITEM_HEIGHT / 2],
            [offsetX + ITEM_WIDTH / 2, offsetY],
            [offsetX + ITEM_WIDTH, offsetY + ITEM_HEIGHT / 2],
            [offsetX + ITEM_WIDTH / 2, offsetY + ITEM_HEIGHT],
          ],
          ...itemStyle
        }
      })

      const className = LABEL_CLASS_NAME + index
      group.addShape('text', {
        className,
        attrs: {
          x: offsetX + ITEM_WIDTH / 2,
          y: offsetY + ITEM_HEIGHT / 2,
          text: o.value,
          fill: '#000000',
          textAlign: 'center',
          textBaseline: 'middle'
        }
      })

      this.setLabelText(model, group, className, ITEM_WIDTH, o.value)
    })
  },
  drawLabel(model, group) {
    const {
      size: [, height],
      actualWidth,
      labelStyle
    } = this.getOptions(model)

    group.addShape('text', {
      className: LABEL_CLASS_NAME,
      attrs: {
        x: actualWidth / 2,
        y: height / 3 / 2,
        text: model.label,
        ...labelStyle
      }
    })

    this.setLabelText(model, group)
  },
  setLabelText(model, group, className, width, label) {
    const shape = group.findByClassName(className || LABEL_CLASS_NAME)

    if (!shape) {
      return
    }

    const {
      actualWidth
    } = this.getOptions(model)
    const { fontStyle, fontWeight, fontSize, fontFamily } = shape.attr()

    const text = label || model.label
    const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

    shape.attr(
      'text',
      optimizeMultilineText(text, font, 2, width || (actualWidth - MARGIN_SIZE * 2 - MARGIN_SIZE * 2))
    )
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
