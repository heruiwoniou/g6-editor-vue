import globalStyle from './globalStyle'
import FSM from './stateMachine'

const {
  anchorPointStyle,
  anchorPointHoverStyle,
  anchorHotsoptActivedStyle,
  anchorHotsoptStyle,
  zIndex
} = globalStyle

function getAllAnchors (group) {
  return group
    .get('children')
    .filter(e => ['anchor', 'anchorSpot', 'banAnchor'].some(a => e.get('className') === a))
}

function handleAnchor(name, value, item) {
  if (!item._anchorFSM) item._anchorFSM = FSM('none')
  const fsm = item._anchorFSM
  const model = item.getModel()
  // 拿到 group
  const group = item.getContainer()
  // 拿到所有的锚点
  const anchors = _ => getAllAnchors(group)

  const isActiveAnchor = name => name.includes('activeAnchor')

  const showAnchor = () => {
    removeAllAnchor()
    drawAnchor.call(this, model, group)
    if (item.hasState('addingEdge')) {
      anchors().forEach(a => a.showHotspot())
    }
  }

  const showBanAnchor = () => {
    removeAllAnchor()
    drawBanAnchor.call(this, model, group)
  }

  const activeAnchor = () =>
    anchors().forEach(a => {
      if (a.get('index') != name.slice(-1)) return
      if (item.hasState('addingEdge')) a.setHotspotActived && a.setHotspotActived(true)
      else a.setActived()
    })

  const clearActivedAnchor = () =>
    anchors().forEach(a => {
      if (a.get('index') != name.slice(-1)) return
      if (item.hasState('addingEdge')) a.setHotspotActived && a.setHotspotActived(false)
      else a.clearActived()
    })

  
  const removeAllAnchorSpot = () => !item.hasState('addingEdge') && anchors().forEach(a => a.remove())

  const removeAllAnchor = () => {
    anchors().forEach(a => a.remove())
  }
  const stateTable = [
    { e: 'hoverNode', f: 'none', t: 'showAnchor', action: showAnchor },
    { e: 'enterLimitNode', t: 'showBanAnchor', action: showBanAnchor },
    
    {
      e: 'enterAnchor',
      f: 'showAnchor',
      t: 'activeAnchor',
      action: activeAnchor
    },
    {
      e: 'leaveAnchor',
      f: 'activeAnchor',
      t: 'showAnchor',
      action: clearActivedAnchor
    },
    { e: 'drag', t: 'showAnchor', action: showAnchor },
    { e: 'dragEnd', t: 'none', action: removeAllAnchor },
    { e: 'leaveNode', t: 'none', action: removeAllAnchorSpot }
  ]

  fsm.setStateTable(stateTable)

  // 处于拖拽状态的节点，所有 action 都禁止执行
  if (name === 'addingSource' && value) fsm.canExecAction(false)
  if (name === 'addingSource' && !value) fsm.canExecAction(true)

  if (name === 'active') {
    value ? fsm.transtion('hoverNode') : fsm.transtion('leaveNode')
  }

  if (name === 'limitLink') {
    value ? fsm.transtion('enterLimitNode') : fsm.transtion('leaveNode')
  }

  if (isActiveAnchor(name)) value ? fsm.transtion('enterAnchor') : fsm.transtion('leaveAnchor')
  if (name === 'addingEdge' || name === 'addingSource')
    value ? fsm.transtion('drag') : fsm.transtion('dragEnd')
}

function drawBanAnchor(model, group) {
  const anchorPoints = this.getAnchorPoints(model)
  return anchorPoints.map((p, index) => {
    const keyShape = group.get('item').getKeyShape()
    const width = keyShape.attr('width') || keyShape.attr('r') * 2
    const height = keyShape.attr('height') || keyShape.attr('r') * 2
    const [x, y] = [p[0], p[1]]
    const banImgSize = { w: 9, h: 8}
    const attrs = { x: width * x - banImgSize.w / 2, y: height * y - banImgSize.h / 2 }
    const shape = group.addShape('image', {
      className: 'banAnchor',
      attrs: {
        img:
          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOSIgaGVpZ2h0PSI4IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xLjUxNSAxLjE3Mmw1LjY1NyA1LjY1Nm0wLTUuNjU2TDEuNTE1IDYuODI4IiBzdHJva2U9IiNGRjYwNjAiIHN0cm9rZS13aWR0aD0iMS42IiBmaWxsPSJub25lIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIi8+PC9zdmc+',
        width: banImgSize.w,
        height: banImgSize.h,
        ...attrs
      },
      index,
      zIndex: zIndex.anchorPoint
    })
    return shape
  })
}

function drawAnchor(model, group) {
  const anchorPoints = this.getAnchorPoints(model)
  // 为每个点添加标记
  return anchorPoints.map((p, index) => {
    const keyShape = group.get('item').getKeyShape()
    const width = keyShape.attr('width') || keyShape.attr('r') * 2
    const height = keyShape.attr('height') || keyShape.attr('r') * 2
    const [x, y] = [p[0], p[1]]
    let hotspot
    const attrs = { x: width * x, y: height * y }
    const shape = group.addShape('marker', {
      className: 'anchor',
      attrs: {
        symbol: 'circle',
        ...anchorPointStyle,
        ...attrs
      },
      index,
      zIndex: zIndex.anchorPoint
    })
    shape.showHotspot = () => {
      hotspot = group.addShape('marker', {
        className: 'anchorSpot',
        attrs: {
          symbol: 'circle',
          ...anchorHotsoptStyle,
          ...attrs
        },
        index,
        zIndex: zIndex.anchorHotsopt
      })

      // 让 hotspot 显示在更上层的图层
      hotspot.toFront()
      shape.toFront()
    }
    shape.setActived = () => shape.attr(anchorPointHoverStyle)

    shape.clearActived = () => shape.attr(anchorPointStyle)

    shape.setHotspotActived = bool => {
      if (hotspot) {
        if (bool) hotspot.attr(anchorHotsoptActivedStyle)
        else hotspot.attr(anchorHotsoptStyle)
      }
    }
    return shape
  })
}

function setStateHander(name, value, item) {
  const group = item.getContainer()
  const model = item.getModel()
  const states = item.getStates()
  const options = this.getOptions(model)

  options.stateClassNames.forEach(className => {
    const shape = group.findByClassName(className)
    const shapeName = className.split('-')[1]
    const { [shapeName + 'Style']: normalStateStyle } = options
    shape.attr({
      ...normalStateStyle
    })
    states.forEach(state => {
      const {
        stateStyles: { [state]: { [shapeName + 'Style']: currentStateStyle = {} } = {} }
      } = options
      shape.attr({
        ...currentStateStyle
      })
    })
  })
}

function bindHandleAnchor(config) {
  const _beforeSetState = config.beforeSetState || function(name, value, item) {}
  config.beforeSetState = function(name, value, item) {
    _beforeSetState.call(this, name, value, item)
    handleAnchor.call(this, name, value, item)
    setStateHander.call(this, name, value, item)
  }
}

function bindSetState(config) {
  const _setState = config.setState || function() {}
  config.setState = function(name, value, item) {
    if (this.beforeSetState) {
      this.beforeSetState(name, value, item)
    }
    _setState.call(this, name, value, item)
  }
}

export default function bindHandles(config) {
  bindHandleAnchor(config)
  bindSetState(config)

  return config
}
