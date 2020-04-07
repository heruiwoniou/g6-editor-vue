
export function checkOutAndInEdge(item, type, linkRule) {
  if (!linkRule) return true
  const outEdge = item.getOutEdges().length
  const inEdge = item.getInEdges().length
  const { type: nodeType } = item.getModel()
  const config = linkRule[nodeType]
  if (!config) return true
  config.in = config.in === void 0 ? Infinity : config.in
  config.out = config.out === void 0 ? Infinity : config.out
  if (type === 'in' && inEdge < config.in) return true
  if (type === 'out' && outEdge < config.out) return true
  if (inEdge < config.in && outEdge < config.out) return true
  else return false
}

export function nextNodeCheck(source, item, linkRule) {
  if (!linkRule) return true
  const sourceNodeShape = source.getModel().shape
  const { shape } = item.getModel()
  const config = linkRule[sourceNodeShape]
  if (!config || !config.next) return true
  if (config.next.find(s => s === shape)) return true
  else return false
}