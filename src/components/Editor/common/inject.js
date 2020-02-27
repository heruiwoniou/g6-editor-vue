export default {
  inject: ['context'],
  data() {
    this.delayCore = this.context.delayCore.get
    return {}
  }
}