const mysql = require('mysql2/promise');

(async () => {
    try {
        const conn = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'delivery_app'
        });

        const [products] = await conn.query('SELECT id, name, image, image1, image2, image3 FROM products LIMIT 5');
        
        console.log('\n=== Productos en MySQL ===\n');
        products.forEach(p => {
            console.log(`ID ${p.id}: ${p.name}`);
            console.log('  image:', p.image || '(null)');
            console.log('  image1:', p.image1 || '(null)');
            console.log('  image2:', p.image2 || '(null)');
            console.log('  image3:', p.image3 || '(null)');
            console.log('');
        });

        await conn.end();
    } catch (e) {
        console.log('Error:', e.message);
    }
})();
