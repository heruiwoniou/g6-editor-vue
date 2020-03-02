import cloneDeep from 'lodash/cloneDeep'
import { getGraphState } from '../utils'
import { EditorEvent } from '../common/constants'
import BuiltInCommands from '../built-in/commands'
import BaseCommand from '../built-in/commands/Base'
import isArray from 'lodash/isArray'
import { GraphCommonEvent, RendererType } from '../common/constants'

export default class CommandManager {
  core = null
  command = {}
  commandQueue = []
  commandIndex = 0
  constructor(core) {
    this.core = core
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
      core: { graph },
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

    let ret = command.execute(graph, this);

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
    return this.command[name].canExecute(this.core.graph, this);
  }

  bindCommandShortcuts() {
    window.addEventListener(GraphCommonEvent.onMouseDown, e => {
      this.lastMousedownTarget = e.target;
    });

    this.core.graph.on(GraphCommonEvent.onKeyDown, (e) => {
      if (!this.shouldTriggerShortcut(this.core.graph, this.lastMousedownTarget)) {
        return;
      }

      Object.values(this.command).some(command => {
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
          if (this.canExecute(name)) {
            // Prevent default
            e.preventDefault();

            // Execute command
            this.execute(name);

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

}
