const orderController = require('../controllers/OrderController');
const passport = require('passport');

module.exports = (app) => {
    app.post('/api/orders/create', passport.authenticate('jwt', { session: false }), orderController.create);
    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', { session: false }), orderController.findByStatus);
    app.get('/api/orders/findByDeliveryAndStatus/:id_delivery/:status', passport.authenticate('jwt', { session: false }), orderController.findByDeliveryAndStatus);
    app.get('/api/orders/findByClientAndStatus/:id_client/:status', passport.authenticate('jwt', { session: false }), orderController.findByClientAndStatus);
    app.put('/api/orders/updateToDispatched', passport.authenticate('jwt', { session: false }), orderController.updateToDispatched);
    app.put('/api/orders/updateToOnTheWay', passport.authenticate('jwt', { session: false }), orderController.updateToOnTheWay);
    app.put('/api/orders/updateToDelivered', passport.authenticate('jwt', { session: false }), orderController.updateToDelivered);
}