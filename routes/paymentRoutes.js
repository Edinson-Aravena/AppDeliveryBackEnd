const PaymentController = require('../controllers/paymentController');

module.exports = (app) => {
    
    // Crear pago
    app.post('/api/payment/create', PaymentController.createPayment);

};
