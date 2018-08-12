// XORs char codes of all characters received
// returns a decimal
const calcXorChecksum = (stringData) =>
	stringData.split('')
	.reduce(
		(total, cur) => total ^ cur.charCodeAt(0),
		0)

// checksum is everything after the asterisk
const getCheckSum = stringData => stringData.substr(stringData.indexOf('*') + 1)
// extract just the payload not including delimiters
const getTextDataOnly = stringData => stringData.substring(1, stringData.indexOf('*'))
const parseHexStringAsDec = hexString => parseInt(Number('0x' + hexString).toString(10))

const hasValidChecksum = (theData) =>
	calcXorChecksum(getTextDataOnly(theData)) === parseHexStringAsDec(getCheckSum(theData))

module.exports = hasValidChecksum