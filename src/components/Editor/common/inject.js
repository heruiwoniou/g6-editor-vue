export default {
  inject: ['context'],
  data() {
    this.delayCore = this.context.delayCore.get
    this.core = this.context.core
    return {}
  }
}