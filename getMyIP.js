const os = require('os');

const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name in interfaces) {
        for (const net of interfaces[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                console.log(`Interfaz: ${name}, IP: ${net.address}`);
            }
        }
    }
};

module.exports = getLocalIP;