const PaymentMethod = require('../models/payment_method');

module.exports = {
    async create(req, res) {
        try {
            const paymentMethod = req.body;
            
            const data = await PaymentMethod.create(paymentMethod);

            return res.status(201).json({
                success: true,
                message: 'El método de pago se guardó correctamente',
                data: data[0].insertId
            });

        } catch (error) {
            console.log('Error:', error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al guardar el método de pago',
                error: error
            });
        }
    },

    async findByUser(req, res) {
        try {
            const id_user = req.params.id_user;

            const data = await PaymentMethod.findByUser(id_user);

            return res.status(200).json(data[0]);

        } catch (error) {
            console.log('Error:', error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al obtener los métodos de pago',
                error: error
            });
        }
    },

    async findById(req, res) {
        try {
            const id = req.params.id;

            const data = await PaymentMethod.findById(id);

            if (data[0].length > 0) {
                return res.status(200).json({
                    success: true,
                    data: data[0][0]
                });
            } else {
                return res.status(404).json({
                    success: false,
                    message: 'Método de pago no encontrado'
                });
            }

        } catch (error) {
            console.log('Error:', error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al obtener el método de pago',
                error: error
            });
        }
    },

    async delete(req, res) {
        try {
            const id = req.params.id;

            await PaymentMethod.delete(id);

            return res.status(200).json({
                success: true,
                message: 'El método de pago se eliminó correctamente'
            });

        } catch (error) {
            console.log('Error:', error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al eliminar el método de pago',
                error: error
            });
        }
    },

    async setDefault(req, res) {
        try {
            const id = req.params.id;
            const id_user = req.body.id_user;

            await PaymentMethod.setDefault(id, id_user);

            return res.status(200).json({
                success: true,
                message: 'Método de pago predeterminado actualizado'
            });

        } catch (error) {
            console.log('Error:', error);
            return res.status(501).json({
                success: false,
                message: 'Hubo un error al actualizar el método de pago predeterminado',
                error: error
            });
        }
    }
};
