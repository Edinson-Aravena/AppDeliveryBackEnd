const db = require('../config/config');
const Address = {};

Address.findById = (id, result) => {
    const sql = `
        select 
            CONVERT(id,char) as id, 
            address, 
            neighborhood, 
            lat, 
            lng,
            CONVERT(id_user,char) as id_user
        from 
            address
        where 
            id = ?
    `;

    db.query(
        sql,
        [id],
        (err, data) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                result(null, data[0]);
            }
        });
}

Address.findByUser = (id_user, result) => {
    const sql = `
        select 
            CONVERT(id,char) as id, 
            address, 
            neighborhood, 
            lat, 
            lng,
            CONVERT(id_user,char) as id_user
        from 
            address
        where 
            id_user = ?
    `;

    db.query(
        sql,
        [id_user],
        (err, data) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('Direcciones encontradas', data);
                result(null, data);
            }
        });
}
Address.create = (address, result) => {

    const sql = `
        insert into 
            address
                (address, neighborhood, lat, lng, id_user, created_at, updated_at)
        values(?,?,?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            address.address,
            address.neighborhood,
            address.lat,
            address.lng,
            address.id_user,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('Id nueva direccion', res.insertId);
                result(null, res.insertId);
            }
        }
    );

}

Address.delete = (id, result) => {
    const sql = `
        DELETE FROM address WHERE id = ?
    `;

    db.query(
        sql,
        [id],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            } else {
                console.log('Dirección eliminada:', id);
                result(null, res);
            }
        }
    );
}

module.exports = Address;