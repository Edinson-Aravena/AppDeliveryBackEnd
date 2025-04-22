const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach')

module.exports = {

    async findByCategory(req, res) {
        const id_category = req.params.id_category;

        Product.findByCategory(id_category, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al listar los productos',
                    error: err
                })
            }
            return res.status(201).json(data)
        })
    },
    async create(req, res) {
        const product = JSON.parse(req.body.product);
        const files = req.files;
        let inserts = 0;

        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con la creación del producto, no tiene imagenes',
                error: err
            })
        } else {
            console.log(files)
            Product.create(product, (err, id_product) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con la creación del producto',
                        error: err
                    })
                }
                product.id = id_product;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;

                        const url = await storage(file, path); // upload image
                        
                        if (url != undefined && url != null) {
                            if (inserts == 0) {
                                product.image1 = url;
                            } else if (inserts == 1) {
                                product.image2 = url;
                            } else if (inserts == 2) {
                                product.image3 = url;
                            }
                        }

                        await Product.update(product, (err, data) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Hubo un error con la creación del producto',
                                    error: err
                                })
                            }

                            inserts++;

                            if (inserts == files.length) {
                                return res.status(201).json({
                                    success: true,
                                    message: 'El producto se creo correctamente',
                                    data: data
                                })
                            }
                        });
                    })
                }

                start();
            })
        }
    },

    async update(req, res) {
        const product = req.body

        Product.update(product, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al actualizar el producto',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: 'El producto se actualizo correctamente',
                data: data
            })
        })
    },
    async updateWithImage(req, res) {
        const product = JSON.parse(req.body.product);
        const files = req.files;
        let inserts = 0;

        if (files.length === 0) {
            return res.status(501).json({
                success: false,
                message: 'Hubo un error con la actualización del producto, no tiene imagenes',
                error: err
            })
        } else {
            Product.update(product, (err, id_product) => {
                if (err) {
                    return res.status(501).json({
                        success: false,
                        message: 'Hubo un error con la actualización del producto',
                        error: err
                    })
                }
                product.id = id_product;
                const start = async () => {
                    await asyncForEach(files, async (file) => {
                        const path = `image_${Date.now()}`;

                        const url = await storage(file, path); // upload image
                        
                        if (url != undefined && url != null) {
                            if (inserts == 0) {
                                product.image1 = url;
                            } else if (inserts == 1) {
                                product.image2 = url;
                            } else if (inserts == 2) {
                                product.image3 = url;
                            }
                        }

                        await Product.update(product, (err, data) => {
                            if (err) {
                                return res.status(501).json({
                                    success: false,
                                    message: 'Hubo un error con la actualización del producto',
                                    error: err
                                })
                            }

                            inserts++;

                            if (inserts == files.length) {
                                return res.status(201).json({
                                    success: true,
                                    message: 'El producto se actualizó correctamente',
                                    data: data
                                })
                            }
                        });
                    })
                }

                start();
            })
        }
    },
    async delete(req, res) {
        const id = req.params.id;

        Product.delete(id, (err, id) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al eliminar el producto',
                    error: err
                })
            }
            return res.status(201).json({
                success: true,
                message: 'El producto se elimino correctamente',
                data: `${id}`
            })
        })
    }
    
}