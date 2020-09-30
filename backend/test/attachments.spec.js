const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const { startServer } = require('../dist/app')
const { generateRandomString } = require('../dist/utils')

chai.use(chaiHttp);

describe('Attachment Routes', () => {

  var server = null

  function connect() { return chai.request(server) }

  before( async () => {
    server = await startServer()
  })

  after( async () => {
    await server.close()
  })

  async function createStory() {
    const project = { name: generateRandomString(), password: generateRandomString() }
    // add project
    let result = await connect().post('/api/projects').send(project)
    // add story
    result = await connect().post('/api/stories').send({
      author: 'peter',
      projectId : result.body.project.id,
      location : [0,0]
    }).auth(project.name, project.password)
    return { storyId : result.body.story.id, project: project }
  }

  describe('/api/attachments/', () => {

    it('should get attachments', async () => {
      let result = await connect().get('/api/attachments/')
      expect(result).to.have.status(200);
      expect(result.body).to.have.key('attachments')
    })

    it('should be able to post a text attachment', async () => {
      const { storyId, project } = await createStory()
      const text = generateRandomString()
      let result = await connect().post('/api/attachments/').send({
        storyId: storyId,
        type: 'text',
        text : text
      }).auth(project.name, project.password)
      expect(result).to.have.status(200);
      expect(result.body.attachment.text).to.equal(text)
    })

    it('should not be able to post a text attachment without auth', async () => {
      const { storyId } = await createStory()
      const text = generateRandomString()
      let result = await connect().post('/api/attachments/').send({
        storyId: storyId,
        type: 'text',
        text : text
      }).auth('test','test')
      expect(result).to.have.status(401);
    })

    it('should get all attachments for a certain story', async () => {
      const { storyId, project } = await createStory()
      let result = await connect().post('/api/attachments/').send({
        storyId: storyId,
        type: 'text',
        text : generateRandomString()
      }).auth(project.name, project.password)
      expect(result).to.have.status(200);
      result = await connect().post('/api/attachments/').send({
        storyId: storyId,
        type: 'text',
        text : generateRandomString()
      }).auth(project.name, project.password)
      expect(result).to.have.status(200);
      result = await connect().get('/api/attachments/?story='+storyId)
      expect(result.body.attachments).to.be.length(2)
    })

    it('should not be able to post a text attachment without the story existing', async () => {
      let result = await connect().post('/api/attachments/').send({
        storyId: generateRandomString(),
        type: 'text',
        text : generateRandomString()
      })
      expect(result).to.have.status(400);
    })

    it('should be able to get a single attachment', async () => {
      const { storyId, project } = await createStory()
      const text = generateRandomString()
      let result = await connect().post('/api/attachments/').send({
        storyId: storyId,
        type: 'text',
        text : text
      }).auth(project.name, project.password)
      expect(result).to.have.status(200);
      const attachmentId = result.body.attachment.id
      result = await connect().get('/api/attachments/' + attachmentId)
      expect(result).to.have.status(200);
      expect(result.body.attachment.text).is.equal(text)
    })

    it('should be able to delete an attachment', async () => {
      const { storyId, project } = await createStory()
      let result = await connect().post('/api/attachments/').send({
        storyId: storyId,
        type: 'text',
        text : generateRandomString()
      }).auth(project.name, project.password)
      expect(result).to.have.status(200);
      const attachmentId = result.body.attachment.id
      result = await connect().delete('/api/attachments/' + attachmentId).auth(project.name,project.password)
      expect(result).to.have.status(200);
    })

    it('should not be able to delete an attachment without auth', async () => {
      const { storyId, project } = await createStory()
      let result = await connect().post('/api/attachments/').send({
        storyId: storyId,
        type: 'text',
        text : generateRandomString()
      }).auth(project.name, project.password)
      expect(result).to.have.status(200);
      const attachmentId = result.body.attachment.id
      result = await connect().delete('/api/attachments/' + attachmentId).auth('test','test')
      expect(result).to.have.status(401);
    })

  })

})

