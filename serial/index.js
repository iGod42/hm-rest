const SerialPort = require('serialport')
const validate = require('./validation')
const {CSV_RECORD_REGEX} = require('./constants')

const SERIAL_BAUD = 38400
const END_OF_LINE = '\n'

const sendMessage = (port, message) =>
	port.write(message, function (err, res) {
		if (err) {
			console.log(err)
			throw err
		}
		console.log(res)
		return res
	})

function Serial () {
	this.port = new SerialPort('/dev/serial0', {
		baudRate: SERIAL_BAUD,
		dataBits: 8,
		stopBits: 1,
		parity: 'none'
	})

	this.handlers = []

	this.subscribe = (fn) => this.handlers.push(fn)

	this.unsubscribe = (fn) => this.handlers = this.handlers.filter(it => it !== fn)

	this.requestConfig = () => sendMessage(this.port, '\n/config\n')

	this.combinedData = ''

	this.port.on('readable', () => {
		this.combinedData += this.port.read().toString('utf8').replace(END_OF_LINE, '')

		let match = CSV_RECORD_REGEX(this.combinedData)
		while (match) {
			if (validate(match[0]))
				this.handlers.forEach(handler => handler(match[0]))

			this.combinedData = this.combinedData.substring(match[0].length + match.index)
			match = CSV_RECORD_REGEX(this.combinedData)
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