

var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var SAMPLE_RATE = 44100;
    var oFormulas = {};

    /**
     * Basic sine wave oscillator
     *
     * @param {Number} fFreq frequency of the note
     * @param {Number} t sample index
     * @returns {Number} sample value at the specified sample index
     */
    var oscSin = function (fFreq, t) {
        return 127 * Math.sin( 2 * Math.PI * fFreq * t / SAMPLE_RATE);
    };

    /**
     * Basic saw wave oscillator
     *
     * @param {Number} fFreq frequency of the note
     * @param {Number} t sample index
     * @returns {Number} sample value at the specified sample index
     */
    var oscSaw = function (fFreq, t) {
        return  127 - (t % (SAMPLE_RATE / fFreq)) * (255 / (SAMPLE_RATE / fFreq));
    };

    /**
     * Basic square wave oscillator
     *
     * @param {Number} fFreq frequency of the note
     * @param {Number} t sample index
     * @returns {Number} sample value at the specified sample index
     */
    var oscSqr = function (fFreq, t) {
        return oscRec(fFreq, t, .5);
    };

    /**
     * Basic rectangle wave oscillator
     *
     * @param {Number} fFreq frequency of the note
     * @param {Number} t sample index
     * @param {Number} fPercent between 0 and 1, defines the pivot point where the wave switches sign
     * @returns {Number} sample value at the specified sample index
     */
    var oscRec = function (fFreq, t, fPercent) {
        var iFullCycleLength = SAMPLE_RATE / fFreq;
        var iSamplePos = t % iFullCycleLength;
        return (iSamplePos < iFullCycleLength * fPercent) ? -127 : 127;
    };

    /**
     * Calculate the value of a function for a given duration
     *
     * @param {String} sFormula fo
     * @param {Number} fFreq
     * @param {Number} iDuration
     * @param {Lazerbahn.Modules.Envelope} oEnvelope
     */
    function calc(sFormula, fFreq, iDuration, oEnvelope) {
        var oPersistentData = {};
        for(var t=0, S = ''; ++t < iDuration; ) {
            S+=String.fromCharCode(
                128 + calcStep(sFormula, fFreq, t, t, oPersistentData, oEnvelope)
            );
        }
        return build(S);
    }

    /**
     * Get a function form a formula (text)
     *
     * @param {String} sFormula a math formula
     * @returns {Function} Function representing this formula
     */
    function getSynthFunction(sFormula) {
        if (typeof (oFormulas[sFormula]) == 'undefined') {
            console.log('create '+ sFormula);
            var cFunction =  null;
            eval('cFunction=function (f,t,gt,d){with(Math){return ' + sFormula + '}}');
            oFormulas[sFormula] = cFunction;
        }
        return oFormulas[sFormula];
    }

    /**
     * Create a base64 encoded wave file
     *
     * @param {String} sBuffer contains the raw wave data
     * @returns {Audio} returns an audio-element initialized with the wave data
     */
    function build(sBuffer) {
        var S = 'RIFF_oO_WAVEfmt'+atob('IBAAAAABAAEARKwAAAAAAAABAAgAZGF0YU') + sBuffer;
        return  new Audio( 'data:audio/wav;base64,'+btoa( S ) );

    }

    /**
     * Calculate one sample value of a function
     *
     * @param {String} sFormula formula for the sound curve
     * @param {Number} f frequency value (float)
     * @param {Number} t sample index since last note change (int)
     * @param {Number} gt global sample index (int)
     * @param {Object} d persistent data object for for the synth
     * @param {Lazerbahn.Modules.Envelope} oEnvelope envelope object
     * @return {Number} sample data value
     */
    function calcStep(sFormula, f, t, gt, d, oEnvelope) {
        var cFunction =  getSynthFunction(sFormula),
            iValue = cFunction(f, t, gt, d) * oEnvelope.getVelocity(t)
            ;
        return Math.min(Math.max(-127, iValue +.5| 0), 127);
    }

    // external interface
    Lazerbahn.synth = {
        calculate : calc,
        calculatePatternStep: calcStep,
        buildAudio : build
    }

})();

