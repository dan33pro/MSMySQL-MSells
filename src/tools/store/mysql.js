const mysql = require('mysql2');

const config = require('../../../config');
const error = require('../utils/error');

const dbconf = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    connectTimeout: 20000,
};


// Connect!
let pool;

function handleCon() {
    pool = mysql.createPool(dbconf);
    pool.getConnection((err, connection) => {
        if(err) {
            console.error('[db err]', err);
            setTimeout(handleCon, 2000);
        } else {
            console.log('DB Connected!');
        }
    });

    pool.on('error', err => {
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
        pool.query(`SELECT * FROM ${table.name}`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

function get(table, id) {
    return new Promise((resolve, reject) => {
        let q = "";
        if (isNaN(id)) {
            q = `SELECT * FROM ${table.name} WHERE ${table.pk}='${id}'`;
        } else {
            q = `SELECT * FROM ${table.name} WHERE ${table.pk}=${id}`;
        }
        pool.query(q, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

function getCompose(table, idOne, idTwo) {
    return new Promise((resolve, reject) => {
        let valueOne = isNaN(idOne) ? `'${idOne}'` : `${idOne}`;
        let valueTwo = isNaN(idTwo) ? `'${idTwo}'` : `${idTwo}`;

        let q = `SELECT * FROM ${table.name} WHERE ${table.pkOne}=${valueOne} AND ${table.pkTwo}=${valueTwo}`;
        pool.query(q, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

function insert(table, data) {
    return new Promise((resolve, reject) => {
        pool.query(`INSERT INTO ${table.name} SET ?`, data, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
}

function update(table, data) {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE ${table.name} SET ? WHERE ${table.pk}=?`, [data, data[table.pk]], (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
}

function updateCompose(table, data) {
    return new Promise((resolve, reject) => {
        pool.query(`UPDATE ${table.name} SET ? WHERE ${table.pkOne}=? AND ${table.pkTwo}=?`, [data, data[table.pkOne], data[table.pkTwo]], (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
}

function upsert(table, data, accion) {
    switch(accion) {
        case 'insert':
            return insert(table, data);
        case 'insert-compose':
            return insert(table, data);
        case 'update':
            return update(table, data);
        case 'update-compose':
            return updateCompose(table, data);
        default:
            throw error('No se especifica la acción en la petición', 405);
    }
}

function query(table, query) {
    return new Promise((resolve, reject) => {
        const key = Object.keys(query)[0];
        const value = query[key];
        pool.query(`SELECT * FROM ${table.name} WHERE ${key}='${value}'`, (err, res) => {
            if(err) {
                return reject(err);
            }
            resolve(res[0] || null);
        });
    });
}

function remove(table, id) {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM ${table.name} WHERE ${table.pk}='${id}'`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

function removeCompose(table, idOne, idTwo) {
    return new Promise((resolve, reject) => {
        pool.query(`DELETE FROM ${table.name} WHERE ${table.pkOne}='${idOne}' AND ${table.pkTwo}='${idTwo}'`, (err, data) => {
            if(err) return reject(err);
            resolve(data);
        });
    });
}

module.exports = {
    list,
    get,
    getCompose,
    upsert,
    query,
    remove,
    removeCompose,
};