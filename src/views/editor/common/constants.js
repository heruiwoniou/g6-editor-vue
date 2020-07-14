export const structure = {
  Knowledge: {
    type: 'Knowledge',
    name: '知识点',
    shape: 'Knowledge',
    defaultValues: {}
  },
  Variable: {
    type: 'Variable',
    name: '变量定义',
    shape: 'Variable',
    defaultValues: {}
  },
  VariableValue: {
    type: 'VariableValue',
    name: '变量值',
    shape: 'VariableValue',
    defaultValues: {}
  },
  VariableReference: {
    type: 'VariableReference',
    name: '变量引用',
    shape: 'VariableReference',
    defaultValues: {}
  },
  VariableCollect: {
    type: 'VariableCollect',
    name: '变量收集',
    shape: 'VariableCollect',
    defaultValues: {
      items: [
        { value: '姓名' },
        { value: '银行卡号' },
        { value: '交易时间' },
        { value: '交易金额' },
      ]
    }
  },
  Condition: {
    type: 'Condition',
    name: '分支条件',
    shape: 'Condition',
    defaultValues: {}
  },
  ExternalOperation: {
    type: 'ExternalOperation',
    name: '外部操作',
    shape: 'ExternalOperation',
    defaultValues: {}
  },
  Answer: {
    type: 'Answer',
    name: '答案定义',
    shape: 'Answer',
    defaultValues: {}
  }
}

export const linkRule = {
  // Knowledge: {
  //   out: 2, //代表能连出两个线
  //   in: 2, //代表只能连入两个线
  //   next: [ // 代表下一节点只能是指定 type 的节点
  //     'Variable'
  //   ]
  // },
}
