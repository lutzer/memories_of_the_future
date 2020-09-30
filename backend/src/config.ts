import { resolve } from "path"

const config = {
  address: 'localhost',
  port : 3000,
  apiBasePath : '/api',
  fileBasePath : '/files',

  staticDirectory : resolve(__dirname, '../../recorder/dist/'),
  databaseFile: resolve(__dirname,'../data/data.json'),

  fileDirectory : resolve(__dirname, '../data/files/'),
  uploadTmpDirectory: resolve(__dirname, '../data/tmp/'),
  uploadMaxFilesize: 1024 * 1024 * 30, // 30 mbytes
}

export { config }