const paymentMethodController = require('../controllers/paymentMethodController');
const passport = require('passport');

module.exports = (app) => {

    // Obtener métodos de pago de un usuario
    app.get('/api/payment-methods/findByUser/:id_user', passport.authenticate('jwt', {session: false}), paymentMethodController.findByUser);

    // Obtener un método de pago por ID
    app.get('/api/payment-methods/findById/:id', passport.authenticate('jwt', {session: false}), paymentMethodController.findById);

    // Crear un nuevo método de pago
    app.post('/api/payment-methods/create', passport.authenticate('jwt', {session: false}), paymentMethodController.create);

    // Eliminar un método de pago
    app.delete('/api/payment-methods/delete/:id', passport.authenticate('jwt', {session: false}), paymentMethodController.delete);

    // Establecer método de pago predeterminado
    app.put('/api/payment-methods/setDefault/:id', passport.authenticate('jwt', {session: false}), paymentMethodController.setDefault);

};
