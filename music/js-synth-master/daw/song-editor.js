
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var oSongEditorList = document.getElementsByClassName('song-editor-list')[0],
        oSongEditorLineTemplate = oSongEditorList.getElementsByClassName('entry')[0],
        oPlaySongButton = document.getElementById('playSong'),
        oSaveSongButton = document.getElementById('saveSong'),
        oLoadSongButton = document.getElementById('loadSong'),
        oNewSongButton = document.getElementById('newSong'),
        aPatternList = []
    ;
    oSongEditorLineTemplate.remove();

    function addNewLineAt(iId) {

        var aPatterns = Lazerbahn.patternEditor.getPatternList();

        if (iId < 0) {
            aPatternList.push(aPatterns[0]);
        } else {
            aPatternList.splice(iId, 0, aPatterns[0]);
        }
    }

    function clear() {
        aPatternList = [];
        addNewLineAt(-1);
        updateSongList();
    }

    function updateSongList() {

        oSongEditorList.innerHTML = '';

        for (var i = 0; i < aPatternList.length; i++){
            var oEntry = oSongEditorLineTemplate.cloneNode(true),
                oSelect = oEntry.getElementsByClassName('pattern')[0],
                aPatterns = Lazerbahn.patternEditor.getPatternList(),
                oId = oEntry.getElementsByClassName('id')[0],
                iPatternId = -1,
                oNewButton = oEntry.getElementsByClassName('new')[0],
                oDeleteButton = oEntry.getElementsByClassName('delete')[0]
                ;

            if (aPatternList[i]) {
                for (var j = 0; j < aPatterns.length; j++) {
                    oSelect.options[j] = new Option(aPatterns[j].name, aPatterns[j].name);
                    if (aPatternList[i].name == aPatterns[j].name) {
                        iPatternId = j;
                    }
                }
            }

            if (iPatternId < 0) {
                aPatternList[i] = null;
                continue;
            }
            oSelect.selectedIndex = iPatternId;
            oId.innerHTML = i + 1;
            oSongEditorList.appendChild(oEntry);

            oNewButton.patternListId = i;
            oNewButton.onclick = function () {
                addNewLineAt(this.patternListId + 1);
                updateSongList();
            }

            oSelect.patternListId = i;
            oSelect.onchange = function () {
                for (var i = 0; i < aPatterns.length; i++) {
                    if (aPatterns[i].name == this.value) {
                        aPatternList[this.patternListId] = aPatterns[i];
                    }
                }
            }
            oDeleteButton.patternListId = i;
            oDeleteButton.onclick = function () {
                aPatternList[this.patternListId] = null;
                updateSongList();
            }

        }

        // clean up empty entries
        var iLength = aPatternList.length;
        aPatternList = aPatternList.filter(function (oValue) { return oValue != null; });
        if (iLength !== aPatternList.length) {
            // if elements were removed, re-render the list to fix indexes
            updateSongList();
        }

    }

    oPlaySongButton.onclick = function () {
        var sBuffer = '';
        for (var i = 0; i < aPatternList.length; i++) {
            sBuffer += Lazerbahn.patternRenderer.render(aPatternList[i]);
        }
        Lazerbahn.synth.buildAudio(sBuffer).play();
    };

    oSaveSongButton.onclick = function () {
        var oDataExchange = document.getElementById('dataExchange'),
            aPatternIds = [],
            aPatterns = Lazerbahn.patternEditor.getPatternList()

        for (var i = 0; i < aPatternList.length; i++) {
            aPatternIds.push(aPatternList[i].name);
        }

        oDataExchange.value =
            JSON.stringify(aPatterns) + ';' +
            JSON.stringify(aPatternIds) + ';' +
            JSON.stringify(Lazerbahn.synthEditor.getSounds())
        ;
    };

    oLoadSongButton.onclick = function () {
        var oDataExchange = document.getElementById('dataExchange'),
            aData = oDataExchange.value.split(';')
        ;
        var aPatterns = JSON.parse(aData[0]);
        var oInstruments = JSON.parse(aData[2]);
        Lazerbahn.patternEditor.setPatternList(aPatterns);
        Lazerbahn.synthEditor.setSound(oInstruments);
        var aNewPatternList = JSON.parse(aData[1]);
        aPatternList = [];
        for (var i = 0; i < aNewPatternList.length; i++) {
            aPatternList.push(Lazerbahn.patternEditor.getPattern(aNewPatternList[i]));
        }
        updateSongList();
    }

    oNewSongButton.onclick = function () {
        Lazerbahn.patternEditor.clear();
        Lazerbahn.trackEditor.clear();
        Lazerbahn.songEditor.clear();
        Lazerbahn.synthEditor.clear();

    };

    clear();

    setTimeout(function () {
        oLoadSongButton.click();
    }, 100);

    Lazerbahn.songEditor = {
        updateSongList: updateSongList,
        clear: clear
    }

})();