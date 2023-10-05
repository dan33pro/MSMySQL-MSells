const db = {
    'user': [
        {id: 1, name: 'Carlos'},
    ],
};

const list = async (tabla) => {
    return db[tabla] || [];
};

const get = async (tabla, id) => {
    let coleccion = await list(tabla);
    return coleccion.filter( item => item.id == id)[0] || null;
};

const upsert = async (tabla, data) => {
    if(!db[tabla]) {
        db[tabla] = [];
    }
    
    db[tabla].push(data);
    return data;
};

const remove = async (tabla, id) => {
    const index = db[tabla].findIndex((item) => item.id == id);
    if(index >= 0) {
        db[tabla].splice(index, 1);
    }
    return true;
};

const query = async (tabla, q) => {
    let coleccion = await list(tabla);
    let keys = Object.keys(q);
    let key = keys[0];
    return coleccion.filter( item => item[key] == q[key])[0] || null;
};

module.exports = {
    list,
    get,
    upsert,
    remove,
    query,
};