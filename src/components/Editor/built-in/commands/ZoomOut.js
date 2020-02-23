const DELTA = 0.05

export default {
  name: 'ZoomOut',

  canUndo() {
    return false
  },

  execute(graph) {
    const ratio = 1 - DELTA

    const zoom = graph.getZoom() * ratio
    const minZoom = graph.get('minZoom')

    if (zoom < minZoom) {
      return
    }

    graph.zoom(ratio)
  },

  shortcuts: [
    ['metaKey', '-'],
    ['ctrlKey', '-']
  ]
}
