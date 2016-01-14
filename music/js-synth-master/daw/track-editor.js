
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oTrackDatas = document.getElementsByClassName('track-data'),
        oTracks = document.getElementsByClassName('track'),
        oSoundSelects = document.getElementsByClassName('track-sound-select'),
        oSounds = Lazerbahn.synthEditor.getSounds(),
        TRACK_LENGTH = 32,
        i,
        iSelectedTrack = -1,
        iSelectedLine = -1,
        aTrackContentData = [],
        NO_DATA = '---'
        ;

    var selectTrack = function (iId) {
        iSelectedTrack = iId;
        for (var i = 0; i < oTracks.length; i++) {
            if (i == iId) {
                oTracks[i].setAttribute('class', 'track selected');
            } else {
                oTracks[i].setAttribute('class', 'track');
                unSelectLines(i);
            }
        }
    };

    var unSelectLines = function (iTrackId) {
        var oTrack = oTracks[iTrackId];
        var aTrackLines = oTrack.getElementsByClassName('track-line');
        for (var i = 0; i < aTrackLines.length; i++) {
            aTrackLines[i].setAttribute('class', 'track-line');
        }
    };

    var selectLine = function(iLineId) {
        iSelectedLine = iLineId;
        var oTrack = oTracks[iSelectedTrack];
        var aTrackLines = oTrack.getElementsByClassName('track-line');
        unSelectLines(iSelectedTrack);
        aTrackLines[iLineId].setAttribute('class', 'track-line selected');
    };

    var createClickListener = function (iTrackId, iTrackLineId) {
        return function () {
            // mark the track
            selectTrack(iTrackId);
            // mark the track line
            selectLine(iTrackLineId);
        }
    };

    var renderData = function () {
        for (var i = 0; i < oTrackDatas.length; i++) {
            var oTrack = oTracks[i];
            var aTrackLines = oTrack.getElementsByClassName('track-line');
            for (var j = 0; j < aTrackLines.length; j++) {
                aTrackLines[j].getElementsByClassName('data')[0].innerHTML = aTrackContentData[i][j];
            }
        }
    };

    var nextLine = function () {
        iSelectedLine++;
        if (iSelectedLine >= TRACK_LENGTH) {
            iSelectedLine = 0;
        }
        selectLine(iSelectedLine);
    };

    for (i = 0; i < oTrackDatas.length; i++) {
        // render track data
        var sTrack = '';
        for (var j = 0; j < TRACK_LENGTH; j++){
            sTrack += '<div class="track-line">' +
                '<span class="number">' + ('0' + j).slice(-2) + '</span>' +
                '<span class="data">' + '</span>' +
                '</div>'
        }
        oTrackDatas[i].innerHTML = sTrack;
    }

    function init() {
        for (i = 0; i < oTracks.length; i++) {
            aTrackContentData[i] = [];
            // setup
            var oTrack = oTracks[i];
            oTrack.id = 'track' + i;
            var aTrackLines = oTrack.getElementsByClassName('track-line');
            for (j = 0; j < aTrackLines.length; j++) {
                aTrackContentData[i][j] = NO_DATA;
                aTrackLines[j].id = oTrack.id + '_line' + j;
                aTrackLines[j].addEventListener('click', createClickListener(i, j));
            }
        }
    }

    function updateSoundSelect() {
        oSounds = Lazerbahn.synthEditor.getSounds();
        for (var i = 0; i < oSoundSelects.length; i++) {
            var sValue = oSoundSelects[i].value;
            oSoundSelects[i].options.length = 0;
            for (var sSoundName in oSounds) {
                if (oSounds.hasOwnProperty(sSoundName)) {
                    oSoundSelects[i].options[oSoundSelects[i].options.length] = new Option(sSoundName, sSoundName);
                }
            }
            oSoundSelects[i].value = sValue;
        }
    }

    init();
    updateSoundSelect();


    Lazerbahn.keyboard.onKeyPress(
        function (iKeyCode) {
            switch (iKeyCode) {
                case Lazerbahn.keyboard.KEY_DOWN:
                    if (iSelectedLine < 0) {
                        break;
                    }
                    nextLine();
                    break;
                case Lazerbahn.keyboard.KEY_UP:
                    if (iSelectedLine < 0) {
                        break;
                    }
                    iSelectedLine--;
                    if (iSelectedLine < 0) {
                        iSelectedLine = TRACK_LENGTH - 1;
                    }
                    selectLine(iSelectedLine);
                    break;
                case Lazerbahn.keyboard.KEY_LEFT:
                    if (iSelectedTrack < 0) {
                        break;
                    }
                    iSelectedTrack--;
                    if (iSelectedTrack < 0) {
                        iSelectedTrack = oTracks.length - 1;
                    }
                    selectTrack(iSelectedTrack);
                    selectLine(iSelectedLine);
                    break;
                case Lazerbahn.keyboard.KEY_RIGHT:
                    if (iSelectedTrack < 0) {
                        break;
                    }
                    iSelectedTrack++;
                    if (iSelectedTrack >= oTracks.length) {
                        iSelectedTrack = 0;
                    }
                    selectTrack(iSelectedTrack);
                    selectLine(iSelectedLine);
                    break;
                default:
                    if (Lazerbahn.keyToNoteMap[iKeyCode] || iKeyCode === Lazerbahn.keyboard.KEY_SPACE) {
                        if (iSelectedTrack < 0 || iSelectedLine < 0) {
                            break;
                        }
                        if (
                            document.activeElement.tagName.toLowerCase() === 'input' ||
                            document.activeElement.tagName.toLowerCase() === 'textarea'
                        ) {
                            unSelectLines(iSelectedTrack);
                            break;
                        }

                        if (Lazerbahn.keyToNoteMap[iKeyCode]){
                            aTrackContentData[iSelectedTrack][iSelectedLine] = Lazerbahn.keyToNoteMap[iKeyCode];
                        } else {
                            aTrackContentData[iSelectedTrack][iSelectedLine] = NO_DATA;
                        }
                        nextLine();
                        renderData();
                        Lazerbahn.patternEditor.save();
                    }
                    break;

            }
        }
    );
    renderData();

    Lazerbahn.trackEditor = {
        /**
         * Returns the track content, a two-dimensional array
         * dimension 1 is the track id
         * dimension 2 is the line id
         *
         * @returns {Array} track data
         */
        getTracks : function () {
            var aTrackData = [];
            for (var i = 0; i < aTrackContentData.length; i++) {
                aTrackData[i] = [];
                for (var j = 0; j < aTrackContentData[i].length; j++) {
                    aTrackData[i][j] = aTrackContentData[i][j];
                }
            }
            return aTrackData;
        },
        /**
         * Returns the instrument name for each track in an array
         *
         * @returns {Array} instrument names
         */
        getInstruments : function () {
            var aInstruments = [];
            for (var i = 0; i < oTracks.length; i++) {
                var oSelect = oTracks[i].getElementsByClassName('track-sound-select')[0];
                aInstruments.push(oSelect.value);
            }
            return aInstruments;
        },

        clear: function () {
            init();
            renderData();
        },

        updateSoundSelect: function () {
            updateSoundSelect();
        },

        update: function (aInstruments, aTrackData) {
            aTrackContentData = aTrackData;
            for (var i = 0; i < aInstruments.length; i++) {
                var oSelect = oTracks[i].getElementsByClassName('track-sound-select')[0];
                oSelect.value = aInstruments[i];
            }
            renderData();
        }
    }
})();