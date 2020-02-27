import inject from '../common/inject'

const create = (type, props = { name: String, config: Object }) => {
  const base = {
    mixins: [inject],
    props,
    async mounted() {
      const core = await this.delayCore
      core.regsitor(this.name, this.config, type)
    },
    render() {
      return null
    }
  }

  return base
}

export const RegisterNode = create('node')
export const RegisterEdge = create('edge')
export const RegisterCommand = create('command')
export const RegisterBehavior = create('behavior')
