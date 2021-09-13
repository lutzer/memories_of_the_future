const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect
const fs = require('fs')

const { convertToMp3 } = require('./../dist/upload')

describe('Audio File Conversion', () => {

  const wavFile = __dirname + '/files/sound-wav.wav'
  const oggFile = __dirname + '/files/sound-ogg.ogg'
  const mp3File = __dirname + '/files/sound-mp3.mp3'
  const webmFile = __dirname + '/files/sound-webm.webm'
  const m4aFile = __dirname + '/files/sound-m4a.m4a'
  const mp4File = __dirname + '/files/sound-mp4.mp4'

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

  it('convertToMp3 should convert m4a to mp3', async () => {
    let path = await convertToMp3(m4aFile)
    expect(path).to.be.string
    expect(fs.existsSync(path)).to.be.true
    fs.unlinkSync(path)
  }).timeout(5000)

  it('convertToMp3 should handle webm as well', async () => {
    let path = await convertToMp3(webmFile)
    expect(path).to.be.string
    expect(fs.existsSync(path)).to.be.true
    fs.unlinkSync(path)
  })

  it('convertToMp3 should handle mp4 as well', async () => {
    let path = await convertToMp3(mp4File)
    expect(path).to.be.string
    expect(fs.existsSync(path)).to.be.true
    fs.unlinkSync(path)
  })

  it.skip('convertToMp3 should handle mp3 as well', async () => {
    let path = await convertToMp3(mp3File)
    expect(path).to.be.string
    expect(fs.existsSync(path)).to.be.true
    if (mp3File != path)
      fs.unlinkSync(path)
  })

})