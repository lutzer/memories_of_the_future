const config = {
  address: 'localhost',
  port : 3000,
  apiBasePath : '/api',
  staticDirectory : __dirname + '/../../web/dist/',
  databaseFile: __dirname + '/../data/data.json',
  frontendProxyUrl: 'http://localhost:3001'
}

export { config }