const productController = require('../controllers/productController');
const passport = require('passport');

module.exports = (app, upload) => {
    /**
     * @swagger
     * /api/products/create:
     *   post:
     *     summary: Crear un nuevo producto (puede subir hasta 3 imágenes)
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               price:
     *                 type: number
     *               id_category:
     *                 type: string
     *               image:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *     responses:
     *       200:
     *         description: Producto creado exitosamente
     */
    app.post('/api/products/create', passport.authenticate('jwt', { session: false }), upload.array('image', 3), productController.create);

    /**
     * @swagger
     * /api/products/findByCategory/{id_category}:
     *   get:
     *     summary: Buscar productos por categoría
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id_category
     *         required: true
     *         schema:
     *           type: string
     *         description: ID de la categoría
     *     responses:
     *       200:
     *         description: Productos encontrados
     */
    app.get('/api/products/findByCategory/:id_category', passport.authenticate('jwt', { session: false }), productController.findByCategory);

    /**
     * @swagger
     * /api/products/delete:
     *   delete:
     *     summary: Eliminar un producto
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *     responses:
     *       200:
     *         description: Producto eliminado correctamente
     */
    app.delete('/api/products/delete', passport.authenticate('jwt', { session: false }), productController.delete);

    /**
     * @swagger
     * /api/products/updateWithImage:
     *   put:
     *     summary: Actualizar producto con nuevas imágenes
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         multipart/form-data:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               price:
     *                 type: number
     *               id_category:
     *                 type: string
     *               image:
     *                 type: array
     *                 items:
     *                   type: string
     *                   format: binary
     *     responses:
     *       200:
     *         description: Producto actualizado exitosamente
     */
    app.put('/api/products/updateWithImage', passport.authenticate('jwt', { session: false }), upload.array('image', 3), productController.updateWithImage);

    /**
     * @swagger
     * /api/products/update:
     *   put:
     *     summary: Actualizar producto (sin cambiar imágenes)
     *     tags: [Products]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               id:
     *                 type: string
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               price:
     *                 type: number
     *               id_category:
     *                 type: string
     *     responses:
     *       200:
     *         description: Producto actualizado exitosamente
     */
    app.put('/api/products/update', passport.authenticate('jwt', { session: false }), productController.update);
}
