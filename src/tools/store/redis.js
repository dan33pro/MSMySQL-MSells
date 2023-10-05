const redis = require('redis');
const config = require('../../../config');

const client = redis.createClient({
    password: config.redis.password || '',
    socket: {
        host: config.redis.host || '',
        port: config.redis.port || '',
    }
});