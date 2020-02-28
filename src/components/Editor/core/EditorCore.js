import G6 from '@antv/g6'
import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import { guid, getGraphState } from '../utils'
import CommandManager from './CommandManager'
import BehaviorManager from './BehaviorManager'
import BuiltInNodes from '../built-in/shape/nodes'
import BuiltInEdges from '../built-in/shape/edges'
import { ItemState, EditorEvent } from '../common/constants'
import bindHandles from '../built-in/common/bindHandles'

export default class EditorCore {
  guid = null
  graph = null
  commandManager = null
  behaviorManager = null
  defaultConfig = {
    defaultNode: {
      shape: 'FlowNode'
    },
    defaultEdge: {
      shape: 'FlowEdge'
    }
  }
  editorDefaultMethodsQueue = {
    canDragNode: [
      e => !['anchor', 'banAnchor'].some(item => item === e.target.get('className'))
    ],
    canDragOrZoomCanvas: [() => true]
  }

  constructor(graphConfig, editorConfig = {}) {
    this.initialize(graphConfig, editorConfig)
  }

  setOptions(graphConfig, editorConfig = {}) {
    Object.keys(this.editorDefaultMethodsQueue).forEach(method => {
      let fn = editorConfig[method]
      fn && this.editorDefaultMethodsQueue[method].push(fn)
    })

    this.options = merge(
      this.defaultConfig,
      graphConfig,
      { modes: this.behaviorManager.getRegisteredBehaviors() },
      {
        modes: {
          default: {
            'drag-node': {
              type: 'drag-node',
              enableDelegate: true,
              shouldBegin: this.canDragNode.bind(this)
            },
            'zoom-canvas': {
              type: 'zoom-canvas',
              shouldBegin: this.canDragOrZoomCanvas.bind(this)
            },
            'brush-select': {
              type: 'brush-select',
              trigger: 'ctrl',
              selectedState: ItemState.Selected,
              onSelect() {
                this.graph.emit(EditorEvent.onGraphStateChange, {
                  graphState: getGraphState(this.graph),
                });
              }
            }
          }
        }
      }
    )
  }

  initialize(graphConfig, editorConfig) {
    this.guid = guid()
    this.commandManager = new CommandManager()
    this.behaviorManager = new BehaviorManager(this.guid, this.commandManager)
    this.setOptions(graphConfig, editorConfig)
    this.registerBuiltInShape()
    this.graph = new G6.Graph(this.options)
    this.commandManager.setGraph(this.graph)
    this.commandManager.bindCommandShortcuts()
  }

  // 为Register控件提供外部接口
  regsitor(name, options, type) {
    options = cloneDeep(options)
    switch (type) {
      case 'node': {
        const { extend, ...config } = options
        G6.registerNode(name, bindHandles(config), extend)
        break
      }
      case 'edge': {
        const { extend, ...config } = options
        G6.registerEdge(name, config, extend)
        break
      }
      case 'command': {
        this.commandManager.regsitor(name, options)
        break
      }
      case 'behavior': {
        this.behaviorManager.regsitor(name, options)
        break
      }
    }
  }

  registerBuiltInShape() {
    Object.keys(BuiltInNodes).forEach(nodeName => {
      this.regsitor(nodeName, BuiltInNodes[nodeName], 'node')
    })

    Object.keys(BuiltInEdges).forEach(edgeName => {
      this.regsitor(edgeName, BuiltInEdges[edgeName], 'edge')
    })
  }

  read(data) {
    const { nodes, edges } = data

    ;[...nodes, ...edges].forEach(item => {
      const { id } = item

      if (id) {
        return
      }

      item.id = guid()
    })

    this.graph.read(data)
  }

  canDragNode(...args) {
    return this.editorDefaultMethodsQueue['canDragNode'].reduce(
      (ret, cur) => ret && cur.bind(this)(...args),
      true
    )
  }

  canDragOrZoomCanvas(...args) {
    return this.editorDefaultMethodsQueue['canDragOrZoomCanvas'].reduce(
      (ret, cur) => ret && cur.apply(this, ...args),
      true
    )
  }
}
