const User = require('../models/user')
const Rol = require('../models/rol')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

const storage = require('../utils/cloud_storage');
const { use } = require('passport');

module.exports = {

    login(req, res) {
        const emailOrUsername = req.body.email || req.body.username;
        const password = req.body.password;

        User.findByEmail(emailOrUsername, async (err, myUser) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al buscar el usuario',
                    error: err
                })
            }
            if (!myUser) {
                return res.status(401).json({
                    success: false,
                    message: 'El usuario no existe',
                })
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({
                    id: myUser.id,
                    email: myUser.email,
                    username: myUser.username
                }, keys.secretOrKey, {});

                const data = {
                    id: myUser.id,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    username: myUser.username,
                    phone: myUser.phone,
                    image: myUser.image,
                    role: myUser.role,
                    session_token: `JWT ${token}`,
                    roles: myUser.roles
                }

                return res.status(200).json({
                    success: true,
                    message: 'Usuario logueado correctamente',
                    data: data
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'La contraseña es incorrecta',
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
                    message: 'hubo un error con el registro del usuario',
                    error: err
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Usuario registrado correctamente',
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
                    message: 'Hubo un error con el registro del usuario',
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
    },

    async findeDeliveryMen(req, res) {
        User.findeDeliveryMen((err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al buscar los repartidores',
                    error: err
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Repartidores encontrados correctamente',
                data: data
            })
        })
    }
}