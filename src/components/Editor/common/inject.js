export default {
  inject: ['context'],
  data() {
    this.core = { get: this.context.delayCore.get }
    return null
  }
}