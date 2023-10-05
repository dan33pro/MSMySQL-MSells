require('dotenv').config();

module.exports = {
    api: {
        port: process.env.API_PORT || 3000,
    },
    mysqlService: {
        host: process.env.MYSQL_SERVICE_HOST || '',
        port: process.env.MYSQL_SERVICE_PORT || '',
    },
    cacheService: {
        host: process.env.CACHE_SERVICE_HOST || '',
        port: process.env.CACHE_SERVICE_PORT || '',
    },
    mysql: {
        host: process.env.MYSQL_HOST || '',
        user: process.env.MYSQL_USER || '',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DB || '',
        port: process.env.MYSQL_PORT || '',
    },
    redis: {
        host: process.env.REDIS_HOST || '',
        port: process.env.REDIS_PORT || '',
        password: process.env.REDIS_PASSWORD || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
    },
    sendMail: {
        mail: process.env.SEND_MAIL || '',
        password: process.env.APLICATION_PASSWORD,
    },
    sendSMS: {
        accountSid: process.env.ACCOUNT_SID || '',
        authToken: process.env.AUTH_TOKEN || '',
        codPais: process.env.COD_PAIS || '',
        phoneNumber: process.env.PHONE_NUMBER || '',
    },
};