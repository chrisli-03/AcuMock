const path = require('path')
const fs = require('fs')

const readMockServerFile = (name) => {
  const filepath = path.join(__dirname, `../api/${name}.json`)
  if (!fs.existsSync(filepath)) {
    throw new Error('Mock Server Does Not Exist.')
  }
  return JSON.parse(fs.readFileSync(filepath))
}

const createMockServerFile = (name, data) => {
  if (fs.existsSync(path.join(__dirname, `../api/${name}.json`))) {
    throw new Error('Mock Server Exists.')
  }
  fs.writeFileSync(path.join(__dirname, `../api/${name}.json`), JSON.stringify(data, null, 2))
}

const deleteMockServerFile = (name, data) => {
  const filepath = path.join(__dirname, `../api/${name}.json`)
  if (!fs.existsSync(filepath)) {
    throw new Error('Mock Server Does Not Exist.')
  }
  fs.unlinkSync(filepath)
}

exports.readMockServerFile = readMockServerFile
exports.createMockServerFile = createMockServerFile
exports.deleteMockServerFile = deleteMockServerFile
