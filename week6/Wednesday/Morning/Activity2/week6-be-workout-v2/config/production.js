module.exports = {
  port: process.env.PORT || 4000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/w6-be',
  secret: process.env.SECRET || '64bytesofrandomness'
};