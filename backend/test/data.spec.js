const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect

// delete database file first
const { config } = require('../dist/config')
const fs = require('fs')
fs.unlinkSync(config.databaseFile)

// start server
const { server } = require('../dist/index')

chai.use(chaiHttp);

const connect = () => { return chai.request(server) }

describe('Create Test Data', () => {

  after( async () => {
    await server.close()
  });

  it('should add a project', async () => {
    let result = await connect().post('/api/projects').send({
      name : "Tempelhof",
      description: "Lorem ipsum dol"
    })
    expect(result).to.have.status(200);
    expect(result.body.project.id).to.be.string
  })

  it('should add another project with 3 stories for testing', async () => {
    let result = await connect().post('/api/projects').send({
      name : "Project1",
      description: "Lorem ipsum"
    })
    expect(result).to.have.status(200);
    expect(result.body.project.id).to.be.string
    const projectId = result.body.project.id
    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Nitsa",
      title: "Lutz",
      location: [52.547695, 13.359864]
    })
    expect(result).to.have.status(200);
    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Felix",
      title: "Lutz",
      location: [52.538293, 13.343924]
    })
    expect(result).to.have.status(200);
    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Sidra",
      title: "Lutz",
      location: [51.563887, 10.803122]
    })
    expect(result).to.have.status(200);

  })

});