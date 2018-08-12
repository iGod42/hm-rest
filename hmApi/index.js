const Serial = require('./serial')

const serial = Serial.getInstance()

module.exports = {
	subscribe: serial.subscribe,
	unsubscribe: serial.unsubscribe,
	requestConfig: serial.write('\n/config\n')
}