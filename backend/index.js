const { app, config } = require('./dist/app')
const server = app.listen(config.port, () => {
  console.info("Server started on port " + config.port)
})