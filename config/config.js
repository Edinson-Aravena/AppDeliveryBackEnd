const mysql = require('mysql2')

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'delivery_app'
})

db.connect(function(err){
    if(err) throw err;

    console.log(`SUCCESSFUL CONNECTION TO ${db.config.database} DATABASE`)
})

module.exports = db;