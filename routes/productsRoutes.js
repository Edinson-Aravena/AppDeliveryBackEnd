const productController = require('../controllers/productController');
const passport = require('passport');

module.exports = (app, upload) => {
    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('image', 3), productController.create);
    // app.get('/api/categories/getAll', passport.authenticate('jwt', { session: false }), categoryController.getAll);
    // app.delete('/api/categories/delete/:id', passport.authenticate('jwt', { session: false }), categoryController.delete);
    // app.put('/api/categories/updateWithImage', passport.authenticate('jwt', { session: false }), upload.array('image', 1), categoryController.updateWithImage);
    // app.put('/api/categories/update', passport.authenticate('jwt', { session: false }), categoryController.update);
}