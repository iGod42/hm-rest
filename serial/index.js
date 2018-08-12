const SerialPort = require('serialport')
const validate = require('./validation')

const END_OF_LINE = '\n'

function Serial () {
	this.port = new SerialPort('/dev/serial0', {baudRate: 38400})
	this.combinedData = ''

	this.handlers = []

	this.subscribe = (fn) => this.handlers.push(fn)

	this.unsubscribe = (fn) => this.handlers = this.handlers.filter(it => it !== fn)

	this.port.on('readable', () => {
		this.combinedData += this.port.read().toString('utf8')

		if (this.combinedData.indexOf(END_OF_LINE) > 0) {
			if (validate(this.combinedData))
				this.handlers.forEach(handler => handler(this.combinedData))
			this.combinedData = ''
		}

	})
}

module.exports = (() => {
	let instance

	const createInstance = () => new Serial()

	return {
		getInstance: () => {
			if (!instance) {
				instance = createInstance()
			}
			return instance
		}
	}
})()