const EventEmitter = require('events')
const Datastore = require('nedb')

const llapi = require('./lowLevelApi')

const db = new Datastore({filename: process.env.DB_PATH || './db.json', autoload: true})

const WAIT_FOR_N_TICKS_BETWEEN_UPDATES = (process.env.TEMP_STORE_DISTANCE || 10)

const cleanRecord = record =>
	Object.keys(record).reduce((obj, curr) =>
			curr === 'code' || curr === 'name' ?
				obj :
				{
					...obj,
					[curr]: record[curr]
				},
		{})

const persistRecord = (record) => {
	db.insert(cleanRecord(record), (err) => err ? console.error(err) : null)
}

let ticksSinceLastSu = 1

const handleUpdate = (record, cookData) => {
	if (!record || !cookData)
		return

	switch (record.code) {
		case 'HMSU':
			cookData.temperatureData.push(cleanRecord(record))
			ticksSinceLastSu--
			if (ticksSinceLastSu <= 0) {
				persistRecord(record)
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

			this.cookData = {
				temperatureData: [],
				config: {}
			}

			const apiInstance = new llapi.LLapi()

			apiInstance.on('updateReceived', (record) => handleUpdate(record, this.cookData, this.emit))

			apiInstance.requestConfig()

			this[llApiKey] = apiInstance
		}

		getTempsSince (timestamp) {
			return !timestamp ?
				this.cookData.temperatureData :
				this.cookData.temperatureData.filter(record => record.timeStamp > timestamp)
		}
	}
})()

module.exports = HmApi