-- Script para insertar solo categorías
USE delivery_app;

-- Insertar categorías
INSERT INTO categories (name, description, slug, icon) VALUES
('Café', 'Bebidas calientes de café', 'cafe', 'cafe'),
('Desayuno', 'Opciones para el desayuno', 'desayuno', 'desayuno'),
('Comida', 'Platillos principales', 'comida', 'comida'),
('Postres', 'Dulces y postres', 'postres', 'postres'),
('Bebidas', 'Bebidas frías y refrescos', 'bebidas', 'bebidas'),
('Entradas', 'Aperitivos y entradas', 'entradas', 'entradas')
ON DUPLICATE KEY UPDATE name = VALUES(name);

SELECT 'Categorías insertadas correctamente!' as Mensaje;
SELECT * FROM categories;
