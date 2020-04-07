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

  it('should create an empty StoryModel and attach an id', async () => {
    let story = new StoryModel({})
    expect(story.data.id).to.not.be.empty
    expect(story.data.author).equals('unknown')
    expect(story.data.location).to.be.null
  });

});