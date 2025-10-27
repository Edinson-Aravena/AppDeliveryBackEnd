// Script para probar el login
const bcrypt = require('bcryptjs');

// Contraseña que quieres probar
const password = 'admin123';

// Hash que está en la base de datos
const hash = '$2a$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGQIMT8M6hJhKxXP7wHGGqe';

// Comparar
bcrypt.compare(password, hash).then(result => {
    console.log('¿La contraseña coincide?:', result);
    
    // Generar un nuevo hash
    return bcrypt.hash(password, 10);
}).then(newHash => {
    console.log('\nNuevo hash generado para "admin123":');
    console.log(newHash);
    console.log('\nEjecuta este SQL en MySQL Workbench:');
    console.log(`UPDATE users SET password = '${newHash}' WHERE username = 'admin';`);
}).catch(err => {
    console.error('Error:', err);
});
