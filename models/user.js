const db = require('../config/config');
const bcrypt = require('bcryptjs')

const User = {};

User.findById = (id, result) =>{
    const sql = `
         select
            U.id, 
            U.email,
            U.name,
            U.lastname,
            U.image,
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
            id = ?
		group by
			U.id
    `

    db.query(
        sql,
        [id],
        (err, user) => {
            if(err){
                console.log('Error:'+ user)
                result(err, null)
            }else{
                console.log('User Obtain:', user[0])
                result(null, user[0])
            }
        }
    )
}

User.findByEmail = (email, result) =>{
    const sql = `
        select
            U.id, 
            U.email,
            U.name,
            U.lastname,
            U.image,
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
            email = ?
		group by
			U.id
    `

    db.query(
        sql,
        [email],
        (err, user) => {
            if(err){
                console.log('Error:'+ user)
                result(err, null)
            }else{
                console.log('User Obtain:', user[0])
                result(null, user[0])
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
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )
        VALUES(?,?,?,?,?,?,?,?)
    `

    db.query(
        sql, 
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(),
            new Date(),
        ],
        (err, res) => {
            if(err){
                console.log('Error:'+ err)
                result(err, null)
            }else{
                console.log('ID new user:', res.insertId)
                result(null, res.insertId)
            }
        }
    )
}

module.exports = User;