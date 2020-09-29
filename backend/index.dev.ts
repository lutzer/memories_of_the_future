import { startServer, config } from './src/app'
startServer(() => {
  console.info("Server started on port " + config.port)
})