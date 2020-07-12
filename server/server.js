const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const compression = require('compression')
const DataBase = require('./db')
const setupServerRoutes = require('./routes/serverRoutes')

const db = new DataBase()

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    // don't compress responses with this request header
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

const app = express()
const port = 3001

app.use(bodyParser.json())
app.use(compression({ filter: shouldCompress }))

setupServerRoutes(app, db)

app.use(express.static(path.join(__dirname, '../build')))
app.use((req, res) => res.sendFile(path.join(__dirname, '../build/index.html')))

app.listen(port, () => console.log(`AcuMock app listening on port ${port}!`))
