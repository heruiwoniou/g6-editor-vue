import { ItemType, ItemState, GraphState, EditorEvent } from '../common/constants'

export function createDelayCore() {
  const delayCore = {}
  const promise = new Promise(resolve => {
    delayCore.resolve = resolve
  })
  delayCore.get = promise
  return delayCore
}

/** 生成唯一标识 */
export function guid() {
  return 'xxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** 执行批量处理 */
export function executeBatch(graph, execute) {
  const autoPaint = graph.get('autoPaint')
  graph.setAutoPaint(false)
  execute()
  graph.paint()
  graph.setAutoPaint(autoPaint)
}

/** 判断是否节点 */
export function isNode(item) {
  return item.getType() === ItemType.Node
}

/** 判断是否边线 */
export function isEdge(item) {
  return item.getType() === ItemType.Edge
}

/** 获取选中节点 */
export function getSelectedNodes(graph) {
  return graph.findAllByState(ItemType.Node, ItemState.Selected)
}

/** 获取选中边线 */
export function getSelectedEdges(graph) {
  return graph.findAllByState(ItemType.Edge, ItemState.Selected)
}

/** 获取图表状态 */
export function getGraphState(graph) {
  let graphState = GraphState.MultiSelected

  const selectedNodes = getSelectedNodes(graph)
  const selectedEdges = getSelectedEdges(graph)

  if (selectedNodes.length === 1 && !selectedEdges.length) {
    graphState = GraphState.NodeSelected
  }

  if (selectedEdges.length === 1 && !selectedNodes.length) {
    graphState = GraphState.EdgeSelected
  }

  if (!selectedNodes.length && !selectedEdges.length) {
    graphState = GraphState.CanvasSelected
  }

  return graphState
}

/** 设置选中元素 */
export function setSelectedItems(graph, items) {
  executeBatch(graph, () => {
    const selectedNodes = getSelectedNodes(graph)
    const selectedEdges = getSelectedEdges(graph)

    ;[...selectedNodes, ...selectedEdges].forEach(node => {
      graph.setItemState(node, ItemState.Selected, false)
    })

    items.forEach(item => {
      graph.setItemState(item, ItemState.Selected, true)
    })
  })

  graph.emit(EditorEvent.onGraphStateChange, {
    graphState: getGraphState(graph)
  })
}

/** 清除选中状态 */
export function clearSelectedState(graph, shouldUpdate = () => true) {
  const selectedNodes = getSelectedNodes(graph)
  const selectedEdges = getSelectedEdges(graph)

  executeBatch(graph, () => {
    [...selectedNodes, ...selectedEdges].forEach(item => {
      if (shouldUpdate(item)) {
        graph.setItemState(item, ItemState.Selected, false)
      }
    })
  })
}

/** 获取回溯路径 */
export function getFlowRecallEdges(graph, node, targetIds = [], edges = []) {
  const inEdges = node.getInEdges()

  if (!inEdges.length) {
    return []
  }

  inEdges.map(edge => {
    const sourceId = edge.getModel().source
    const sourceNode = graph.findById(sourceId)

    edges.push(edge)

    const targetId = node.get('id')

    targetIds.push(targetId)

    if (!targetIds.includes(sourceId)) {
      getFlowRecallEdges(graph, sourceNode, targetIds, edges)
    }
  })

  return edges
}

export const transformKebabCase = (name = '') => {
  return name.replace(/([A-Z])/g, s => `-${s.toLocaleLowerCase()}`).replace(/^-/, '')
}

export const transformVueEventName = (name = '') => {
  return transformKebabCase(name.replace(/^on/i, ''))
}

const canvas = document.createElement('canvas')
const canvasContext = canvas.getContext('2d')

export function optimizeMultilineText(text, font, maxRows, maxWidth) {
  canvasContext.font = font

  if (canvasContext.measureText(text).width <= maxWidth) {
    return text
  }

  let multilineText = []

  let tempText = ''
  let tempTextWidth = 0

  for (const char of text) {
    const { width } = canvasContext.measureText(char)

    if (tempTextWidth + width >= maxWidth) {
      multilineText.push(tempText)

      tempText = ''
      tempTextWidth = 0
    }

    tempText += char
    tempTextWidth += width
  }

  if (tempText) {
    multilineText.push(tempText)
  }

  if (multilineText.length > maxRows) {
    const ellipsis = '...'
    const ellipsisWidth = canvasContext.measureText(ellipsis).width

    let tempText = ''
    let tempTextWidth = 0

    for (const char of multilineText[maxRows - 1]) {
      const { width } = canvasContext.measureText(char)

      if (tempTextWidth + width > maxWidth - ellipsisWidth) {
        break
      }

      tempText += char
      tempTextWidth += width
    }

    multilineText = multilineText.slice(0, maxRows - 1).concat(`${tempText}${ellipsis}`)
  }

  return multilineText.join('\n')
}

export function generatePreview(shapes, core) {
  let keys = Object.keys(shapes)
  keys = keys.filter(key => {
    const cache = window.localStorage.getItem(`shapes-${key}`)
    if (cache) {
      const shape = shapes[key]
      shape.preview = cache
      return false
    }
    return true
  })
  keys.forEach((shapeName, index) => {
    const shape = shapes[shapeName]
    if (!shape.preview) {
      shape.preview = clipImage(
        generateFullImage(
          guid(),
          shapeName,
          shape,
          core
        ),
        index
      )
    }
  })
}

export function generateFullImage(id, shapeName, shape, { graph }) {
  return function() {
    let x = 0
    let y = 0
    graph.add(ItemType.Node, {
      id,
      shape: shapeName,
      label: '',
      x,
      y
    })
    const [clipWidth, clipHeight = clipWidth] = shape.options.size
    graph.paint()
    const original = graph.toDataURL()
    graph.removeItem(id)

    return {
      clipWidth,
      clipHeight,
      original,
      shapeName,
      shape
    }
  }
}

export function clipImage(getOriginalImage, index) {
  let img = new Image()
  let canvas = document.createElement('canvas')
  let canvasContext = canvas.getContext('2d')
  const devicePixelRatio = window.devicePixelRatio || 1,
  backingStoreRatio = canvasContext.webkitBackingStorePixelRatio ||
  canvasContext.mozBackingStorePixelRatio ||
  canvasContext.msBackingStorePixelRatio ||
  canvasContext.oBackingStorePixelRatio ||
  canvasContext.backingStorePixelRatio || 1,
  ratio = devicePixelRatio / backingStoreRatio;

  setTimeout(() => {
    const { shape, shapeName, original, clipWidth, clipHeight } = getOriginalImage()
    img.src = original
   

    img.onload = function() {
      const height = this.height || this.naturalHeight
      const width = this.width || this.naturalWidth
      canvas.width = clipWidth * ratio
      canvas.height = clipHeight * ratio

      canvasContext.drawImage(this, 0, 0, width, height)
      shape.preview = canvas.toDataURL('image/png')
      window.localStorage.setItem(`shapes-${shapeName}`, shape.preview)
      img = null
      canvas = null
      canvasContext = null
    }
  }, index * 200)

  return 'loading'
}
