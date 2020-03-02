import G6 from '@antv/g6'
import merge from 'lodash/merge'
import debounce from 'lodash/debounce'
import cloneDeep from 'lodash/cloneDeep'
import { guid, getGraphState, generatePreview } from '../utils'
import CommandManager from './CommandManager'
import BehaviorManager from './BehaviorManager'
import BuiltInNodes from '../built-in/shape/nodes'
import BuiltInEdges from '../built-in/shape/edges'
import { ItemState, EditorEvent } from '../common/constants'
import bindHandles from '../built-in/common/bindHandles'
import { EventEmitter } from 'events'

export default class EditorCore extends EventEmitter {
  guid = null
  graph = null
  commandManager = null
  behaviorManager = null
  // 预览图的缓存
  shapes = {}
  // 拖拽用的标记和缓存
  fromModelClassName = 'delegate-model'
  fromModel = null
  // 复制粘贴的缓存
  clipboard = { models: [] }
  defaultConfig = {
    defaultNode: {
      shape: 'FlowNode'
    },
    defaultEdge: {
      shape: 'FlowEdge'
    }
  }
  // 延时触发ready事件, 为生成预览图提供空白场景
  startReadyEventListener = debounce(function(){
    this.emit(EditorEvent.onAfterEditorReady)
  }, 1000)
  editorDefaultMethodsQueue = {
    canDragNode: [
      e => !['anchor', 'banAnchor'].some(item => item === e.target.get('className'))
    ],
    canDragOrZoomCanvas: [() => true]
  }

  constructor(graphConfig, editorConfig = {}) {
    super()
    this.initialize(graphConfig, editorConfig)
    window.core = this
    this.startReadyEventListener()
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

  initialize({ guid, ...graphConfig }, editorConfig) {
    this.guid = guid || `editor-${guid()}`
    this.commandManager = new CommandManager(this)
    this.behaviorManager = new BehaviorManager(this)
    this.setOptions(graphConfig, editorConfig)
    this.graph = new G6.Graph(this.options)
    this.commandManager.bindCommandShortcuts()
    this.registerBuiltInShape()
  }

  // 为Register控件提供外部接口
  regsitor(name, options, type) {
    options = cloneDeep(options)
    switch (type) {
      case 'node': {
        const { extend, ...config } = options
        const drawConfig = bindHandles(config)
        G6.registerNode(name, drawConfig, extend)
        this.shapes[name] = drawConfig
        this.buildPreview()
        this.startReadyEventListener()
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

  buildPreview() {
    generatePreview(this.shapes, this)
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
