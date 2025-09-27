const config = require('config');

console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', config.get('port'));
console.log('Mongo URI:', config.get('mongoURI'));
console.log('Secret length:', config.get('secret').length);