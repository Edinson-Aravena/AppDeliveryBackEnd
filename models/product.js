const db = require('../config/config');
const Product = {};


Product.create = (product, result) => {

    const sql = `
        insert into 
            products
                (name, description, price, image1, image2, image3, id_category, created_at, updated_at)
        values(?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            product.name,
            product.description,
            product.price,
            product.image1,
            product.image2,
            product.image3,
            product.id_category,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('ID del nuevo producto', res.insertId);
                result(null, res.insertId);
            }
        }
    );

}


Product.update = (product, result) => {

    const sql = `
        update
            products
        set
            name = ?,
            description = ?,
            price = ?,
            image1 = ?,
            image2 = ?,
            image3 = ?,
            id_category = ?,
            updated_at = ?
        where
            id = ?  
    `;

    db.query(
        sql,
        [
            product.name,
            product.description,
            product.price,
            product.image1,
            product.image2,
            product.image3,
            product.id_category,
            new Date(),
            product.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('ID del producto actualizado', product.id);
                result(null, product.id);
            }
        }
    );

}

module.exports = Product;