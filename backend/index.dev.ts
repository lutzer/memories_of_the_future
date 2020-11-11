import { startServer, config } from './src/app'
import { startAdminInterface } from './src/admin'

startServer().then( () => {
  console.info("Server started on port " + config.port)
})

startAdminInterface(config.adminPort).then( () => {
  console.info("Admin Backend started on port " + config.adminPort)
})
