import Router from '@koa/router'
import koaSend from 'koa-send'
import { basename } from 'path'
import { config } from './config'

const staticRouter = new Router()

/* frontend html and js files */

staticRouter.get('/', async(context) => {
  return koaSend(context, context.path == '/' ? '/index.html' : context.path, {
    root: config.staticDirectory
  })
})

/* images and recordings */

staticRouter.get('/files/(.*)', async (context) => {
  let fileName = basename(context.path)
  return koaSend(context, fileName, {
    root: config.fileDirectory
  })
})

export { staticRouter }