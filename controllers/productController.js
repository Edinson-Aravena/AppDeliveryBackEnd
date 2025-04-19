const Product = require('../models/product');
const storage = require('../utils/cloud_storage');
const asyncForEach = require('../utils/async_foreach')

module.exports = {

    // async getAll(req, res) {
    //     Category.getAll((err, data) => {
    //         if (err) {
    //             return res.status(501).json({
    //                 success: false,
    //                 message: 'Hubo un error con la consulta de categorias',
    //                 error: err
    //             })
    //         }
    //         return res.status(201).json(data)
    //     })
    // },
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
    // async updateWithImage(req, res) {
    //     const category = JSON.parse(req.body.category);
    //     const files = req.files;

    //     if (files) {
    //         const path = `image_${Date.now()}`;
    //         const url = await storage(files[0], path); // upload image

    //         if (url) {
    //             category.image = url;
    //         }
    //     }
    //     Category.update(category, (err, id) => {
    //         if (err) {
    //             return res.status(501).json({
    //                 success: false,
    //                 message: 'Hubo un error con la actualizacion de la categoria',
    //                 error: err
    //             })
    //         }

    //         return res.status(201).json({
    //             success: true,
    //             message: 'La categoria se actualizo correctamente',
    //             data:  `${id}`
    //         })
    //     })
    // },
    // async update(req, res) {
    //     const category = req.body;
    //     console.log("Category", category);
    //     Category.update(category, (err, id) => {
    //         if (err) {
    //             return res.status(501).json({
    //                 success: false,
    //                 message: 'Hubo un error con la actualizacion de la categoria',
    //                 error: err
    //             })
    //         }

    //         return res.status(201).json({
    //             success: true,
    //             message: 'La categoria se actualizo correctamente',
    //             data:  `${id}`
    //         })
    //     })
    // },
    // async delete(req, res) {
    //     const id = req.params.id;
    //     Category.delete(id, (err, data) => {
    //         if (err) {
    //             return res.status(501).json({
    //                 success: false,
    //                 message: 'Hubo un error con la eliminacion de la categoria',
    //                 error: err
    //             })
    //         }
    //         return res.status(201).json({
    //             success: true,
    //             message: 'La categoria se elimino correctamente',
    //             data: `${id}`
    //         })
    //     })
    // },
}