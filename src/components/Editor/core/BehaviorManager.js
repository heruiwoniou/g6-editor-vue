import G6 from '@antv/g6'
import BuiltInBehaviors from '../built-in/behaviors'

export default class BehaviorManager {
  guid = null
  behaviors = {}
  commandManager  = null
  constructor(guid, commandManager) {
    this.guid = guid
    this.commandManager = commandManager
    Object.keys(BuiltInBehaviors).forEach(behaviorName => {
      this.registoer(behaviorName, BuiltInBehaviors[behaviorName])
    })
  }

  registoer(name, behavior) {
    name = this.wrapBehaviorName(name)
    this.behaviors[name] = behavior
    G6.registerBehavior(name, {
      commandManager: this.commandManager,
      ...behavior
    })
  }

  getRegisteredBehaviors() {
    const registeredBehaviors = {}
    Object.keys(this.behaviors).forEach(name => {
      const behavior = this.behaviors[name]

      const { graphMode = 'default' } = behavior

      if (!registeredBehaviors[graphMode]) {
        registeredBehaviors[graphMode] = {}
      }

      registeredBehaviors[graphMode][name] = name
    })

    return registeredBehaviors
  }

  wrapBehaviorName(name) {
    return `${name}-${this.guid}`
  }
}
