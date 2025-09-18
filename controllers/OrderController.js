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
    findByDeliveryAndStatus(req, res) {
        const id_delivery = req.params.id_delivery;
        const status = req.params.status;

        Order.findByDeliveryAndStatus(id_delivery, status, (err, data) => {
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
    findByClientAndStatus(req, res) {
        const id_client = req.params.id_client;
        const status = req.params.status;

        Order.findByClientAndStatus(id_client, status, (err, data) => {
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
    },
    async updateToDispatched(req, res) {

        const order = req.body;

        //console.log('Actualizando orden a DESPACHADO', order.id_delivery);

        Order.updateToDispatched(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al actualizar el estado de la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente',
                data: `${id_order}`
            });
        })
    },
    async updateToOnTheWay(req, res) {
        const order = req.body;
        //console.log('Actualizando orden a EN CAMINO', order.id_delivery);
        Order.updateToOnTheWay(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al actualizar el estado de la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente',
                data: `${id_order}`
            });
        })
    },
    async updateToDelivered(req, res) {
        const order = req.body;
        //console.log('Actualizando orden a EN CAMINO', order.id_delivery);
        Order.updateToDelivered(order.id, order.id_delivery, (err, id_order) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al actualizar el estado de la orden',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'La orden se actualizó correctamente',
                data: `${id_order}`
            });
        })
    }
}