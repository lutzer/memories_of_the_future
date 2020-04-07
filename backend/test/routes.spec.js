const chai = require('chai')
const chaiHttp = require('chai-http')
const { server } = require('../dist/index')
const expect = chai.expect

chai.use(chaiHttp);

const connect = () => { return chai.request(server) }

describe('Project Routes', () => {

  after(() => {
    server.close()
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

describe('Story routes', () => {

  it('should get Stories', async () => {
    let result = await connect().get('/api/stories/')
    expect(result).to.have.status(200);
    expect(result.body.msg).equal('Stories');
  });

  it('should not be able to post a story without a projectId', async () => {
    let result = await connect().post('/api/stories').send({})
    expect(result).to.have.status(400);
  });

  it('should not be able to post a story without an existing projectId', async () => {
    let result = await connect().post('/api/stories').send({
      projectId : "1234"
    })
    expect(result).to.have.status(400);
  });

})