const db = require('../config/config');
const Product = {};

Product.findByCategory = (id_category, result) => {
    const sql = `
        select
            P.id,
            P.name,
            P.description,
            P.price,
            COALESCE(P.image1, P.image) as image1,
            COALESCE(P.image2, P.image) as image2,
            COALESCE(P.image3, P.image) as image3,
            P.id_category
        from 
            products as P
        where
            P.id_category = ?
        `;

        db.query(
            sql,
            [id_category],
            (err, res) => {
                if (err) {
                    console.log('Error:' + err);
                    result(err, null);
                } else {
                    console.log('Productos encontrados', res);
                    result(null, res);
                }
            }
        );

}

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

Product.delete = (id, result) => {
    sql = `
        delete from 
            products
        where
            id = ?
    `;

    db.query(
        sql,
        [id],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('ID del producto eliminado', id);
                result(null, id);
            }
        }
    );
}


module.exports = Product;