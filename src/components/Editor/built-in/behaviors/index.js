
const behaviorFiles = require.context('./', true, /\.js$/)
const behaviors = behaviorFiles.keys().filter(cmd => !['./index.js'].includes(cmd)).reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = behaviorFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default behaviors