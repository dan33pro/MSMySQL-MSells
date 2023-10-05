const mysql = require('mysql2');

const config = require('../../../config');
const error = require('../utils/error');

const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
};


// Connect!
let connection;

function handleCon() {
    connection = mysql.createConnection(dbconf);
    connection.connect((err) => {
        if(err) {
            console.error('[db err]', err);
            setTimeout(handleCon, 2000);
        } else {
            console.log('DB Connected!');
        }
    });

    connection.on('error', err => {
        console.error('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleCon();
        } else {
            throw err;
        }
    });
}

handleCon();

function list(table) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table.name}`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

function get(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table.name} WHERE ${table.pk}=${id}`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`INSERT INTO ${table.name} SET ?`, data, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
}

function update(table, data) {
    return new Promise((resolve, reject) => {
        connection.query(`UPDATE ${table.name} SET ? WHERE ${table.pk}=?`, [data, data[table.pk]], (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
}

function upsert(table, data, accion) {
    switch(accion) {
        case 'insert':
            return insert(table, data);
        case 'update':
            return update(table, data);
        default:
            throw error('No se especifica la acción en la petición', 405);
    }
}

function query(table, query) {
    return new Promise((resolve, reject) => {
        const key = Object.keys(query)[0];
        const value = query[key];
        connection.query(`SELECT * FROM ${table.name} WHERE ${key}='${value}'`, (err, res) => {
            if(err) {
                return reject(err);
            }
            resolve(res[0] || null);
        });
    });
}

function query(table, query, join) {
    let joinQuery = '';
    if(join) {
        const key = Object.keys(join)[0];
        const val = join[key];
        joinQuery = `JOIN ${key} ON ${table.name}.${val} = ${key}.${table.pk}`;
    }

    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${table.name} ${joinQuery} WHERE ${table.name}.?`, query, (err, res) => {
            if(err) {
                return reject(err);
            }
            resolve(res || null);
        });
    })
}

function remove(table, id) {
    return new Promise((resolve, reject) => {
        connection.query(`DELETE FROM ${table.name} WHERE ${table.pk}=${id}`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

module.exports = {
    list,
    get,
    upsert,
    query,
    remove,
};