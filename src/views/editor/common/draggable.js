let isdragging = false

const supportTouch = 'ontouchstart' in window

export default function(element, options) {
  const moveFn = function(event) {
    if (options.drag) {
      options.drag(supportTouch ? event.changedTouches[0] || event.touches[0] : event)
    }
  }

  const endFn = function(event) {
    if (!supportTouch) {
      document.removeEventListener('mousemove', moveFn)
      document.removeEventListener('mouseup', endFn)
    }
    document.onselectstart = null
    document.ondragstart = null

    isdragging = false

    if (options.end) {
      options.end(supportTouch ? event.changedTouches[0] || event.touches[0] : event)
    }
  }

  element.addEventListener(supportTouch ? 'touchstart' : 'mousedown', function(event) {
    if (isdragging) return
    document.onselectstart = function() {
      return false
    }
    document.ondragstart = function() {
      return false
    }

    if (!supportTouch) {
      document.addEventListener('mousemove', moveFn)
      document.addEventListener('mouseup', endFn)
    }

    isdragging = true

    if (options.start) {
      event.preventDefault()
      if (
        options.start(supportTouch ? event.changedTouches[0] || event.touches[0] : event) === false
      ) {
        isdragging = false
        if (!supportTouch) {
          document.removeEventListener('mousemove', moveFn)
          document.removeEventListener('mouseup', endFn)
        }
        document.onselectstart = null
        document.ondragstart = null
      }
    }
  })

  if (supportTouch) {
    element.addEventListener('touchmove', moveFn)
    element.addEventListener('touchend', endFn)
    element.addEventListener('touchcancel', endFn)
  }
}
