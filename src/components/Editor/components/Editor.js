import { createDelayCore } from '../utils'
export default {
  name: 'Editor',
  provide: {
    context: {
      delayCore: createDelayCore()
    }
  },
  props: {
    mode: {
      type: String,
      default: 'view',
      validator(val) {
        return ['view', 'edit'].includes(val)
      }
    }
  },
  render() {
    return this.$scopedSlots.default()
  }
}
