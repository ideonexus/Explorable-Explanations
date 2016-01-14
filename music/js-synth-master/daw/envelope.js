var Lazerbahn = Lazerbahn ? Lazerbahn : {};
Lazerbahn.Modules = Lazerbahn.Modules ? Lazerbahn.Modules : {};

Lazerbahn.Modules.Envelope = function () {

    var aEnvelope = [];

    return {
        /**
         * Initialize new envelope
         * Data is array, with number pairs
         * [ sample_index, velocity_percentage,
         *   sample_index2, velocity_percentage2,
         *   sample_index3, velocity_percentage3
         * ]
         *
         * sample_index is an integer
         * velocity_percentage is a value between 0 and 1 (loudness, 0=no sound, 1=full blast)
         *
         * @param {Lazerbahn.Modules.Envelope} aNewEnvelope envelope object
         */
        setEnvelope: function (aNewEnvelope) {
            aEnvelope = aNewEnvelope;
        },
        /**
         * Calculate the current velocity at a certain sample id
         *
         * @param {Number} t sample index
         * @returns {Number} current velocity at sample index
         */
        getVelocity: function (t) {
            for (var i=0; i<aEnvelope.length; i+=2 ) {
                if (aEnvelope[i] > t) {
                    // this is the next data point in the envelope
                    var iTargetVelocity = aEnvelope[i+1],
                        iStartVelocity = aEnvelope[i-1],
                        iSectionStartTime = aEnvelope[i-2],
                        iSectionEndTime = aEnvelope[i],
                        fPercentageInSection = (t-iSectionStartTime)/(iSectionEndTime - iSectionStartTime)
                        ;
                    return fPercentageInSection * (iTargetVelocity - iStartVelocity) + iStartVelocity
                }
            }
            // none found, return last entry
            return aEnvelope[aEnvelope.length-1];
        }

    }
};
