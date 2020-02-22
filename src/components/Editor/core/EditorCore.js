import G6 from '@antv/g6'
import CommandManager from './CommandManager'
import BehaviorManager from './CommandManager'
import { EditorEvent } from '../common/constants'
import { guid, unwrapEventName, wrapEventName } from '../utils'

export default class EditorCore {
  graph = null
  commandManager = null
  behaviorManager = null
  constructor(options) {
    this.graph = new G6.Graph(options)
    this.commandManager = new CommandManager(this.graph)
    this.behaviorManager = new BehaviorManager(this.graph)
  }

  executeCommand(name, ...args) {
    this.commandManager.execute(name, ...args)
  }

  bindEvent(graph) {
    const { props } = this;

    graph.on(EditorEvent.onBeforeExecuteCommand);
    graph.on(EditorEvent.onAfterExecuteCommand);
  }
}