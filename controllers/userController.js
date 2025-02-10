const User = require('../models/user')

module.exports = {
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
    }
}