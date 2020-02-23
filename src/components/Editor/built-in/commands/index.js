const commandFiles = require.context('./', true, /\.js$/)
const commands = commandFiles.keys().filter(cmd => !['./index.js', './Base.js'].includes(cmd)).reduce((modules, modulePath) => {
  const moduleName = modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = commandFiles(modulePath)
  modules[moduleName] = value.default
  return modules
}, {})

export default commands