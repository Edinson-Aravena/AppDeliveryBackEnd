const db = require('../config/config');
const Address = {};


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



module.exports = Address;