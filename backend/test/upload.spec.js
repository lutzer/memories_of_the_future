const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')
const { resolve, extname, basename } = require('path')

const { startServer } = require('../dist/app')
const { config } = require('../dist/config')
const { handleImageUpload, handleAudioUpload, FileUpload } = require('../dist/upload')
const { deleteFile, copyFile, generateRandomString } = require('../dist/utils')
const Jimp = require('jimp')

chai.use(chaiHttp);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('File Upload', () => {

  describe('Upload Functions', () => {

    const imageFile = 'files/blob.png'
    const bigImageFile = 'files/big-image.jpg'
    const mp3File = 'files/sound-mp3.mp3'
    const oggFile = 'files/sound-ogg.ogg'
    const wavFile = 'files/sound-wav.wav'
    const m4aFile = 'files/sound-m4a.m4a'
    const mp4File = 'files/sound-mp4.mp4'

    it('should be able to handle an image and place it in the files folder', async () => {
      const fileCopy = 'files/copy.png'
      await copyFile(resolve(__dirname, imageFile), resolve(__dirname, fileCopy))
      const file = {
        type : 'image',
        name: 'copy.png',
        path : resolve(__dirname, fileCopy)
      }
      let path = await handleImageUpload(file, '1')
      expect(fs.existsSync(path)).to.be.true
      await deleteFile(path)
    });

    it('should resize the image file', async () => {
      const fileCopy = 'files/copy.jpg'
      await copyFile(resolve(__dirname, bigImageFile), resolve(__dirname, fileCopy))
      const file = {
        type : 'image',
        name: 'copy.jpg',
        path : resolve(__dirname, fileCopy)
      }
      let path = await handleImageUpload(file, '1')
      const image = await Jimp.read(path)
      expect(image.getHeight()).to.be.most(config.imageWidth)
      expect(image.getWidth()).to.be.most(config.imageWidth)
      await deleteFile(path)
    });

    it('should be able to handle an mp3 file and place it in the files folder', async () => {
      const fileCopy = 'files/copy.mp3'
      await copyFile(resolve(__dirname, mp3File), resolve(__dirname, fileCopy))
      const file = {
        type : 'image',
        name: 'copy.mp3',
        path : resolve(__dirname, fileCopy)
      }
      let path = await handleAudioUpload(file, '1')
      expect(fs.existsSync(path)).to.be.true
      expect(extname(path)).to.equal('.mp3')
      await deleteFile(path)
    });

    it('should be able to convert an ogg file and place it in the files folder', async () => {
      const fileCopy = 'files/copy.ogg'
      await copyFile(resolve(__dirname, oggFile), resolve(__dirname, fileCopy))
      const file = {
        type : 'image',
        name: 'copy.ogg',
        path : resolve(__dirname, fileCopy)
      }
      let path = await handleAudioUpload(file, '1')
      expect(fs.existsSync(path)).to.be.true
      expect(extname(path)).to.equal('.mp3')
      await deleteFile(path)
    });

    it('should be able to convert an wav file and place it in the files folder', async () => {
      const fileCopy = 'files/copy.wav'
      await copyFile(resolve(__dirname, wavFile), resolve(__dirname, fileCopy))
      const file = {
        type : 'audio',
        name: 'copy.wav',
        path : resolve(__dirname, fileCopy)
      }
      let path = await handleAudioUpload(file, '1')
      expect(fs.existsSync(path)).to.be.true
      expect(extname(path)).to.equal('.mp3')
      await deleteFile(path)
    });

    it('should be able to convert an m4a file and place it in the files folder', async () => {
      const fileCopy = 'files/copy.m4a'
      await copyFile(resolve(__dirname, m4aFile), resolve(__dirname, fileCopy))
      const file = {
        type : 'audio',
        name: 'copy.m4a',
        path : resolve(__dirname, fileCopy)
      }
      let path = await handleAudioUpload(file, '1')
      expect(fs.existsSync(path)).to.be.true
      expect(extname(path)).to.equal('.mp3')
      await deleteFile(path)
    }).timeout(5000)

    it('should be able to convert an mp4 file and place it in the files folder', async () => {
      const fileCopy = 'files/copy.mp4'
      await copyFile(resolve(__dirname, mp4File), resolve(__dirname, fileCopy))
      const file = {
        type : 'audio',
        name: 'copy.mp4',
        path : resolve(__dirname, fileCopy)
      }
      let path = await handleAudioUpload(file, '1')
      expect(fs.existsSync(path)).to.be.true
      expect(extname(path)).to.equal('.mp3')
      await deleteFile(path)
    }).timeout(5000)

  })

  describe('File Upload Routes', () => {


    async function createStory() {
      const project = { name: generateRandomString(), password: generateRandomString() }
      // add project
      let result = await connect().post('/api/projects').send(project).auth(config.adminLogin,config.adminPassword)
      // add story
      result = await connect().post('/api/stories').send({
        author: 'peter',
        projectId : result.body.project.id,
        location : [0,0]
      }).auth(project.name, project.password)
      return { storyId : result.body.story.id, project: project }
    }

    var server = null

    var uploads = []

    function connect() { return chai.request(server) }

    before( async () => {
      server = await startServer()
    })

    after( async () => {
      await server.close()
      // delete all uploaded files
      uploads.forEach( (upload) => {
        fs.unlinkSync(config.fileDirectory + '/' + basename(upload))
      })
    });


    describe('/api/upload/story', () => {

      it('should not be able to upload an without the correct storyId', async () => {
        result = await connect().post('/api/upload/story/sfdjhk')
          .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
        expect(result).to.have.status(400);
      });

      it('should not be able to upload a tiff file', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.tiff'
        ).auth(project.name, project.password)
        expect(result).to.not.have.status(200);
        expect(result).to.not.have.status(401);
      });

      it('should be able to upload an image and add it in the story data entry', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png'
        ).auth(project.name, project.password)
        expect(result).to.have.status(200);
        await sleep(1000)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.story.image))).to.be.true
        uploads.push(result.body.story.image)
      });

      it('should not be able to upload an image without auth', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png'
        ).auth(generateRandomString(), generateRandomString())
        expect(result).to.have.status(401);
      });

      it('should be able to upload recording and add it in the story data entry', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3'
        ).auth(project.name, project.password)
        expect(result).to.have.status(200);
        await sleep(200)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(result.body.story.recording.slice(-4)).to.equal('.mp3')
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.story.recording))).to.be.true
        uploads.push(result.body.story.recording)
      });

      it('should be able to upload a ogg recording and convert it to mp3', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'recording', fs.readFileSync(__dirname + '/files/sound-ogg.ogg'), 'sound-ogg.ogg'
        ).auth(project.name, project.password)
        expect(result).to.have.status(200);
        // wait for audio conversion
        await sleep(600)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(result.body.story.recording.slice(-4)).to.equal('.mp3')
        uploads.push(result.body.story.recording)
      });

      it('should be able to upload a wav recording and convert it to mp3', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'recording', fs.readFileSync(__dirname + '/files/sound-wav.wav'), 'sound-wav.wav'
        ).auth(project.name, project.password)
        expect(result).to.have.status(200);
        // wait for audio conversion
        await sleep(500)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(result.body.story.recording.slice(-4)).to.equal('.mp3')
        uploads.push(result.body.story.recording)
      })

      it('should be able to upload a m4a recording and convert it to mp3', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'recording', fs.readFileSync(__dirname + '/files/sound-m4a.m4a'), 'sound-m4a.m4a'
        ).auth(project.name, project.password)
        expect(result).to.have.status(200);
        // wait for audio conversion
        await sleep(3000)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(result.body.story.recording.slice(-4)).to.equal('.mp3')
        uploads.push(result.body.story.recording)
      }).timeout(5000)

      it('should be able to upload a mp4 recording and convert it to mp3', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'recording', fs.readFileSync(__dirname + '/files/sound-mp4.mp4'), 'sound-mp4.mp4'
        ).auth(project.name, project.password)
        expect(result).to.have.status(200);
        // wait for audio conversion
        await sleep(500)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(result.body.story.recording.slice(-4)).to.equal('.mp3')
        uploads.push(result.body.story.recording)
      })

      it('should be able to upload an image and recording at the same time', async () => {
        let { storyId, project } = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId)
          .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
          .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
          .auth(project.name, project.password)
        expect(result).to.have.status(200);
        await sleep(1500)
        result = await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.story.image))).to.be.true
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.story.recording))).to.be.true
        uploads.push(result.body.story.image, result.body.story.recording)
      })
    })

    describe('/api/upload/attachment', () => {

      const createAttachment = async function() {
        let { storyId, project } = await createStory()
        let result = await connect().post('/api/attachments').send({
          storyId: storyId,
        }).auth(project.name,project.password)
        return { attachmentId : result.body.attachment.id, project : project }
      }

      it('should not be able to upload an without the correct attachmentId', async () => {
        result = await connect().post('/api/upload/attachment/sfdjhk')
          .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
        expect(result).to.have.status(400);
      });

      it('should not be able to upload an attachment image with incorect auth', async () => {
        let { attachmentId, project } = await createAttachment()
        result = await connect().post('/api/upload/attachment/'+attachmentId).attach(
          'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png'
        ).auth(generateRandomString(), generateRandomString())
        expect(result).to.have.status(401);
      })

      it('should be able to upload an image and add it in the attachment data entry', async () => {
        let { attachmentId, project } = await createAttachment()
        // upload  file
        result = await connect().post('/api/upload/attachment/'+attachmentId).attach(
          'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png'
        ).auth(project.name, project.password)
        expect(result).to.have.status(200);
        await sleep(1000)
        // check if image exists
        result =  await connect().get('/api/attachments/' + attachmentId)
        expect(result).to.have.status(200);
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.attachment.image))).to.be.true
        uploads.push(result.body.attachment.image)
      })

    })
  })

  describe('GET /files/*', () => {

    var server = null

    var uploads = []

    function connect() { return chai.request(server) }

    before( async () => {
      server = await startServer()
    })

    after( async () => {
      await server.close()
      // delete all uploaded files
      uploads.forEach( (upload) => {
        fs.unlinkSync(config.fileDirectory + '/' + basename(upload))
      })
    });

    async function createStory() {
      const project = { name: generateRandomString(), password: generateRandomString() }
      // add project
      let result = await connect().post('/api/projects').send(project).auth(config.adminLogin,config.adminPassword)
      // add story
      result = await connect().post('/api/stories').send({
        author: 'peter',
        projectId : result.body.project.id,
        location : [0,0]
      }).auth(project.name, project.password)
      return { storyId : result.body.story.id, project: project }
    }

    it('should be able to get image from files dir', async () => {
      const { storyId, project } = await createStory()
      var result = await connect().post('/api/upload/story/'+storyId)
        .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
        .auth(project.name, project.password)
      expect(result).to.have.status(200);
      await sleep(1000)
      result =  await connect().get('/api/stories/' + storyId)
      expect(result).to.have.status(200);
      uploads.push(result.body.story.image)
      connect().get(result.body.story.image)
      expect(result).to.have.status(200);
    })

    it('should be able to get recording from files dir', async () => {
      const { storyId, project } = await createStory()
      var result = await connect().post('/api/upload/story/'+storyId)
        .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
        .auth(project.name, project.password)
      expect(result).to.have.status(200);
      await sleep(200)
      result =  await connect().get('/api/stories/' + storyId)
      expect(result).to.have.status(200);
      uploads.push(result.body.story.recording)
      connect().get(result.body.story.recording)
      expect(result).to.have.status(200);
    })

  })

});

