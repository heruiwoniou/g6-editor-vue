import bindHandles from '../common/bindHandles'
import KnowledgeDefine from './Knowledge'
import VariableDefine from './Variable'
import VariableValueDefine from './VariableValue'
import VariableReferenceDefine from './VariableReference'
import VariableCollectDefine from './VariableCollect'
import ConditionDefine from './Condition'
import ExternalOperationDefine from './ExternalOperation'
import AnswerDefine from './Answer'

export const Knowledge = bindHandles(KnowledgeDefine)
export const Variable = bindHandles(VariableDefine)
export const VariableValue = bindHandles(VariableValueDefine)
export const VariableReference = bindHandles(VariableReferenceDefine)
export const VariableCollect = bindHandles(VariableCollectDefine)
export const Condition = bindHandles(ConditionDefine)
export const ExternalOperation = bindHandles(ExternalOperationDefine)
export const Answer = bindHandles(AnswerDefine)
