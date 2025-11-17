const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'delivery_app'
});

db.connect(async (err) => {
    if (err) {
        console.error('❌ Error:', err);
        process.exit(1);
    }

    console.log('✅ Conectado a la base de datos\n');

    // Verificar si el campo role acepta el valor CHEF
    const testSql = `
        UPDATE users 
        SET role = 'CHEF'
        WHERE id = 24
    `;

    db.query(testSql, (err, result) => {
        if (err) {
            console.error('❌ Error actualizando:', err);
            db.end();
            process.exit(1);
        }

        console.log(`✅ Usuario actualizado: ${result.affectedRows} filas`);

        // Verificar el resultado
        db.query('SELECT id, username, name, role FROM users WHERE id = 24', (err, results) => {
            if (err) {
                console.error('❌ Error:', err);
            } else {
                console.log('\n📊 Usuario después de actualizar:');
                console.log(results[0]);
            }
            db.end();
        });
    });
});
