const {CSV_RECORD_REGEX} = require('./constants')

const isWellFormed = (theData) => theData.match(CSV_RECORD_REGEX)

const calcXorChecksum = (stringData) =>
	stringData.split('')
	.reduce(
		(total, cur) => total ^ cur.charCodeAt(0),
		0)
const getCheckSum = stringData => stringData.substr(stringData.indexOf('*') + 1)
const getTextDataOnly = stringData => stringData.substring(1, stringData.indexOf('*'))
const parseHexString = hexString => parseInt(Number('0x' + hexString).toString(10))

const hasValidChecksum = (theData) =>
	calcXorChecksum(getTextDataOnly(theData)) === parseHexString(getCheckSum(theData))

module.exports = (theData) => isWellFormed(theData) && hasValidChecksum(theData)