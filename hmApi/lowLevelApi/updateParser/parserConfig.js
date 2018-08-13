const parseString = a => a

module.exports = {
	HMSU: {
		name: 'PID State Update',
		code: 'HMSU',
		fields: [
			{name: 'setPoint', parser: parseInt},
			{name: 'pit', parser: parseFloat},
			{name: 'food1', parser: parseFloat},
			{name: 'food2', parser: parseFloat},
			{name: 'ambient', parser: parseFloat},
			{name: 'fanSpeed', parser: parseInt},
			{name: 'fanAverage', parser: parseInt},
			{name: 'lidOpenCountdown', parser: parseInt}
		]
	},
	UCID: {
		name: 'Microcontroller ID',
		code: 'UCID',
		fields: [
			{name: 'controllerName', parser: parseString},
			{name: 'Version', parser: parseString}
		]
	},
	HMPD: {
		name: 'PID Coefficients',
		code: 'HMPD',
		fields: [
			{name: 'bias', parser: parseFloat},
			{name: 'proportional', parser: parseFloat},
			{name: 'integral', parser: parseFloat},
			{name: 'derivative', parser: parseFloat}
		]
	},
	HMFN: {
		name: 'Fan Parameters',
		code: 'HMFN',
		fields: [
			{name: 'minFanSpeed', parser: parseInt},
			{name: 'maxFanSpeed', parser: parseInt},
			{name: 'servoMin', parser: parseInt},
			{name: 'servoHMax', parser: parseInt},
			{name: 'flags', parser: parseInt},
			{name: 'maxStartupSpeed', parser: parseInt},
			{name: 'fanActiveFloor', parser: parseInt},
			{name: 'servoActiveCeiling', parser: parseInt}
		]
	},
	HMPN: {
		name: 'Probe Names',
		code: 'HMPN',
		fields: [
			{name: 'pit', parser: parseString},
			{name: 'food1', parser: parseString},
			{name: 'food2', parser: parseString},
			{name: 'ambient', parser: parseString}
		]
	},
	HMPC: {
		name: 'Probe Coefficient',
		code: 'HMPC',
		fields: [
			{name: 'probe', parser: parseInt},
			{name: 'steinhartHartA', parser: parseFloat},
			{name: 'steinhartHartB', parser: parseFloat},
			{name: 'steinhartHartC', parser: parseFloat},
			{name: 'resistance', parser: (val) => Math.ceil(parseFloat(val))},
			{name: 'trm', parser: parseInt}
		]
	},
	HMLB: {
		name: 'Display Parameters',
		code: 'HMLB',
		fields: [
			{name: 'backLightBrightness', parser: parseInt},
			{name: 'homeScreenMode', parser: parseInt},
			{name: 'led0Mode', parser: parseInt},
			{name: 'led1Mode', parser: parseInt},
			{name: 'led2Mode', parser: parseInt},
			{name: 'led3Mode', parser: parseInt}
		]
	},
	HMLD: {
		name: 'Lid Detection',
		code: 'HMLD',
		fields: [
			{name: 'offsetPercentage', parser: parseInt},
			{name: 'duration', parser: parseInt}
		]
	},
	HMAL: {
		name: 'Alarm Indicator',
		code: 'HMAL',
		fields: [
			{name: 'pitLow', parser: parseInt},
			{name: 'pitHigh', parser: parseInt},
			{name: 'food1Low', parser: parseInt},
			{name: 'food1High', parser: parseInt},
			{name: 'food2Low', parser: parseInt},
			{name: 'food2High', parser: parseInt},
			{name: 'ambientLow', parser: parseInt},
			{name: 'ambientHigh', parser: parseInt}
		]
	},
	HMLG: {
		name: 'Debug Log Message',
		code: 'HMLG',
		fields: [
			{name: 'message', parser: parseString}
		]
	},
	HMPO: {
		name: "Probe Offsets",
		code: "HMPO",
		fields: [
			{name: 'pit', parser: parseInt},
			{name: 'food1', parser: parseInt},
			{name: 'food2', parser: parseInt},
			{name: 'ambient', parser: parseInt}
		]
	}
}