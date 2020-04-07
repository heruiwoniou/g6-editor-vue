export const structure = {
  start: {
    type: 'start',
    label: '开始',
    shape: 'Circle'
  },
  corpus: {
    type: 'corpus',
    label: '语料',
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
    out: 1
  },
  end: {
    out: 0
  }
}
