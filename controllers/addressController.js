const Address = require('../models/address');
const storage = require('../utils/cloud_storage');

module.exports = {


    async create(req, res) {
        const address = req.body;


        Address.create(address, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la creación de la dirección',
                    error: err
                })
            }

            return res.status(201).json({
                success: true,
                message: 'La dirección se creo correctamente',
                data: `${id}`
            })
        })
    },
}