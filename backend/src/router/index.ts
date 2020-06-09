import Router from '@koa/router'
import { config } from './../config'
import { router as projectRouter } from './projects'
import { router as storyRouter } from './stories'
import { router as uploadRouter } from './upload'
import { router as attachmentRouter } from './attachments'

const router = new Router({
  prefix : config.apiBasePath
})

router.use(projectRouter.routes())
router.use(storyRouter.routes())
router.use(uploadRouter.routes())
router.use(attachmentRouter.routes())

export { router }