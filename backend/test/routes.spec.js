const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const { app } = require('../dist/app')
const { generateRandomString } = require('../dist/utils')

chai.use(chaiHttp);

describe('Routes', () => {

  var server = null

  function connect() { return chai.request(server) }

  before( async () => {
    server = await app.listen()
  })

  after( async () => {
    await server.close()
  });

  describe('/api/projects/', () => {

    it('should get Projects', async () => {
      let result = await connect().get('/api/projects/')
      expect(result).to.have.status(200);
      expect(result.body).to.have.key('projects')
    });

    it('should be able to add a project with a name', async () => {
      let name = generateRandomString()
      let result = await connect().post('/api/projects').send({
        name: name
      })
      expect(result).to.have.status(200);
      expect(result.body.project.name).equal(name);
      expect(result.body.project.id).is.not.empty
    })

    it('should be able to get a project by name', async () => {
      let name = generateRandomString()
      let result = await connect().post('/api/projects').send({
        name: name
      })
      expect(result).to.have.status(200);
      result = await connect().get('/api/projects?name='+name)
      expect(result).to.have.status(200);
      expect(result.body.project.name).equal(name);
    })

    it('should not be able to add two projects with same name', async () => {
      let name = generateRandomString()
      let result = await connect().post('/api/projects').send({
        name: name
      })
      expect(result).to.have.status(200);
      result = await connect().post('/api/projects').send({
        name: name
      })
      expect(result).to.have.status(400);
    })

    it('should get a project by id', async () => {
      let name = generateRandomString()
      let result = await connect().post('/api/projects').send({
        name: name
      })
      expect(result).to.have.status(200);
      let id = result.body.project.id
      result = await connect().get('/api/projects/' + id)
      expect(result.body.project.name).to.equal(name)
      expect(result.body.project.id).to.equal(id)
      expect(result.body.project).to.not.haveOwnProperty('password')
    })

    it('should not be able to add a project without a name', async () => {
      let result = await connect().post('/api/projects').send({})
      expect(result).to.have.status(400);
    })

    it('should not display the password of an added project', async () => {
      let name = generateRandomString()
      let result = await connect().post('/api/projects').send({
        name: name
      })
      expect(result).to.have.status(200);
      result = await connect().get('/api/projects/')
      expect(result).to.have.status(200);
      expect(result.body.projects[0]).to.not.haveOwnProperty('password')
    });

  });

  describe('/api/stories/', () => {
  
    it('should get Stories', async () => {
      let result = await connect().get('/api/stories/')
      expect(result).to.have.status(200);
      expect(result.body).to.have.key('stories')
    });
  
    it('should not be able to post a story without a projectId or location', async () => {
      let result = await connect().post('/api/stories').send({})
      expect(result).to.have.status(400);
    });
  
    it('should not be able to post a story without an existing projectId', async () => {
      let result = await connect().post('/api/stories').send({
        projectId : generateRandomString(),
        location : [0,0]
      })
      expect(result).to.have.status(400);
    });

    it('should get a story by id', async () => {
      let result = await connect().post('/api/projects').send({
        name: generateRandomString()
      })
      expect(result).to.have.status(200);
      let projectId = result.body.project.id
      result = await connect().post('/api/stories').send({
        projectId : projectId,
        location : [0,0],
        author: 'max'
      })
      expect(result).to.have.status(200);
      let storyId = result.body.story.id
      result = await connect().get('/api/stories/'+storyId)
      expect(result).to.have.status(200);
      expect(result.body.story.author).to.equal('max')
      expect(result.body.story.id).to.equal(storyId)
    });

    it('should be able to post a story with an existing projectId and location', async () => {
      let result = await connect().post('/api/projects').send({
        name: generateRandomString()
      })
      expect(result).to.have.status(200);
      let projectId = result.body.project.id
      result = await connect().post('/api/stories').send({
        projectId : projectId,
        location : [0,0]
      })
      expect(result).to.have.status(200);
    });

    it('should get Stories for a specific project', async () => {
      // add project
      let result = await connect().post('/api/projects').send({
        name: generateRandomString()
      })
      expect(result).to.have.status(200);
      let projectId = result.body.project.id
      // add story
      result = await connect().post('/api/stories').send({
        author: 'peter',
        projectId : projectId,
        location : [0,0]
      })
      expect(result).to.have.status(200);
      // fetch story
      result = await connect().get('/api/stories/?project='+projectId)
      expect(result).to.have.status(200);
      expect(result.body.stories).to.be.lengthOf(1)
      expect(result.body.stories[0].author).to.equal('peter')
    });
  })

});

