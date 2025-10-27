-- Limpiar categorías existentes y reinsertar sin emojis
USE delivery_app;

-- Eliminar categorías existentes (esto también eliminará productos relacionados)
DELETE FROM categories;

-- Insertar categorías sin emojis
INSERT INTO categories (name, description, slug, icon) VALUES
('Café', 'Bebidas calientes de café', 'cafe', 'cafe'),
('Desayuno', 'Opciones para el desayuno', 'desayuno', 'desayuno'),
('Comida', 'Platillos principales', 'comida', 'comida'),
('Postres', 'Dulces y postres', 'postres', 'postres'),
('Bebidas', 'Bebidas frías y refrescos', 'bebidas', 'bebidas'),
('Entradas', 'Aperitivos y entradas', 'entradas', 'entradas');

SELECT 'Categorías actualizadas correctamente!' as Mensaje;
SELECT * FROM categories;
