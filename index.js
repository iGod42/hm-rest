const SerialPort = require('serialport')
const port = new SerialPort('/dev/serial0')


port.on('readable', function () {
	console.log('Data:', port.read());
});