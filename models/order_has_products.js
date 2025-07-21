const db = require('../config/config');
const OrderHasProducts= {};



OrderHasProducts.create = (id_order, id_product, quantity, result) => {

    const sql = `
        insert into 
            orders_has_products(
                id_order,
                id_product,
                quantity,
                created_at,
                updated_at
            )
        values(?, ?, ?, ?, ?);
    `;

    db.query(
        sql,
        [
            id_order,
            id_product,
            quantity,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('ID de la nueva orden has product' + res.insertId);
                result(null, res.insertId);
            }
        }
    );

}

module.exports = OrderHasProducts;