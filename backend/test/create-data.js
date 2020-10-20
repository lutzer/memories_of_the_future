const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')
const { loremIpsum } = require('lorem-ipsum')
const _ = require('lodash')

// start server
const { startServer } = require('../dist/app')
const { config } = require('../dist/config')
const { result } = require('lodash')

chai.use(chaiHttp);

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

describe('Create Test Data', () => {

  var server = null

  function connect() { return chai.request(server) }

  before( async () => {
    if (fs.existsSync(config.databaseFile))
      fs.unlinkSync(config.databaseFile)
    server = await startServer()
  })

  after( async () => {
    await server.close()
  });

  async function postProject(project) {
    let result = await connect().post('/api/projects').send({
      name: project.name,
      password: project.password,
      color: project.color,
      description : project.description
    }).auth(config.adminLogin,config.adminPassword)
    return result.body.project
  }

  it('should add an empty project', async () => {
    let project = await postProject({
      name : "Tempelhof",
      color: '#00ff00',
      password: 'password',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
    expect(project.id).to.be.string
  })

  it('should add another project with 20 random stories', async () => {

    const authors = ['Peter','Nitsa','Lutz','Erich','Sidra','Tuukka','Hannah','Mara','Sunke']

    let project = await postProject({
      name : "Project1",
      password: 'password',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
    expect(project.id).to.be.string

    async function addStory() {
      var result = await connect().post('/api/stories').send({
        projectId : project.id,
        author: pickRandom(authors),
        title: loremIpsum({units: 'words', count: 2}),
        text: loremIpsum({count : Math.floor(Math.random() * 10)}),
        location: [52.547695 + (Math.random()-0.5), 13.359864 + (Math.random()-0.5)]
      }).auth(project.name, project.password)
      expect(result).to.have.status(200);

      //add attachment
      result = await connect().post('/api/attachments').send({
        storyId: result.body.story.id,
        type: 'text',
        author: pickRandom(authors),
        text : loremIpsum({count : Math.floor(Math.random() * 10)}),
      }).auth(project.name, project.password)
      expect(result).to.have.status(200);
    }

    // add 20 stories
    await (async function() {
      var p = Promise.resolve()
      _.range(0,20).forEach(() =>
          p = p.then(() => addStory())
      )
      return p;
    })()
  })

  it('should add another project with 2 stories with recordings and images', async () => {
    let project = await postProject({
      name : "Project2",
      password: 'password',
      color: '#0000ff',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
    expect(project.id).to.be.string

    let result = await connect().post('/api/stories').send({
      projectId : project.id,
      author: "Nitsa",
      title: "Geht nicht",
      text: loremIpsum({count : 5}),
      location: [52.547695, 13.359864]
    }).auth(project.name, project.password)
    expect(result).to.have.status(200);
    result = await connect().post('/api/upload/story/'+result.body.story.id)
      .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
      .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
      .auth('Project2', 'password')
    expect(result).to.have.status(200);

    result = await connect().post('/api/stories').send({
      projectId : project.id,
      author: "Felix",
      title: "Musik",
      text: loremIpsum({count : 5}),
      location: [52.538293, 13.343924]
    }).auth(project.name, project.password)
    expect(result).to.have.status(200);
    result = await connect().post('/api/upload/story/'+result.body.story.id)
      .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
      .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
      .auth(project.name, project.password)
    expect(result).to.have.status(200);

    result = await connect().post('/api/stories').send({
      projectId : project.id,
      author: "Sidra",
      title: "Achja",
      text: loremIpsum({count : 5}),
      location: [51.563887, 10.803122]
    }).auth(project.name, project.password)
    expect(result).to.have.status(200);
    result = await connect().post('/api/upload/story/'+result.body.story.id)
      .attach('image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png')
      .attach('recording', fs.readFileSync(__dirname + '/files/sound-mp3.mp3'), 'sound-mp3.mp3')
      .auth('Project2', 'password')
    expect(result).to.have.status(200);
  })

  it('should add another project with 1 story and attachments', async () => {
    let project = await postProject({
      name : "Project3",
      password: 'password',
      color: '#00ffff',
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    })
    expect(project.id).to.be.string

    // post story
    let result = await connect().post('/api/stories').send({
      projectId : project.id,
      author: "Nitsa",
      title: "Lutz",
      text: loremIpsum({count : 5}),
      location: [52.547695, 13.359864]
    }).auth(project.name, project.password)
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
      }).auth(project.name, project.password)
    expect(result).to.have.status(200);
    result = await connect().post('/api/attachments/').send({
      storyId : storyId,
      type: 'text',
      author: 'Anna',
      text: loremIpsum({count : 5}),
    }).auth(project.name, project.password)
    expect(result).to.have.status(200);

    // add file
    result = await connect().post('/api/upload/attachment/' + result.body.attachment.id).attach(
      'image', fs.readFileSync(__dirname + '/files/blob.png'), 'blob.png'
    ).auth(project.name, project.password)
    expect(result).to.have.status(200);
  })

  

});