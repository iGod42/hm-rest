const parserConfig = require('./parserConfig')

const getTypeFromRecord = (record) => record.substring(1, 5)

const parse = (recordFields, config) =>
	config.fields.reduce((obj, cur, index) => ({
		...obj,
		[cur.name]: cur.parser(recordFields[index])
	}), {
		name: config.name,
		code: config.code,
		timeStamp: new Date()
	})

const prepareTrimmedRecord = (record) => record.split('*')[0].split(',').slice(1)

module.exports = (record) => parse(prepareTrimmedRecord(record), parserConfig[getTypeFromRecord(record)])