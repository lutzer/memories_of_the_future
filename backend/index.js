const { app, config } = require('./dist/app')
startServer().then( () => {
  console.info("Server started on port " + config.port)
})