const { app, config } = require('./dist/app')
startServer(() => {
  console.info("Server started on port " + config.port)
})