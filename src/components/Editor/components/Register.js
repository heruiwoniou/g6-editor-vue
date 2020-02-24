import inject from '../common/inject'

const create = (type, props) => {
  const base = {
    mixins: [ inject ],
    props,
    async mounted() {
      const core = await this.core.get
      core.regsitor(this.props, type)
    },
    render() {
      return null
    }
  }

  return base
}

export const RegisterNode = create('node', { name: String, config: Object })
export const RegisterEdge = create('edge', { name: String, config: Object })
export const RegisterCommand = create('command', { name: String, config: Object })
export const RegisterBehavior = create('behavior', { name: String, config: Object })