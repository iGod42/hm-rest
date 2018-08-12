const SerialPort = require('serialport')
const validate = require('./validation')

const END_OF_LINE = '\n'

function Serial () {
	this.port = new SerialPort('/dev/serial0', {baudRate: 38400})
	this.combinedData = ''

	this.port.on('readable', () => {
		const theData = port.read()
		const stringData = theData.toString('utf8')

		this.combinedData += stringData

		if (stringData.indexOf(END_OF_LINE) > 0) {
			if (validate(this.combinedData))
				console.log(this.combinedData)
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