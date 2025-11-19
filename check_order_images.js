const db = require('./config/config');

const sql = `
select 
    convert(O.id, char) as id,
    O.status,
    json_arrayagg(
        json_object(
            'id', convert(P.id, char),
            'name', P.name,
            'image1', COALESCE(P.image1, P.image),
            'price', P.price,
            'quantity', OHP.quantity
        )
    ) as products
from
    orders as O
inner join
    orders_has_products as OHP
on
    OHP.id_order = O.id
inner join
    products as P
on
    P.id = OHP.id_product
where 
    O.status = 'DESPACHADO'
group by
    O.id
LIMIT 1;
`;

db.query(sql, (err, data) => {
    if (err) {
        console.log('Error:', err);
    } else {
        console.log('Resultado:');
        console.log(JSON.stringify(data, null, 2));
    }
    db.end();
});
