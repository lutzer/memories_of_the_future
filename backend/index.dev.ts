import { startServer, config } from './src/app'
startServer().then( () => {
  console.info("Server started on port " + config.port)
})