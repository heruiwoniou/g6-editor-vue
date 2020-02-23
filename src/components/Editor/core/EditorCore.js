import G6 from '@antv/g6'
import CommandManager from './CommandManager'
import BehaviorManager from './CommandManager'

export default class EditorCore {
  graph = null
  commandManager = null
  behaviorManager = null
  constructor(options) {
    this.graph = new G6.Graph(options)
    this.commandManager = new CommandManager(this.graph)
    this.behaviorManager = new BehaviorManager(this.graph)
  }
}
