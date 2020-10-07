const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')
const { loremIpsum } = require('lorem-ipsum');

// start server
const { startServer } = require('../dist/app')
const { config } = require('../dist/config')

chai.use(chaiHttp);

describe('Create Test Data', () => {

  var server = null

  function connect() { return chai.request(server) }

  before( async () => {
    fs.unlinkSync(config.databaseFile)
    server = await startServer()
  })

  after( async () => {
    await server.close()
  });

  it('should add a project', async () => {
    let result = await connect().post('/api/projects').send({
      name : "Tempelhof",
      password: 'password',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
    expect(result).to.have.status(200);
    expect(result.body.project.id).to.be.string
  })

  it('should add another project with 3 stories', async () => {
    let result = await connect().post('/api/projects').send({
      name : "Project1",
      password: 'password',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
    expect(result).to.have.status(200);
    expect(result.body.project.id).to.be.string
    const projectId = result.body.project.id
    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Nitsa",
      title: "Graefe 32",
      text: loremIpsum({count : 5}),
      location: [52.547695, 13.359864]
    }).auth('Project1', 'password')
    expect(result).to.have.status(200);
    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Felix",
      title: "Test Titel",
      text: loremIpsum({count : 5}),
      location: [52.538293, 13.343924]
    }).auth('Project1', 'password')
    expect(result).to.have.status(200);
    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Sidra",
      title: "Eis essen",
      text: loremIpsum({count : 5}),
      location: [51.563887, 10.803122]
    }).auth('Project1', 'password')
    expect(result).to.have.status(200);

    //add attachment
    result = await connect().post('/api/attachments').send({
      storyId: result.body.story.id,
      type: 'text',
      text : 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud.'
    }).auth('Project1', 'password')
    expect(result).to.have.status(200);
  })

  it('should add another project with 2 stories with recordings and images', async () => {
    let result = await connect().post('/api/projects').send({
      name : "Project2",
      password: 'password',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
    expect(result).to.have.status(200);
    expect(result.body.project.id).to.be.string
    const projectId = result.body.project.id

    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Nitsa",
      title: "Geht nicht",
      text: loremIpsum({count : 5}),
      location: [52.547695, 13.359864]
    }).auth('Project2', 'password')
    expect(result).to.have.status(200);
    result = await connect().post('/api/upload/story/'+result.body.story.id)
      .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
      .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
      .auth('Project2', 'password')
    expect(result).to.have.status(200);

    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Felix",
      title: "Musik",
      text: loremIpsum({count : 5}),
      location: [52.538293, 13.343924]
    }).auth('Project2', 'password')
    expect(result).to.have.status(200);
    result = await connect().post('/api/upload/story/'+result.body.story.id)
      .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
      .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
      .auth('Project2', 'password')
    expect(result).to.have.status(200);

    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Sidra",
      title: "Achja",
      text: loremIpsum({count : 5}),
      location: [51.563887, 10.803122]
    }).auth('Project2', 'password')
    expect(result).to.have.status(200);
    result = await connect().post('/api/upload/story/'+result.body.story.id)
      .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
      .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
      .auth('Project2', 'password')
    expect(result).to.have.status(200);
  })

  it('should add another project with 1 story and attachments', async () => {
    let result = await connect().post('/api/projects').send({
      name : "Project3",
      password: 'password',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
    expect(result).to.have.status(200);
    expect(result.body.project.id).to.be.string
    const projectId = result.body.project.id

    // post story
    result = await connect().post('/api/stories').send({
      projectId : projectId,
      author: "Nitsa",
      title: "Lutz",
      text: loremIpsum({count : 5}),
      location: [52.547695, 13.359864]
    }).auth('Project3', 'password')
    const storyId = result.body.story.id;
    expect(result).to.have.status(200);
    result = await connect().post('/api/upload/story/'+storyId)
      .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
      .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
      .auth('Project3', 'password')
    expect(result).to.have.status(200);

    // post attachments
    result = await connect().post('/api/attachments/').send({
      storyId : storyId,
      type: 'text',
      author: 'Peter',
      text: loremIpsum({count : 5}),
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }).auth('Project3', 'password')
    expect(result).to.have.status(200);
    result = await connect().post('/api/attachments/').send({
      storyId : storyId,
      type: 'text',
      author: 'Anna',
      text: loremIpsum({count : 5}),
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
    }).auth('Project3', 'password')
    expect(result).to.have.status(200);
  })

  

});