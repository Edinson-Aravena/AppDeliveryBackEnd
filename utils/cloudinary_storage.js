const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dn7n3ji7l',
    api_key: process.env.CLOUDINARY_API_KEY || '396621555744848',
    api_secret: process.env.CLOUDINARY_API_SECRET || '2LZK64fowO3FqOh9iIBvSu8iXYg'
});

/**
 * Subir archivo a Cloudinary
 * @param {File} file - objeto del archivo
 * @param {string} folder - carpeta donde se guardará (ej: 'users', 'products')
 */
const uploadToCloudinary = (file, folder = 'users') => {
    return new Promise((resolve, reject) => {
        if (!file || !file.buffer) {
            return reject('No file provided');
        }

        // Crear un stream de upload
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'image'
            },
            (error, result) => {
                if (error) {
                    console.log('Error uploading to Cloudinary:', error);
                    reject('Error uploading image to Cloudinary');
                } else {
                    console.log('Image uploaded successfully to Cloudinary:', result.secure_url);
                    resolve(result.secure_url);
                }
            }
        );

        uploadStream.end(file.buffer);
    });
};

module.exports = uploadToCloudinary;
