import { app, config } from './src/app'
const server = app.listen(config.port, () => {
  console.info("Server started on port " + config.port)
})