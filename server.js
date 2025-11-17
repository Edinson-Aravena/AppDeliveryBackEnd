const express = require('express');
const app = express();

const http = require('http')
const server = http.createServer(app);

const logger = require('morgan');
const cors = require('cors');
const passport = require('passport')

const multer = require('multer')

const myIP = require('./getMyIP')

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');


/*
 * Import routes
*/
const usersRoutes = require('./routes/userRoutes')
const categoriesRoutes = require('./routes/categoriesRoutes')
const productsRoutes = require('./routes/productsRoutes')
const addressRoutes = require('./routes/addressRoutes')
const orderRoutes = require('./routes/orderRoutes')
const paymentRoutes = require('./routes/paymentRoutes')
const paymentMethodRoutes = require('./routes/paymentMethodRoutes')

const port = process.env.PORT || 3001;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))

// Configuración de CORS para permitir peticiones del frontend Next.js
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port', port);

const upload = multer({
    storage: multer.memoryStorage()
})

// Swagger Config
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'API Delivery',
        version: '1.0.0',
        description: 'Documentación de la API Delivery',
    },
    servers: [
        {
            url: `http://${myIP}:${port}`, 
            description: 'Servidor de desarrollo',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};

const options = {
    swaggerDefinition,
    apis: ['./routes/*.js'], // Tus rutas están en la carpeta routes
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*
 * Route call
*/
usersRoutes(app, upload);
categoriesRoutes(app, upload);
productsRoutes(app, upload);
addressRoutes(app)
orderRoutes(app);
paymentRoutes(app);
paymentMethodRoutes(app);


server.listen(port, myIP || 'localhost', function () {
    console.log('App delivery Iniciada corriendo el el puerto ' + port)
})

app.get('/', (req, res) => {
    res.send('Ruta raiz del backend')
})

//Errors
app.use((err, req, res, next) => {
    console.log(err)
    res.status(err.status || 500).send(err.stack);
})