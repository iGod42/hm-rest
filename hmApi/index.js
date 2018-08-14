const llapi = require('./lowLevelApi')

const handleUpdate = (record, config) => {
	console.log(record)
}

const HmApi = (() => {
	const llApiKey = Symbol()
	return class HmApi extends EventEmitter {
		constructor () {
			this.config = {}

			const apiInstance = new llapi.LLapi()

			apiInstance.on('updateReceived', (record) => handleUpdate(record, this.config))

			apiInstance.requestConfig()

			this[llApiKey] = apiInstance
		}
	}
})()

module.exports = HmApi