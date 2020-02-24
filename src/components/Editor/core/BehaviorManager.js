import G6 from '@antv/g6'
import BuiltInBehaviors from '../built-in/behaviors'

export default class BehaviorManager {
  guid = null
  behaviors = {}
  constructor(guid) {
    this.guid = guid
    Object.keys(BuiltInBehaviors).forEach(behaviorName => {
      this.registoer(behaviorName, BuiltInBehaviors[behaviorName], true)
    })
  }

  registoer(name, behavior, isBuiltIn = false) {
    name = isBuiltIn ? name: this.wrapBehaviorName(name)
    this.behaviors[name] = behavior
    G6.registerBehavior(name, behavior)
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
