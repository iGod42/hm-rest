const Serial = require('./serial')

const serial = Serial.getInstance()

const requestSerialUrl = (url) => () => serial.write(`\n${url}\n`)

module.exports = {
	subscribe: serial.subscribe,
	unsubscribe: serial.unsubscribe,
	requestConfig: requestSerialUrl('/config')
}