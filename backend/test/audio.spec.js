const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')

const { convertToMp3 } = require('./../dist/utils')

describe('Audio File Conversion', () => {

  const wavFile = __dirname + '/files/sound-wav.wav'
  const oggFile = __dirname + '/files/sound-ogg.ogg'

  it('convertToMp3 should convert wav to mp3', async () => {
    let path = await convertToMp3(wavFile)
    expect(path).to.be.string
    expect(fs.existsSync(path)).to.be.true
    fs.unlinkSync(path)
  })

  it('convertToMp3 should convert ogg to mp3', async () => {
    let path = await convertToMp3(oggFile)
    expect(path).to.be.string
    expect(fs.existsSync(path)).to.be.true
    fs.unlinkSync(path)
  })

})