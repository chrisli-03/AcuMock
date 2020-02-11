const path = require('path')
const fs = require('fs')

const createMockServerFile = (name, data) => {
  if (fs.existsSync(path.join(__dirname, `../api/${name}.json`))) {
    throw new Error('Mock Server Exists.')
  }
  fs.writeFileSync(path.join(__dirname, `../api/${name}.json`), JSON.stringify(data, null, 2))
}

exports.createMockServerFile = createMockServerFile
