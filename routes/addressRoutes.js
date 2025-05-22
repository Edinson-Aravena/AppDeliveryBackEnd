const addressController = require('../controllers/addressController');
const passport = require('passport');

module.exports = (app) => {
    
    app.post('/api/address/create', passport.authenticate('jwt', { session: false }), addressController.create);

}
