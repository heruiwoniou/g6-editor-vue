export const structure = {
  start: {
    type: 'start',
    label: '开始',
    shape: 'Circle'
  },
  dispose: {
    type: 'dispose',
    label: '处理环节',
    shape: 'Rect'
  },
  end: {
    type: 'end',
    label: '结束',
    shape: 'Circle'
  }
}

export const linkRule = {
  start: {
    in: 0,
    out: 1,
    next: [
      'dispose'
    ]
  },
  dispose: {
    in: 1,
    next: [
      'dispose',
      'end'
    ]
  },
  end: {
    out: 0
  }
}
