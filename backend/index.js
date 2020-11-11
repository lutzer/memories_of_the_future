const { startServer, config } = require('./dist/app')
const { startAdminInterface } = require('./dist/admin')

startServer().then( () => {
  console.info("Server started on port " + config.port)
})

startAdminInterface(config.adminPort).then( () => {
  console.info("Admin Backend started on port " + config.adminPort)
})