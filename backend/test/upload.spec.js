const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')

const { app } = require('../dist/index')

chai.use(chaiHttp);

describe('File Upload', () => {

  var server = null

  var uploads = []

  function connect() { return chai.request(server) }

  async function createStory() {
    // add project
    let result = await connect().post('/api/projects').send({
      name: 'testName'
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
      fs.unlinkSync(upload)
    })
  });


  describe('/api/uploads/', () => {
    
    it('should be able to upload an image', async () => {
      let storyId = await createStory()
      // upload  file
      result = await connect().post('/api/upload/story/'+storyId).attach(
        'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png'
      )
      expect(result).to.have.status(200);
      expect(result.body.uploads).to.be.lengthOf(1)
      const path = result.body.uploads[0].path
      expect(fs.existsSync(path)).to.be.true
      uploads.push(path)
    });

    it('should be able to upload an recording', async () => {
      let storyId = await createStory()
      // upload  file
      result = await connect().post('/api/upload/story/'+storyId).attach(
        'recording', fs.readFileSync(__dirname + '/files/sound.wav'), 'sound.wav'
      )
      expect(result).to.have.status(200);
      expect(result.body.uploads).to.be.lengthOf(1)
      const path = result.body.uploads[0].path
      expect(fs.existsSync(path)).to.be.true
      uploads.push(path)
    });

    it('should be able to upload an image and recording', async () => {
      let storyId = await createStory()
      // upload  file
      result = await connect().post('/api/upload/story/'+storyId)
        .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
        .attach('recording', fs.readFileSync(__dirname + '/files/sound.wav'), 'sound.wav')

      expect(result).to.have.status(200);
      expect(result.body.uploads).to.be.lengthOf(2)
      expect(fs.existsSync(result.body.uploads[0].path)).to.be.true
      expect(fs.existsSync(result.body.uploads[1].path)).to.be.true
      uploads.push(result.body.uploads[0].path, result.body.uploads[1].path)
    });

    it('should not be able to upload an without the correct storyId', async () => {
      result = await connect().post('/api/upload/story/sfdjhk')
        .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
      expect(result).to.have.status(400);
    });
  })

});

