const Order = require('../models/order');
const OrderHasProduct = require('../models/order_has_products');

module.exports = {

    findByStatus(req, res) {
        const status = req.params.status;

        Order.findByStatus(status, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al obtener las ordenes',
                    error: err
                });
            }

            return res.status(201).json(data);
        });
    },
    async create(req, res) {
        const order = req.body;

        Order.create(order, async (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la creación de la orden',
                    error: err
                })
            }

            for (const product of order.products) {
                await OrderHasProduct.create(
                    id,
                    product.id,
                    product.quantity,
                    (err, id) => {
                        if (err) {
                            return res.status(501).json({
                                success: false,
                                message: 'Hubo un error al agregar productos a la orden',
                                error: err
                            })
                        }
                    }
                )
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se creo correctamente',
                data: `${id}`
            })
        })
    }
}