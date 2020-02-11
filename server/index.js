const startServer = require('./server')
const init = require('./init')

const mockServers = new Map()

init(mockServers)
startServer(mockServers)
