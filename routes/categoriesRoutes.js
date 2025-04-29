const categoryController = require('../controllers/categoryController');
const passport = require('passport');

module.exports = (app, upload) => {
    /**
     * @swagger
     * /api/categories/create:
     *   post:
     *     summary: Crear una nueva categoría (con imagen)
     *     tags: [Categories]
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
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Categoría creada exitosamente
     */
    app.post('/api/categories/create', passport.authenticate('jwt', { session: false }), upload.array('image', 1), categoryController.create);

    /**
     * @swagger
     * /api/categories/getAll:
     *   get:
     *     summary: Obtener todas las categorías
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Lista de categorías
     */
    app.get('/api/categories/getAll', passport.authenticate('jwt', { session: false }), categoryController.getAll);

    /**
     * @swagger
     * /api/categories/delete/{id}:
     *   delete:
     *     summary: Eliminar una categoría por ID
     *     tags: [Categories]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Categoría eliminada correctamente
     */
    app.delete('/api/categories/delete/:id', passport.authenticate('jwt', { session: false }), categoryController.delete);

    /**
     * @swagger
     * /api/categories/updateWithImage:
     *   put:
     *     summary: Actualizar una categoría con nueva imagen
     *     tags: [Categories]
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
     *               image:
     *                 type: string
     *                 format: binary
     *     responses:
     *       200:
     *         description: Categoría actualizada exitosamente
     */
    app.put('/api/categories/updateWithImage', passport.authenticate('jwt', { session: false }), upload.array('image', 1), categoryController.updateWithImage);

    /**
     * @swagger
     * /api/categories/update:
     *   put:
     *     summary: Actualizar una categoría sin cambiar imagen
     *     tags: [Categories]
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
     *     responses:
     *       200:
     *         description: Categoría actualizada exitosamente
     */
    app.put('/api/categories/update', passport.authenticate('jwt', { session: false }), categoryController.update);
}
