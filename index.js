const SerialPort = require('serialport')
const port = new SerialPort('/dev/serial0')

port.on('open', function() {
	console.log('port opened')
})

port.on('close', function() {
	console.log('port opened')
})
port.on('error', function() {
	console.log('port opened')
})


port.on('readable', function () {
	console.log('Data:', port.read());
});