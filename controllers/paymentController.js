const { MercadoPagoConfig, Payment } = require('mercadopago');

// Configurar credenciales de Mercado Pago
const client = new MercadoPagoConfig({
    accessToken: 'TEST-2505508472442270-111517-9445c2c65a49a88c2e847143f53bd14f-290590431'
});

const payment = new Payment(client);

module.exports = {
    
    async createPayment(req, res) {
        try {
            const { 
                cardToken,
                token, // La app móvil puede enviar 'token' en lugar de 'cardToken'
                email, 
                identification_number,
                total,
                transaction_amount, // La app móvil envía 'transaction_amount'
                description,
                orderId,
                installments,
                issuer_id,
                payment_method_id,
                payer,
                order
            } = req.body;

            console.log('Datos recibidos para pago:', JSON.stringify(req.body, null, 2));

            // Determinar el token correcto
            const paymentToken = token || cardToken;
            
            // Determinar el monto correcto
            const amount = transaction_amount || total;
            
            console.log('Token:', paymentToken);
            console.log('Monto:', amount, 'Tipo:', typeof amount);

            // Validar que los datos requeridos existen
            if (!paymentToken) {
                return res.status(400).json({
                    success: false,
                    message: 'El token de la tarjeta es requerido'
                });
            }

            if (!amount || isNaN(parseFloat(amount))) {
                return res.status(400).json({
                    success: false,
                    message: 'El monto total es requerido y debe ser un número válido',
                    receivedAmount: amount
                });
            }

            const finalAmount = parseFloat(amount);
            
            console.log('Monto final parseado:', finalAmount);

            // MODO SIMULACIÓN - Comentar esto cuando tengas credenciales válidas de Mercado Pago
            console.log('*** PAGO SIMULADO - SIN MERCADO PAGO REAL ***');
            
            // Simular respuesta de pago aprobado
            const simulatedPaymentResponse = {
                id: Date.now(), // ID único basado en timestamp
                status: 'approved',
                status_detail: 'accredited',
                transaction_amount: finalAmount,
                payment_method_id: payment_method_id || 'debvisa'
            };

            console.log('Respuesta simulada de Mercado Pago:', JSON.stringify(simulatedPaymentResponse, null, 2));

            // Si el pago fue aprobado y se envió información de la orden, crear la orden en la BD
            if (simulatedPaymentResponse.status === 'approved' && order) {
                try {
                    console.log('=== Intentando crear orden ===');
                    console.log('Order data:', JSON.stringify(order, null, 2));
                    
                    const Order = require('../models/order');
                    const OrderHasProducts = require('../models/order_has_products');
                    const User = require('../models/user');
                    const Address = require('../models/address');
                    
                    // Obtener datos del cliente y dirección para guardar copia histórica
                    let clientData = null;
                    let addressData = null;
                    
                    if (order.id_client) {
                        clientData = await new Promise((resolve, reject) => {
                            User.findById(order.id_client, (err, user) => {
                                if (err) resolve(null);
                                else resolve(user);
                            });
                        });
                    }
                    
                    if (order.id_address) {
                        addressData = await new Promise((resolve, reject) => {
                            Address.findById(order.id_address, (err, address) => {
                                if (err) resolve(null);
                                else resolve(address);
                            });
                        });
                    }
                    
                    // Crear la orden en la base de datos usando Promise para convertir el callback
                    const newOrderId = await new Promise((resolve, reject) => {
                        Order.create({
                            id_client: order.id_client,
                            id_address: order.id_address,
                            client_name: clientData?.name,
                            client_phone: clientData?.phone,
                            delivery_address: addressData?.address,
                            delivery_neighborhood: addressData?.neighborhood,
                            anotaciones: order.anotaciones,
                            status: 'PAGADO',
                            timestamp: Date.now()
                        }, (err, orderId) => {
                            if (err) reject(err);
                            else resolve(orderId);
                        });
                    });

                    console.log('Orden creada con ID:', newOrderId);

                    // Crear los productos de la orden
                    if (order.products && order.products.length > 0) {
                        for (const product of order.products) {
                            await new Promise((resolve, reject) => {
                                OrderHasProducts.create(
                                    newOrderId,
                                    product.id,
                                    product.quantity,
                                    (err, result) => {
                                        if (err) reject(err);
                                        else resolve(result);
                                    }
                                );
                            });
                        }
                        console.log('Productos de la orden creados');
                    }

                    return res.status(200).json({
                        success: true,
                        message: 'Pago procesado y orden creada correctamente (SIMULADO)',
                        data: {
                            payment: {
                                id: simulatedPaymentResponse.id,
                                status: simulatedPaymentResponse.status,
                                status_detail: simulatedPaymentResponse.status_detail,
                                transaction_amount: simulatedPaymentResponse.transaction_amount,
                                payment_method_id: simulatedPaymentResponse.payment_method_id,
                                simulated: true
                            },
                            order: {
                                id: newOrderId,
                                status: 'PAGADO'
                            }
                        }
                    });
                } catch (orderError) {
                    console.error('Error al crear la orden:', orderError);
                    // El pago se procesó pero hubo error al crear la orden
                    return res.status(200).json({
                        success: true,
                        message: 'Pago procesado correctamente (SIMULADO), pero hubo un error al crear la orden',
                        data: {
                            payment: {
                                id: simulatedPaymentResponse.id,
                                status: simulatedPaymentResponse.status,
                                status_detail: simulatedPaymentResponse.status_detail,
                                transaction_amount: simulatedPaymentResponse.transaction_amount,
                                payment_method_id: simulatedPaymentResponse.payment_method_id,
                                simulated: true
                            },
                            orderError: orderError.message
                        }
                    });
                }
            }

            return res.status(200).json({
                success: true,
                message: 'Pago procesado correctamente (SIMULADO)',
                data: {
                    id: simulatedPaymentResponse.id,
                    status: simulatedPaymentResponse.status,
                    status_detail: simulatedPaymentResponse.status_detail,
                    transaction_amount: simulatedPaymentResponse.transaction_amount,
                    payment_method_id: simulatedPaymentResponse.payment_method_id,
                    simulated: true
                }
            });

        } catch (error) {
            console.error('Error al procesar el pago:', error);
            
            return res.status(500).json({
                success: false,
                message: 'Error al procesar el pago',
                error: error.message,
                details: error.cause || error
            });
        }
    }

};
