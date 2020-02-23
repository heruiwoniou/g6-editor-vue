const DELTA = 0.05

export default {
  name: 'ZoomIn',

  canUndo() {
    return false
  },

  execute(graph) {
    const ratio = 1 + DELTA

    const zoom = graph.getZoom() * ratio
    const maxZoom = graph.get('maxZoom')

    if (zoom > maxZoom) {
      return
    }

    graph.zoom(ratio)
  },

  shortcuts: [
    ['metaKey', '='],
    ['ctrlKey', '=']
  ]
}
