const db = require('../config/config');
const bcrypt = require('bcryptjs')

const User = {};

User.findById = (id, result) => {
    const sql = `
        select
            U.id, 
            U.email,
            U.name,
            U.lastname,
            U.image,
            U.phone,
            U.password,
            json_arrayagg(
				json_object(
					'id', CONVERT(R.id, char),
                    'name', R.name,
                    'image', R.image,
                    'route', R.route
                )
            ) as roles
        from
            users as U
		inner join 
			user_has_roles as UHR
		ON
			UHR.id_user= u.id
		inner join 
			roles as R
		on
			UHR.id_rol = r.id
        where
            U.id = ?
		group by
			U.id
    `

    db.query(
        sql,
        [id],
        (err, user) => {
            if (err) {
                //console.log('Error:' + user)
                result(err, null)
            } else {
                //console.log('User Obtain:', user[0])
                result(null, user[0])
            }
        }
    )
}

User.findByEmail = (emailOrUsername, result) => {
    const sql = `
        select
            U.id, 
            U.email,
            U.username,
            U.name,
            U.lastname,
            U.image,
            U.phone,
            U.password,
            U.role,
            json_arrayagg(
				json_object(
					'id', CONVERT(R.id, char),
                    'name', R.name,
                    'image', R.image,
                    'route', R.route
                )
            ) as roles
        from
            users as U
		left join 
			user_has_roles as UHR
		ON
			UHR.id_user= u.id
		left join 
			roles as R
		on
			UHR.id_rol = r.id
        where
            U.email = ? OR U.username = ?
		group by
			U.id
    `

    db.query(
        sql,
        [emailOrUsername, emailOrUsername],
        (err, user) => {
            if (err) {
                console.log('Error:' + user)
                result(err, null)
            } else {
                console.log('User Obtain:', user[0])
                result(null, user[0])
            }
        }
    )
}

User.findeDeliveryMen = (result) => {
    const sql = `
        select
            U.id, 
            U.email,
            U.name,
            U.lastname,
            U.image,
            U.phone
        from
            users as U
        inner join
            user_has_roles as UHR
        on
            UHR.id_user = U.id
        inner join
            roles as R
        on
            UHR.id_rol = R.id
        where
            R.id= 2
        `;

    db.query(
        sql,
        (err, data) => {
            if (err) {
                console.log('Error:' + err)
                result(err, null)
            } else {
                result(null, data)
            }
        }
    )
}
User.create = async (user, result) => {

    const hash = await bcrypt.hash(user.password, 10)
    const sql = `
        INSERT INTO
            users(
                email,
                username,
                name,
                lastname,
                phone,
                image,
                password,
                role,
                created_at,
                updated_at
            )
        VALUES(?,?,?,?,?,?,?,?,?,?)
    `

    db.query(
        sql,
        [
            user.email || null,
            user.username || null,
            user.name,
            user.lastname || null,
            user.phone || null,
            user.image || null,
            hash,
            user.role || 'WAITER',
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err)
                result(err, null)
            } else {
                console.log('ID new user:', res.insertId)
                result(null, res.insertId)
            }
        }
    )
}

User.update = (user, result) => {
    const sql = `
        update
            users
        set
            name = ?,
            lastName = ?,
            phone = ?,
            image = ?,
            updated_at = ?
        where
            id = ? 
    `;
    //no recuerdo si era id = ?, cambiar o revisar si hay error
    db.query(
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            user.image,
            new Date(),
            user.id,
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err)
                result(err, null)
            } else {
                console.log('updated user', user.id)
                result(null, user.id)
            }
        }
    )

}

User.updateWithOutImage = (user, result) => {
    const sql = `
        update
            users
        set
            name = ?,
            lastName = ?,
            phone = ?,
            updated_at = ?
        where
            id = ? 
    `;

    db.query(
        sql,
        [
            user.name,
            user.lastname,
            user.phone,
            new Date(),
            user.id,
        ],
        (err, res) => {
            if (err) {
                console.log('Error:' + err)
                result(err, null)
            } else {
                console.log('updated user', user.id)
                result(null, user.id)
            }
        }
    )

}

module.exports = User;