const Serial = require('../serial')
const EventEmitter = require('events')
const updateParser = require('./updateParser')

const LLapi = (() => {
	const serialKey = Symbol()
	const getCharNTimes = (char, n) => (new Array(n + 1)).join(char)

	return class LLApi extends EventEmitter {

		constructor () {
			super()
			const serial = Serial.getInstance()
			serial.on('dataReceived', (record) => {
				try {
					const parsed = updateParser(record)
					this.emit('updateReceived', parsed)
				}
				catch (e) {
					// Probably no mapping can be ignored
				}
			})
			this[serialKey] = serial
		}

		requestSerialUrl (url) { this[serialKey].write(`\n${url}\n`)}

		// /config - Retreives version, current probe names and RF map (will be expanded to all config at some point)
		requestConfig () { this.requestSerialUrl('/config')}

		// /set?sp=AU - Set the setpoint to integer A with optional units U. Supported Units are (A)DC Raw, (F)ahrenheit , (C)elcius, and (R)esistance. Setting the setpoint to a negative value switches to "manual mode" where the output percentage is set directly (-0 for 0%).setSetPoint()
		setSetPoint (value, unit) {this.requestSerialUrl(`/set?sp=${value}${unit || ''}`)}

		// /set?pidA=B - Tune PID parameter A to value float B.  A can be b (bias), p (proportional), i (integral), or d (derivative)
		tunePid (param, value) {this.requestSerialUrl(`/set?pid${param}=${value}`)}

		// /set?pnA=B - Set probe name A to string B.  B does not support URL encoding at this time.  Probe numbers are 0=pit 1=food1 2=food2 3=ambient
		setProbeName (probe, name) {this.requestSerialUrl(`/set?pn${probe}=${name}`)}

		// /set?po=A,B,C,D - Set probe offsets to integers A, B, C, and D. Offsets can be omitted to retain their current values, such as po=,,,-2 to only set probe number 3's offset to -2
		setProbeOffsets (pit, food1, food2, ambient) {this.requestSerialUrl(`/set?po=${pit || ''},${pit || ''},${food2 || ''},${ambient || ''}`)}

		setProbeOffset (probe, offset) { this.requestSerialUrl(`/set?po=${getCharNTimes(',', probe)}${offset}${LLApi.getCharNTimes(',', 3 - probe)}`)}

		// /set?pcN=A,B,C,R,TRM - Set the probe coefficients and type for probe N.  A, B, and C are the Steinhart-Hart coeffieicents and R is the fixed side of the probe voltage divider.  A, B, C and R are floating point and can be specified in scienfific noation, e.g. 0.00023067434 -> 2.3067434e-4.  TRM is either the type of probe OR an RF map specifier.  If TRM is less than 128, it indicates a probe type.  Probe types are 0=Disabled, 1=Internal, 2=RFM12B.  Probe types of 128 and above are implicitly of type RFM12B and indicate the transmitter ID of the remote node (0-63) + 128. e.g. Transmitter ID 2 would be passed as 130. The value of 255 (transmitter ID 127) means "any" transmitter and can be used if only one transmitter is used.  Any of A,B,C,R,TRM set to blank will not be modified. Probe numbers are 0=pit 1=food1 2=food2 3=ambient
		setProbeCoefficients (probe, steinhartHartA, steinhartHartB, steinhartHartC, probeVoltageDividerResistance, TRM) { this.requestSerialUrl(`/set?pc${probe}=${steinhartHartA},${steinhartHartB},${steinhartHartC},${probeVoltageDividerResistance},${TRM}`)}

		// /set?lb=A,B,C[,C...] - Set display parameters.  A = LCD backlight Range is 0 (off) to 255 (full). B = Home screen mode 254=4-line 255=2-line 0, 1, 2, 3 = BigNum. C = Set LED config byte for Nth LED. See ledmanager.h::LedStimulus for values. High bit means invert.
		setDisplayParameters (lcdBacklight, homeScreenMode, ...ledValues) { this.requestSerialUrl(`/set?lb=${lcdBacklight},${homeScreenMode}${ledValues ? ',' + ledValues.join(',') : ''}`)}

		// in precent
		setLcdBrightness (brightness) { this.requestSerialUrl(`/set?lb=${Math.ceil(255 * brightness / 100)}`)}

		setHomeScreenMode (hsm) { this.requestSerialUrl(`/set?lb=,${hsm}`)}

		// /set?ld=A,B,C - Set Lid Detect offset to A%, duration to B seconds. C is used to enable or disable a currently running lid detect mode. Non-zero will enter lid open mode, zero will disable lid open mode.
		setLidDetectionPercentage (percentage) { this.requestSerialUrl(`/set?ld=${percentage}`)}

		setLidDetectionDuration (seconds) { this.requestSerialUrl(`/set?ld=,${seconds}`)}

		setLidModeEnabled (isEnabled) { this.requestSerialUrl(`/set?ld=,,${!isEnabled ? 0 : 1}`)}

		// /set?al=L,H[,L,H...] - Set probe alarms thresholds. Setting to a negative number will disable the alarm, setting to 0 will stop a ringing alarm and disarm it.
		setAlarmThresholds (...thresholds) { this.requestSerialUrl(`/set?al=${thresholds.map(th => `${th.low},${th.high}`).join(',')}`)}

		// /set?fn=FL,FH,SL,SH,Flags,MSS,FAF,SAC - Set the fan output parameters. FL = min fan speed before "long PID" mode, FH = max fan speed, SL = Servo Low (in 10x usec), SH = Servo High (in 10x usec), MSS = Max Startup Speed, FAF = Fan active floor, SAC = Servo active ceiling. Flags = Bitfield 0=Invert Fan, 1=Invert Servo
		setFanPrams (minFanSpeed, maxFanSpeed, servoLow, servoHigh, maxStartupSpeed, fanActiveFloor, servoActiveCeiling, flags) { this.requestSerialUrl(`/set?fn=${minFanSpeed},${maxFanSpeed},${servoLow},${servoHigh},${flags},${maxStartupSpeed},${fanActiveFloor},${servoActiveCeiling}`)}

		// /set?tt=XXX[,YYY] - Display a "toast" message on the LCD which is temporarily displayed over any other menu and is cleared either by timeout or any button press. XXX and YYY are the two lines to displau and can be up to 16 characters each.
		displayToastMessage (line1, line2) { this.requestSerialUrl(`/set?tt=${line1},${line2 || ''}`)}

		// /set?tp=A - Set a "temp param". A = Log PID Internals ($HMPS)
		setTempParam (logPidInternal) { this.requestSerialUrl(`/set?tp=${logPidInternal}`)}

		// /reboot - Reboots the microcontroller.  Only if wired to do so (LinkMeter)
		reboot () { this.requestSerialUrl(`/reboot`)}

		// /set?pnXXX - Retrieve the current probe names
		getProbeNames () { requestConfig('/set?pnXXX')}
	}
})()

const SET_POINT_UNITS = {
	DC_RAW: 'A',
	Fahrenheit: 'F',
	Celcius: 'C',
	Resistance: 'R'
}

const PID_PARAMS = {
	bias: 'b',
	proportional: 'p',
	integral: 'i',
	derivate: 'd'
}

const PROBES = {
	pit: 0,
	food1: 1,
	food2: 2,
	ambient: 3
}

const HOME_SCREEN_MODE = {
	FourLine: 254,
	TwoLine: 255,
	BigNumPitProbe: 0,
	BigNumFood1Probe: 1,
	BigNumFood2Probe: 2,
	BigNumAmbientProbe: 3
}

module.exports = {
	SET_POINT_UNITS,
	PID_PARAMS,
	PROBES,
	LLapi
}