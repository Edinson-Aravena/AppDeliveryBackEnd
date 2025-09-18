const db = require('../config/config');
const Order = {};

Order.findByStatus = (status, result) => {
    const sql = `
    select 
        convert(O.id, char) as id,
        convert(O.id_client, char) as id_client,
        convert(O.id_address, char) as id_address,
        convert(O.id_delivery, char) as id_delivery,
        O.status,
        O.timestamp,
        json_object (
            'id', convert(O.id_delivery, char),
            'address', A.address,
            'neighborhood', A.neighborhood,
            'lat', A.lat,
            'lng', A.lng
        ) as address,
        json_object (
            'id', convert(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
            
        ) as client,
        json_object (
            'id', convert(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
            
        ) as delivery,
        json_arrayagg(
            json_object(
                'id', convert(P.id, char),
                'name', P.name,
                'description', P.description,
                'image1', P.image1,
                'image2', P.image2,
                'image3', P.image3,
                'price', P.price,
                'quantity', OHP.quantity
            )
        ) as products
    from
        orders as O
    inner join
        users as U
    on
        U.id= O.id_client
    left join 
        users as U2
    on
        U2.id = O.id_delivery
    inner join
        address as A
    on 
        A.id = O.id_address
    inner join
        orders_has_products as OHP
    on
        OHP.id_order = O.id
    inner join
        products as P
    on
        P.id = OHP.id_product
    where 
        status = ?
    group by
        o.id;
    `;

    db.query(
        sql,
        status,
        (err, data) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('Ordenes encontradas: ' + data.length);
                result(null, data);
            }
        });
}

Order.findByDeliveryAndStatus = (id_delivery, status, result) => {
    const sql = `
    select 
        convert(O.id, char) as id,
        convert(O.id_client, char) as id_client,
        convert(O.id_address, char) as id_address,
        convert(O.id_delivery, char) as id_delivery,
        O.status,
        O.timestamp,
        json_object (
            'id', convert(O.id_delivery, char),
            'address', A.address,
            'neighborhood', A.neighborhood,
            'lat', A.lat,
            'lng', A.lng
        ) as address,
        json_object (
            'id', convert(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
            
        ) as client,
        json_object (
            'id', convert(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
            
        ) as delivery,
        json_arrayagg(
            json_object(
                'id', convert(P.id, char),
                'name', P.name,
                'description', P.description,
                'image1', P.image1,
                'image2', P.image2,
                'image3', P.image3,
                'price', P.price,
                'quantity', OHP.quantity
            )
        ) as products
    from
        orders as O
    inner join
        users as U
    on
        U.id= O.id_client
    left join 
        users as U2
    on
        U2.id = O.id_delivery
    inner join
        address as A
    on 
        A.id = O.id_address
    inner join
        orders_has_products as OHP
    on
        OHP.id_order = O.id
    inner join
        products as P
    on
        P.id = OHP.id_product
    where 
        O.id_delivery = ? and
        O.status = ?
    group by
        o.id;
    `;

    db.query(
        sql,
        [id_delivery, status],
        (err, data) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('Ordenes encontradas: ' + data.length);
                result(null, data);
            }
        });
}

Order.findByClientAndStatus= (id_client, status, result) => {
    const sql = `
    select 
        convert(O.id, char) as id,
        convert(O.id_client, char) as id_client,
        convert(O.id_address, char) as id_address,
        convert(O.id_delivery, char) as id_delivery,
        O.status,
        O.timestamp,
        json_object (
            'id', convert(O.id_delivery, char),
            'address', A.address,
            'neighborhood', A.neighborhood,
            'lat', A.lat,
            'lng', A.lng
        ) as address,
        json_object (
            'id', convert(U.id, char),
            'name', U.name,
            'lastname', U.lastname,
            'image', U.image,
            'phone', U.phone
            
        ) as client,
        json_object (
            'id', convert(U2.id, char),
            'name', U2.name,
            'lastname', U2.lastname,
            'image', U2.image,
            'phone', U2.phone
            
        ) as delivery,
        json_arrayagg(
            json_object(
                'id', convert(P.id, char),
                'name', P.name,
                'description', P.description,
                'image1', P.image1,
                'image2', P.image2,
                'image3', P.image3,
                'price', P.price,
                'quantity', OHP.quantity
            )
        ) as products
    from
        orders as O
    inner join
        users as U
    on
        U.id= O.id_client
    left join 
        users as U2
    on
        U2.id = O.id_delivery
    inner join
        address as A
    on 
        A.id = O.id_address
    inner join
        orders_has_products as OHP
    on
        OHP.id_order = O.id
    inner join
        products as P
    on
        P.id = OHP.id_product
    where 
        O.id_client = ? and
        O.status = ?
    group by
        o.id;
    `;

    db.query(
        sql,
        [id_client, status],
        (err, data) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('Ordenes encontradas: ' + data.length);
                result(null, data);
            }
        });
}


Order.create = (order, result) => {

    const sql = `
        insert into 
            orders(
                id_client,
                id_address,
                status,
                timestamp,
                created_at,
                updated_at
            )
        values(?, ?, ?, ?, ?, ?);
    `;

    db.query(
        sql,
        [
            order.id_client,
            order.id_address,
            'PAGADO', //1. PAGADO, 2. DESPACHADO 3. EN CAMINO, 4. ENTREGADO
            Date.now(),
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                console.log('ID de la nueva orden' + res.insertId);
                result(null, res.insertId);
            }
        }
    );

}

Order.updateToDispatched = (id_order, id_delivery, result) => {
    const sql = `
        update 
            orders
        set 
            id_delivery = ?,
            status = ?, -- 1. PAGADO, 2. DESPACHADO 3. EN CAMINO, 4. ENTREGADO
            updated_at = ?
        where 
            id = ?
    `;

    db.query(
        sql,
        [
            id_delivery,
            'DESPACHADO', // 2. DESPACHADO
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                result(null, id_order);
            }
        }
    );
}

Order.updateToOnTheWay = (id_order, id_delivery, result) => {
    const sql = `
        update 
            orders
        set 
            id_delivery = ?,
            status = ?, -- 1. PAGADO, 2. DESPACHADO 3. EN CAMINO, 4. ENTREGADO
            updated_at = ?
        where 
            id = ?
    `;

    db.query(
        sql,
        [
            id_delivery,
            'EN CAMINO', // 3. EN CAMINO
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                result(null, id_order);
            }
        }
    );
}

Order.updateToDelivered = (id_order, id_delivery, result) => {
    const sql = `
        update 
            orders
        set 
            id_delivery = ?,
            status = ?, -- 1. PAGADO, 2. DESPACHADO 3. EN CAMINO, 4. ENTREGADO
            updated_at = ?
        where 
            id = ?
    `;

    db.query(
        sql,
        [
            id_delivery,
            'ENTREGADO', // 4. ENTREGADO
            new Date(),
            id_order
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err);
                result(err, null);
            } else {
                result(null, id_order);
            }
        }
    );
}
module.exports = Order;