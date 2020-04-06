const chai = require('chai')
const chaiHttp = require('chai-http')
const { server } = require('../dist/index')
const expect = chai.expect

chai.use(chaiHttp);

describe('Basic routes', () => {
  after(() => {
    server.close()
  });

  it('should get Stories', async () => {
    let result = await chai.request(server).get("/api/stories/")
    expect(result).to.have.status(200);
    expect(result.body.msg).equal("Stories");
  });
});