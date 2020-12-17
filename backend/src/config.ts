import { resolve } from "path"

const config = {
  address: 'localhost',
  port : 3000,
  apiBasePath : '/api',
  fileBasePath : '/files',

  adminLogin: process.env.ADMIN_LOGIN || 'admin',
  adminPassword: process.env.ADMIN_PASSWORD || 'password',
  adminPort: 3001,

  staticDirectory : resolve(__dirname, '../../app/dist/'),
  databaseFile: resolve(__dirname,'../../data/data.json'),

  fileDirectory : resolve(__dirname, '../../data/files/'),
  uploadTmpDirectory: resolve(__dirname, '../../data/tmp/'),
  uploadMaxFilesize: 1024 * 1024 * 30, // 30 mbytes

  // markerColors: 
  //   ['#ffff00', '#c07114', '#f59e01', '#e9658a', '#e74610', 
  //   '#fe0000', '#c5114e', '#ff67de', '#662b57', '#a373ad', 
  //   '#853445', '#21397f', '#0266b2', '#0000fe', '#8acdd5', 
  //   '#008b5a', '#08f49f', '#90bf21', '#73733d', '#014e48'],
  markerColors: 
    ['#ff273a', '#e401ee', '#f70190', '#500095', '#fd98b8', 
    '#0000fe', '#4472fb', '#85b6f0', '#00ffff', '#8772fb', 
    '#01ff02', '#009422', '#d2e10c', '#01fd98', '#119393', 
    '#ffff00', '#f89303', '#90bf21', '#d3a633', '#889404'],

  imageWidth : 1024,
  imageQuality: 80
}

export { config }