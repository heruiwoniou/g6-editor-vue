import merge from 'lodash/merge'
import { ItemState, optimizeMultilineText } from '@/components/Editor'

const WRAPPER_HORIZONTAL_PADDING = 10

const WRAPPER_CLASS_NAME = 'node-wrapper'
const LABEL_CLASS_NAME = 'node-label'

export default {
  name: 'Answer',
  options: {
    // required
    size: [150, 60],
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
    return group.addShape('path', {
      className: WRAPPER_CLASS_NAME,
      attrs: {
        x: 0,
        y: 0,
        // A rx ry x-axis-rotation large-arc-flag sweep-flag x y
        // rx：x轴半径
        // ry：y轴半径
        // x-axis-rotation：指椭圆的X轴与水平方向顺时针方向夹角，可以想像成一个水平的椭圆绕中心点顺时针旋转的角度
        // large-arc-flag：1表示大角度弧线，0为小角度弧线。
        // sweep-flag：1为顺时针方向，0为逆时针方向
        // x：结束点x坐标
        // y：结束点y坐标
        path: [
          ['M', height / 2, 0],
          ['A', height / 2, height / 2, 90, 1, 0, height / 2, height],
          ['L', width, height],
          ['A', height / 2, height / 2, 90, 1, 1, width, 0],
          ['Z']
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
        x: (width - height / 2) / 2,
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
      size: [width, height]
    } = this.getOptions(model)
    const { fontStyle, fontWeight, fontSize, fontFamily } = shape.attr()

    const text = model.label
    const font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`

    shape.attr('text', optimizeMultilineText(text, font, 2, width - height / 2 - WRAPPER_HORIZONTAL_PADDING * 2))
  },
  getAnchorPoints() {
    return [
      [0.5, 0],
      [0.5, 1]
    ]
  }
}