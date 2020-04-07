const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

const { app } = require('../dist/index')

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
      let result = await connect().post('/api/projects').send({
        name: 'testName'
      })
      expect(result).to.have.status(200);
      expect(result.body.project.name).equal('testName');
      expect(result.body.project.id).is.not.empty
    })

    it('should not be able to add a project without a name', async () => {
      let result = await connect().post('/api/projects').send({})
      expect(result).to.have.status(400);
    })

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
        projectId : "1234",
        location : [0,0]
      })
      expect(result).to.have.status(400);
    });

    it('should be able to post a story with an existing projectId and location', async () => {
      let result = await connect().post('/api/projects').send({
        name: 'testName'
      })
      expect(result).to.have.status(200);
      let projectId = result.body.project.id
      result = await connect().post('/api/stories').send({
        projectId : projectId,
        location : [0,0]
      })
      expect(result).to.have.status(200);
    });
  })

});

