const orderController = require('../controllers/OrderController');
const passport = require('passport');

module.exports = (app) => {
    app.post('/api/orders/create', passport.authenticate('jwt', { session: false }), orderController.create);
    app.get('/api/orders/findByStatus/:status', passport.authenticate('jwt', { session: false }), orderController.findByStatus);
}