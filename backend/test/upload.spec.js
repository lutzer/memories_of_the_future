const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')
const { resolve, extname, basename } = require('path')

const { app } = require('../dist/index')
const { config } = require('../dist/config')
const { handleImageUpload, handleAudioUpload, FileUpload } = require('../dist/upload')
const { deleteFile, copyFile, generateRandomString } = require('../dist/utils')

chai.use(chaiHttp);

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('File Upload', () => {

  describe('Upload Functions', () => {

    const imageFile = 'files/blob.png'
    const mp3File = 'files/sound-mp3.mp3'
    const oggFile = 'files/sound-ogg.ogg'
    const wavFile = 'files/sound-wav.wav'

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
        type : 'image',
        name: 'copy.wav',
        path : resolve(__dirname, fileCopy)
      }
      let path = await handleAudioUpload(file, '1')
      expect(fs.existsSync(path)).to.be.true
      expect(extname(path)).to.equal('.mp3')
      await deleteFile(path)
    });
  })

  describe('File Upload Routes', () => {

    var server = null

    var uploads = []

    function connect() { return chai.request(server) }

    async function createStory() {
      // add project
      let result = await connect().post('/api/projects').send({
        name: generateRandomString()
      })
      // add story
      result = await connect().post('/api/stories').send({
        author: 'peter',
        projectId : result.body.project.id,
        location : [0,0]
      })
      return result.body.story.id
    }

    before( async () => {
      server = await app.listen()
    })

    after( async () => {
      await server.close()
      // delete all uploaded files
      uploads.forEach( (upload) => {
        fs.unlinkSync(config.fileDirectory + '/' + basename(upload))
      })
    });


    describe('/api/uploads/', () => {

      it('should not be able to upload an without the correct storyId', async () => {
        result = await connect().post('/api/upload/story/sfdjhk')
          .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
        expect(result).to.have.status(400);
      });

      it('should not be able to upload a tiff file', async () => {
        let storyId = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.tiff'
        )
        expect(result).to.not.have.status(200);
      });

      it('should be able to upload an image and add it in the story data entry', async () => {
        let storyId = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png'
        )
        expect(result).to.have.status(200);
        await sleep(200)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.story.image))).to.be.true
        uploads.push(result.body.story.image)
      });

      it('should be able to upload recording and add it in the story data entry', async () => {
        let storyId = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3'
        )
        expect(result).to.have.status(200);
        await sleep(200)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.story.recording))).to.be.true
        uploads.push(result.body.story.recording)
      });

      it('should be able to upload a ogg recording and convert it to mp3', async () => {
        let storyId = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'recording', fs.readFileSync(__dirname + '/files/sound-ogg.ogg'), 'sound-ogg.ogg'
        )
        expect(result).to.have.status(200);
        // wait for audio conversion
        await sleep(600)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(result.body.story.recording.slice(-4)).to.equal('.mp3')
        uploads.push(result.body.story.recording)
      });

      it('should be able to upload a wav recording and convert it to mp3', async () => {
        let storyId = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId).attach(
          'recording', fs.readFileSync(__dirname + '/files/sound-wav.wav'), 'sound-wav.wav'
        )
        expect(result).to.have.status(200);
        // wait for audio conversion
        await sleep(600)
        result =  await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(result.body.story.recording.slice(-4)).to.equal('.mp3')
        uploads.push(result.body.story.recording)
      })

      it('should be able to upload an image and recording at the same time', async () => {
        let storyId = await createStory()
        // upload  file
        result = await connect().post('/api/upload/story/'+storyId)
          .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
          .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
        expect(result).to.have.status(200);
        await sleep(200)
        result = await connect().get('/api/stories/' + storyId)
        expect(result).to.have.status(200);
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.story.image))).to.be.true
        expect(fs.existsSync(config.fileDirectory + '/' + basename(result.body.story.recording))).to.be.true
        uploads.push(result.body.story.image, result.body.story.recording)
      });

    })
  })

});

