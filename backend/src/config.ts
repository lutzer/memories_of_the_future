import { resolve } from "path"

const config = {
  address: 'localhost',
  port : 3000,
  apiBasePath : '/api',
  fileBasePath : '/files',

  adminLogin: 'admin',
  adminPassword: 'password',
  adminPort: 3001,

  staticDirectory : resolve(__dirname, '../../app/dist/'),
  databaseFile: resolve(__dirname,'../data/data.json'),

  fileDirectory : resolve(__dirname, '../data/files/'),
  uploadTmpDirectory: resolve(__dirname, '../data/tmp/'),
  uploadMaxFilesize: 1024 * 1024 * 30, // 30 mbytes

  markerColors: 
    ['#ffff00', '#c07114', '#f59e01', '#e9658a', '#e74610', 
    '#fe0000', '#c5114e', '#ff67de', '#662b57', '#a373ad', 
    '#853445', '#21397f', '#0266b2', '#0000fe', '#8acdd5', 
    '#008b5a', '#08f49f', '#90bf21', '#73733d', '#014e48'],

  imageMaxSideSize : 1024,
  imageQuality: 80
}

export { config }