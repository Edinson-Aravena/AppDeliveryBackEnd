const db = require('./config/config');

const sql = `SELECT id, name, image1, image2, image3 FROM products LIMIT 5`;

db.query(sql, (err, data) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Productos en la base de datos:');
        console.log(JSON.stringify(data, null, 2));
    }
    db.end();
});
