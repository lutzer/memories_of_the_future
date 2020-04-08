import fs from 'fs'
import { promisify } from 'util'
import Koa from 'koa'

const deleteFile = promisify(fs.unlink)

const moveFile = promisify(fs.rename)

const fileFilter = function (req, file, cb) {
  // accept image only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|mp3|wav|ogg)$/)) {
      return cb(new Error('Only image and sound files are allowed!'), false);
  }
  cb(null, true);
};

const errorMiddleware = async (context : Koa.BaseContext, next : Koa.Next) => {
  try {
    await next()
  } catch (err) {
    context.throw(400, err);
  }
}

export { deleteFile, moveFile, fileFilter, errorMiddleware }