const SerialPort = require('serialport')
const validateChecksum = require('./validateChecksum')

const CSV_RECORD_REGEX = /\$.*\*[0-9A-F]{2}/

class Serial extends EventEmitter {

	constructor (serialInterface, baudRate = 38400) {
		super()

		let port = new SerialPort(serialInterface, {baudRate: baudRate})

		this.write = (message) => port.write(message, function (err) {
			if (err)
				throw err
		})

		let combinedData = ''

		port.on('readable', () => {

			// lines might be split so append whatever is coming to the total ignoring newlines
			combinedData += port.read().toString('utf8').replace('\n', '')

			// regex matches for a complete CSV record
			// complete means starting with $ and ending with an asterisk + a two digit hex checksum
			let match = CSV_RECORD_REGEX.exec(combinedData)

			while (match) {
				// additional validation to ensure checksum is correct
				if (validateChecksum(match[0]))
					this.emit('dataReceived', match[0])
				// todo: error events might be interesting for subscribers?

				// trim the current record
				combinedData = combinedData.substring(match[0].length + match.index)

				// retry in unlikely case that there are two records between values received
				match = CSV_RECORD_REGEX.exec(combinedData)
			}
		})
	}
}

// Singleton to prevent issues with multiple open streams
module.exports = (() => {
	let instance

	const createInstance = () => new Serial(process.env.SERIAL_IF || '/dev/serial0', process.env.BAUD_RATE)

	return {
		getInstance: () => {
			if (!instance) {
				instance = createInstance()
			}
			return instance
		}
	}
})()