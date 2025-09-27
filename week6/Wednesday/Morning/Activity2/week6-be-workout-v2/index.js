const app = require('./app')
const http = require('http')
const mongoose = require('mongoose')
const config = require('config')  // 改为 require('config')
const logger = require('./utils/logger')

const server = http.createServer(app)

// connect to db
logger.info('connecting to', config.get('mongoURI'))  // 改为 config.get()
mongoose
  .connect(config.get('mongoURI'))  // 改为 config.get()
  .then(() => {
    logger.info("connected to MongoDB")

    // 只有在数据库连接成功后才启动服务器
    server.listen(config.get('port'), () => {  // 改为 config.get()
      logger.info(`Server running on port ${config.get('port')}`)  // 改为 config.get()
    })
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })