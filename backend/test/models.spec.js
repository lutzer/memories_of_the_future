const chai = require('chai')
const expect = chai.expect

const { ProjectModel } = require('../dist/models/ProjectModel')
const { StoryModel } = require('../dist/models/StoryModel')

describe('Models', () => {

  it('should create an empty ProjectModel and attach an id', async () => {
    let project = new ProjectModel({})
    expect(project.data.id).to.not.be.empty
    expect(project.data.name).equals('unnamed')
  });

  it('should not validate ProjectModel without a name', async () => {
    expect((new ProjectModel({})).validate()).is.false
    expect((new ProjectModel({ 'name' : 'test' })).validate()).is.true
  });

  it('should create an empty StoryModel and attach an id', async () => {
    let story = new StoryModel({})
    expect(story.data.id).to.not.be.empty
    expect(story.data.author).equals('unknown')
    expect(story.data.location).to.be.null
  });

  it('should not validate StoryModel without a location', async () => {
    expect((new StoryModel({ projectId : '1'})).validate()).is.false
    expect((new StoryModel({ projectId : '1', location : [0,0] })).validate()).is.true
  });

  it('should not validate StoryModel without a projectId', async () => {
    expect((new StoryModel({location : [0,0] })).validate()).is.false
    expect((new StoryModel({location : [0,0], projectId : '1' })).validate()).is.true
  });

  it('should create color for storyModel depending on author', async () => {
    const story1 = new StoryModel({
      author: 'anna'
    })
    const story2 = new StoryModel({
      author: 'hans'
    })
    const story3 = new StoryModel({
      author: 'anna'
    })
    expect(story1.data.color).to.be.equal(story3.data.color)
    expect(story1.data.color).to.be.not.equal(story2.data.color)
  })

});