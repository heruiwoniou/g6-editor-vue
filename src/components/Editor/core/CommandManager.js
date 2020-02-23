import cloneDeep from 'lodash/cloneDeep'
import { getGraphState } from '../utils'
import { EditorEvent } from '../common/constants'
import BuiltInCommands from '../built-in/commands'
import BaseCommand from '../built-in/commands/Base'

export default class CommandManager {
  graph = null
  command = {}
  commandQueue = []
  commandIndex = 0
  constructor(graph) {
    this.graph = graph
    Object.keys(BuiltInCommands).forEach(commandName => {
      this.register(commandName, {
        ...BaseCommand,
        ...BuiltInCommands[commandName]
      })
    })
  }

  /** 判断是否为内置Command */
  isBuiltInCommand(name) {
    return !!this.command[name]
  }

  /** 注册命令 */
  register(name, command) {
    this.command[name] = {
      ...command,
      name,
    };
  }
  
  /** 执行命令 */
  execute(name, params) {
    const { 
      graph,
      command: {
        [name]: Command
      }
    } = this

    if (!Command) {
      return;
    }

    const command = Object.create(Command);

    command.params = cloneDeep(Command.params);

    if (params) {
      command.params = {
        ...command.params,
        ...params,
      };
    }

    if (!command.canExecute(graph, this)) {
      return;
    }

    if (!command.shouldExecute(graph, this)) {
      return;
    }

    command.init(graph, this);

    graph.emit(EditorEvent.onBeforeExecuteCommand, {
      name: command.name,
      params: command.params,
    });

    command.execute(graph, this);

    graph.emit(EditorEvent.onAfterExecuteCommand, {
      name: command.name,
      params: command.params,
    });

    if (command.canUndo(graph, this)) {
      const { commandQueue, commandIndex } = this;

      commandQueue.splice(commandIndex, commandQueue.length - commandIndex, command);

      this.commandIndex += 1;
    }

    graph.emit(EditorEvent.onGraphStateChange, {
      graphState: getGraphState(graph),
    });
  }
  /** 判断是否可以执行 */
  canExecute(name) {
    return this.command[name].canExecute(this.graph, this);
  }
}
