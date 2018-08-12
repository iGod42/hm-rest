const SerialPort = require('serialport')
const validate = require('./validation')
const {CSV_RECORD_REGEX} = require('./constants')

const SERIAL_BAUD = 38400
const END_OF_LINE = '\n'
const SERIAL_INTERFACE = '/dev/serial0'

const sendMessage = (port, message) =>
	port.write(message, function (err) {
		if (err)
			throw err
	})

function Serial () {
	this.port = new SerialPort(SERIAL_INTERFACE, {baudRate: SERIAL_BAUD})

	this.handlers = []

	this.subscribe = (fn) => this.handlers.push(fn)

	this.unsubscribe = (fn) => this.handlers = this.handlers.filter(it => it !== fn)

	this.requestConfig = () => sendMessage(this.port, '\n/config\n')

	this.combinedData = ''

	this.port.on('readable', () => {

		// lines might be split so append whatever is coming to the total ignoring newlines
		this.combinedData += this.port.read().toString('utf8').replace(END_OF_LINE, '')

		// regex matches for a complete CSV record
		// complete means starting with $ and ending with an asterisk + a two digit hex checksum
		let match = CSV_RECORD_REGEX.exec(this.combinedData)

		while (match) {
			// additional validation to ensure checksum is correct
			if (validate(match[0]))
				this.handlers.forEach(handler => handler(match[0]))
			// todo: error events might be interesting for subscribers?

			// trim the current record
			this.combinedData = this.combinedData.substring(match[0].length + match.index)

			// retry in unlikely case that there are two records between values received
			match = CSV_RECORD_REGEX.exec(this.combinedData)
		}
	})
}

// Singleton to prevent issues with multiple open streams
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