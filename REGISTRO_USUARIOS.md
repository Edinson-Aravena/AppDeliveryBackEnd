# 📱 Sistema de Registro de Usuarios - App Móvil

## ✅ Características Implementadas

### 🎯 Registro de Clientes
- ✅ Formulario de registro completo en la app móvil
- ✅ Solo permite registrar usuarios con rol **CLIENTE**
- ✅ Imagen de perfil **OPCIONAL**
- ✅ Avatar automático generado si no se selecciona imagen

### 📋 Campos del Formulario

#### Campos Obligatorios:
- **Nombre** - Nombre del usuario
- **Apellidos** - Apellidos del usuario
- **Correo electrónico** - Email único en el sistema
- **Teléfono** - Número de teléfono único
- **Contraseña** - Mínimo de seguridad
- **Confirmar Contraseña** - Debe coincidir con la contraseña

#### Campos Opcionales:
- **Imagen de Perfil** - Puede seleccionar desde galería o tomar foto
  - Si NO se selecciona: Se genera avatar automático con las iniciales del usuario

## 🔐 Proceso de Registro

1. Usuario completa el formulario
2. Sistema valida todos los campos
3. Si NO hay imagen: Se genera avatar con iniciales (ejemplo: Juan Pérez → "JP")
4. Se crea el usuario en la base de datos
5. Se asigna automáticamente el rol **CLIENTE (ID: 3)**
6. Se genera token JWT de autenticación
7. Usuario queda automáticamente logueado
8. Redirección a la vista de Cliente

## 🖼️ Sistema de Imágenes

### Con Imagen Seleccionada:
```
- Usuario selecciona imagen desde galería o cámara
- Imagen se sube al servidor
- URL de la imagen se guarda en el perfil
```

### Sin Imagen (Por Defecto):
```
- Sistema genera avatar automáticamente
- Avatar muestra iniciales del usuario
- Fondo de color aleatorio
- URL: https://ui-avatars.com/api/?name=Juan+Perez&size=200&background=random
```

## 📊 Endpoints Backend

### POST `/api/users/create`
Crea un nuevo usuario cliente

**Request Body:**
```json
{
  "name": "Juan",
  "lastname": "Pérez",
  "email": "juan@example.com",
  "phone": "+56912345678",
  "password": "password123",
  "image": "" // Opcional, si está vacío usa avatar automático
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuario registrado correctamente",
  "data": {
    "id": "1",
    "name": "Juan",
    "lastname": "Pérez",
    "email": "juan@example.com",
    "phone": "+56912345678",
    "image": "https://ui-avatars.com/api/?name=Juan+Perez&size=200&background=random",
    "session_token": "JWT eyJhbGc...",
    "roles": [
      {
        "id": "3",
        "name": "CLIENTE",
        "image": "...",
        "route": "ClientTabsNavigator"
      }
    ]
  }
}
```

### POST `/api/users/createWithImage`
Crea usuario con imagen subida

**Request:** Multipart/form-data
- `user`: JSON con datos del usuario
- `image`: Archivo de imagen

## 🔄 Flujo de Navegación

```
RegisterScreen
    ↓ (registro exitoso)
    ↓
LoginScreen (guardado de sesión)
    ↓
ClientBottomTabsNavigator (vista cliente)
```

## 🛡️ Validaciones

- ✅ Email único en el sistema
- ✅ Teléfono único en el sistema
- ✅ Contraseñas deben coincidir
- ✅ Todos los campos requeridos completados
- ✅ Email en formato válido
- ✅ Contraseña hasheada con bcrypt

## 📝 Notas Importantes

1. **Rol Automático**: Todos los registros desde la app móvil son **CLIENTE**
2. **Imagen Opcional**: Ya no es obligatorio seleccionar una imagen
3. **Avatar Automático**: Se genera con las iniciales del nombre y apellido
4. **Login Automático**: Después del registro, el usuario queda autenticado
5. **Token JWT**: Se incluye en la respuesta para futuras peticiones

## 🚀 Uso

### Desde la App Móvil:
1. Abrir app
2. Click en "Registrate"
3. Completar formulario
4. (Opcional) Seleccionar imagen
5. Click en "REGISTRARSE"
6. ✅ Usuario creado y logueado automáticamente

### Credenciales de Prueba:
```
Email: cliente@test.com
Password: 123456
Rol: CLIENTE
```

## 🔧 Archivos Modificados

### Frontend (React Native):
- `RegisterScreen.tsx` - Texto "imagen opcional"
- `ViewModel.tsx` - Lógica de registro con/sin imagen

### Backend (Node.js):
- `userController.js` - Endpoint `/create` con avatar automático
- `RegisterAuth.tsx` - UseCase sin imagen
- `RegisterWithImageAuth.tsx` - UseCase con imagen

---

**Versión:** 1.0.0  
**Fecha:** 16 de Noviembre 2025
