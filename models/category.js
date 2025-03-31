const db = require('../config/config');
const Category = {};

Category.create = (category, result) => {

    const sql = `
        insert into 
            categories
                (name, description, image, created_at, updated_at)
        values(?,?,?,?,?)
    `;

    db.query(
        sql,
        [
            category.name,
            category.description,
            category.image,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('ID new category:', res.insertId);
                result(null, res.insertId);
            }
        }
    );
    
}

module.exports = Category;