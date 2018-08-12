const SerialApi = require('./serial')

const serial = SerialApi.getInstance()
serial.subscribe(console.log)

serial.requestConfig()