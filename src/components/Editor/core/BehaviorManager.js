import G6 from '@antv/g6'
import BuiltInBehaviors from '../built-in/behaviors'

export default class BehaviorManager {
  core = null
  guid = null
  behaviors = {}
  commandManager  = null
  constructor(core) {
    this.core = core
    this.guid = core.guid
    this.commandManager = core.commandManager
    Object.keys(BuiltInBehaviors).forEach(behaviorName => {
      this.register(behaviorName, BuiltInBehaviors[behaviorName])
    })
  }

  register(name, behavior) {
    name = this.wrapBehaviorName(name)
    this.behaviors[name] = behavior
    G6.registerBehavior(name, {
      core: this.core, 
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
