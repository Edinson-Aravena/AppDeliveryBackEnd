const User = require('../models/user')
const Rol = require('../models/rol')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const storage = require('../utils/cloud_storage');
const { use } = require('passport');

module.exports = {

    login(req, res) {
        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async (err, myUser) => {
            //console.log('El usaurio:', myUser)
            //console.log('error:', err)

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error with user registration',
                    error: err
                })
            }
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'Email not found',
                })
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({
                    id: myUser.id,
                    email: myUser.email
                }, keys.secretOrKey, {});

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                }

                return res.status(200).json({
                    success: true,
                    message: 'Authenticated User',
                    data: data//id new user register
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'Incorrect Password',
                })
            }
        })
    },
    register(req, res) {
        const user = req.body;
        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error with user registration',
                    error: err
                })
            }

            return res.status(200).json({
                success: true,
                message: 'User registration was successful',
                data: data//id new user register
            })
        })
    },
    async registerWithImage(req, res) {
        const user = JSON.parse(req.body.user);
        const files = req.files;

        if (files) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path); // upload image

            if (url) {
                user.image = url;
            }
        }
        User.create(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'There was an error with user registration',
                    error: err
                })
            }

            user.id = `${data}`;

            const token = jwt.sign({ id: user.id, email: user.email }, keys.secretOrKey, {});
            user.session_token = `JWT ${token}`;

            Rol.create(user.id, 3, (err, data) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con el registro del rol de usuario',
                        error: err
                    })
                }

                return res.status(201).json({
                    success: true,
                    message: 'El registro se realizo correctamente',
                    data: user
                })
            });
        })
    },

    async updateWithImage(req, res) {
        const user = JSON.parse(req.body.user);
        const files = req.files;

        if (files) {
            const path = `image_${Date.now()}`;
            const url = await storage(files[0], path); // upload image

            if (url) {
                user.image = url;
            }
        }
        User.update(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un erro con la actualizacion del usuario',
                    error: err
                })
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario se actualizo correctamente',
                data: user
            })
        })
    },

    async updateWithOutImage(req, res) {
        const user = req.body;

        User.updateWithOutImage(user, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un erro con la actualizacion del usuario',
                    error: err
                })
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario se actualizo correctamente',
                data: user
            })
        })
    }
}