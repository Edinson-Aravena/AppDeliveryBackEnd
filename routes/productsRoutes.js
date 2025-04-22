const productController = require('../controllers/productController');
const passport = require('passport');

module.exports = (app, upload) => {
    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('image', 3), productController.create);
    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', { session: false }), productController.findByCategory);
    app.delete('/api/products/delete', passport.authenticate('jwt', { session: false }), productController.delete);
    app.put('/api/products/updateWithImage', passport.authenticate('jwt', { session: false }), upload.array('image', 3), productController.updateWithImage);
    app.put('/api/products/update', passport.authenticate('jwt', { session: false }), productController.update);
}