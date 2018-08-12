const SerialApi = require('./serial')

const serial = SerialApi.getInstance()

let latestEntry = ''

serial.subscribe(console.log)

serial.requestConfig()

const printInstuctions = () => console.log(' c for config')

const stdin = process.openStdin()
stdin.addListener('data', function (d
) {
	// note:  d is an object, and when converted to a string it will
	// end with a linefeed.  so we (rather crudely) account for that
	// with toString() and then trim()
	const input = d.toString().trim()
	if (input === 'c')
		serial.requestConfig()

	main()
})

const main = () => {
	printInstuctions()
}

main()
