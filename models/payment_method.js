const db = require('../config/config');

const PaymentMethod = {};

PaymentMethod.create = (paymentMethod) => {
    const sql = `
        INSERT INTO payment_methods (
            id_user,
            card_holder_name,
            card_last_four,
            card_number_encrypted,
            card_brand,
            card_token,
            identification_type,
            identification_number,
            expiration_month,
            expiration_year,
            is_default,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    return db.promise().execute(sql, [
        paymentMethod.id_user,
        paymentMethod.card_holder_name,
        paymentMethod.card_last_four,
        paymentMethod.card_number_encrypted,
        paymentMethod.card_brand,
        paymentMethod.card_token,
        paymentMethod.identification_type,
        paymentMethod.identification_number,
        paymentMethod.expiration_month,
        paymentMethod.expiration_year,
        paymentMethod.is_default || false,
        new Date(),
        new Date()
    ]);
};

PaymentMethod.findByUser = (id_user) => {
    const sql = `
        SELECT
            id,
            id_user,
            card_holder_name,
            card_last_four,
            card_number_encrypted,
            card_brand,
            card_token,
            identification_type,
            identification_number,
            expiration_month,
            expiration_year,
            is_default,
            created_at,
            updated_at
        FROM payment_methods
        WHERE id_user = ?
        ORDER BY is_default DESC, created_at DESC
    `;

    return db.promise().query(sql, [id_user]);
};

PaymentMethod.findById = (id) => {
    const sql = `
        SELECT
            id,
            id_user,
            card_holder_name,
            card_last_four,
            card_brand,
            card_token,
            expiration_month,
            expiration_year,
            is_default,
            created_at,
            updated_at
        FROM payment_methods
        WHERE id = ?
    `;

    return db.promise().query(sql, [id]);
};

PaymentMethod.delete = (id) => {
    const sql = `DELETE FROM payment_methods WHERE id = ?`;
    return db.promise().execute(sql, [id]);
};

PaymentMethod.setDefault = (id, id_user) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Primero quitar el default de todas las tarjetas del usuario
            const sql1 = `UPDATE payment_methods SET is_default = 0 WHERE id_user = ?`;
            await db.promise().execute(sql1, [id_user]);

            // Luego establecer la tarjeta seleccionada como default
            const sql2 = `UPDATE payment_methods SET is_default = 1 WHERE id = ? AND id_user = ?`;
            const result = await db.promise().execute(sql2, [id, id_user]);
            
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = PaymentMethod;
