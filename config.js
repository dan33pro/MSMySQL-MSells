require('dotenv').config();

module.exports = {
    mysqlService: {
        host: process.env.MYSQL_SERVICE_HOST || '',
        port: process.env.MYSQL_SERVICE_PORT || '',
    },
    mysql: {
        host: process.env.MYSQL_HOST || '',
        user: process.env.MYSQL_USER || '',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DB || '',
        port: process.env.MYSQL_PORT || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || '',
    },
};