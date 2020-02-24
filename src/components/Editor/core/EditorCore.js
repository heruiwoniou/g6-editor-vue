import G6 from '@antv/g6'
import merge from 'lodash/merge'
import isArray from 'lodash/isArray'
import { guid } from '../utils'
import CommandManager from './CommandManager'
import BehaviorManager from './BehaviorManager'
import BuiltInNodes from '../built-in/shape/nodes'
import BuiltInEdges from '../built-in/shape/edges'
import { GraphCommonEvent, RendererType } from '../common/constants'

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
      (e) => !['anchor', 'banAnchor'].some(item => item === e.target.get('className'))
    ],
    canDragOrZoomCanvas: [
      () => true
    ]
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
              shouldBegin: this.canDragNode.bind(this)
            },
            'zoom-canvas': {
              type: 'zoom-canvas',
              shouldBegin: this.canDragOrZoomCanvas.bind(this)
            }
          }
        }
      }
    )
  }

  initialize(graphConfig, editorConfig) {
    this.guid = guid()
    this.commandManager = new CommandManager()
    this.behaviorManager = new BehaviorManager(this.guid)
    this.setOptions(graphConfig, editorConfig)
    this.registerBuiltInShape()
    this.graph = new G6.Graph(this.options)
    this.commandManager.setGraph(this.graph)
    this.registerShortcuts()
  }

  // 为Register控件提供外部接口
  regsitor(name, options, type) {
    switch (type) {
      case 'node': {
        const { extend, ...config } = options
        G6.registerNode(name, config, extend)
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

  registerShortcuts() {
    window.addEventListener(GraphCommonEvent.onMouseDown, e => {
      this.lastMousedownTarget = e.target;
    });

    this.graph.on(GraphCommonEvent.onKeyDown, (e) => {
      if (!this.shouldTriggerShortcut(this.graph, this.lastMousedownTarget)) {
        return;
      }

      Object.values(this.commandManager.command).some(command => {
        const { name, shortcuts } = command;

        const flag = shortcuts.some((shortcut) => {
          const { key } = e;

          if (!isArray(shortcut)) {
            return shortcut === key;
          }

          return shortcut.every((item, index) => {
            if (index === shortcut.length - 1) {
              return item === key;
            }

            return e[item];
          });
        });

        if (flag) {
          if (this.commandManager.canExecute(name)) {
            // Prevent default
            e.preventDefault();

            // Execute command
            this.commandManager.execute(name);

            return true;
          }
        }

        return false;
      });
    })

  }

  shouldTriggerShortcut(graph, target) {
    const renderer = graph.get('renderer');
    const canvasElement = graph.get('canvas').get('el');

    if (!target) {
      return false;
    }

    if (target === canvasElement) {
      return true;
    }

    if (renderer === RendererType.Svg) {
      if (target.nodeName === 'svg') {
        return true;
      }

      let parentNode = target.parentNode;

      while (parentNode && parentNode.nodeName !== 'BODY') {
        if (parentNode.nodeName === 'svg') {
          return true;
        } else {
          parentNode = parentNode.parentNode;
        }
      }

      return false;
    }
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
      (ret, cur)=> ret && cur.bind(this)(...args), true)
  }

  canDragOrZoomCanvas(...args) {
    return this.editorDefaultMethodsQueue['canDragOrZoomCanvas'].reduce(
      (ret, cur)=> ret && cur.apply(this,...args), true)
  }
}
