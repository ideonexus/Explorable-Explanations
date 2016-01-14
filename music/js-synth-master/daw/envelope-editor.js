
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oEnvelopeTextarea = document.getElementById('envelope-editor');

    Lazerbahn.envelopeEditor = {
        /**
         * Get a envelope object, either current one from editor or from specified text
         *
         * @param {String} [sText]
         * @returns {*}
         */
        getEnvelope : function (sText){

            if (!sText) {
                sText = oEnvelopeTextarea.value;
            }

            var aEnvelopeData = eval('[' + sText + ']'),
                oEnvelope = Lazerbahn.Modules.Envelope()
            ;
            oEnvelope.setEnvelope(aEnvelopeData);
            return oEnvelope;
        }
    }
})();