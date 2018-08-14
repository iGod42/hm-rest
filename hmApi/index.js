const EventEmitter = require('events')
const Datastore = require('nedb')

const llapi = require('./lowLevelApi')

const db = new Datastore({filename: process.env.DB_PATH || './db.json', autoload: true})

const WAIT_FOR_N_TICKS_BETWEEN_UPDATES = (process.env.TEMP_STORE_DISTANCE || 10)

const saveRecord = (record) => {
	const _record = {...record}
	delete _record.code
	delete _record.name
	db.insert(_record, (err) => console.error)
}

let ticksSinceLastSu = 1

const handleUpdate = (record, config, emit) => {
	if (!record || !config)
		return

	switch (record.code) {
		case 'HMSU':
			ticksSinceLastSu--
			if (ticksSinceLastSu <= 0) {
				saveRecord(record)
				ticksSinceLastSu = WAIT_FOR_N_TICKS_BETWEEN_UPDATES
			}
			break
	}
}

const HmApi = (() => {
	const llApiKey = Symbol()
	return class HmApi extends EventEmitter {
		constructor () {
			super()

			this.config = {}

			const apiInstance = new llapi.LLapi()

			apiInstance.on('updateReceived', (record) => handleUpdate(record, this.config, this.emit))

			apiInstance.requestConfig()

			this[llApiKey] = apiInstance
		}
	}
})()

module.exports = HmApi