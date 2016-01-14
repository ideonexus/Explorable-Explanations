
var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var aPatterns = [],
        oPatternName = document.getElementById('patternName'),
        oPatternSelect = document.getElementById('pattern'),
        oNewPatternButton = document.getElementById('newPattern'),
        oDeletPatternButton = document.getElementById('deletePattern'),
        iCurrentPattern = -1
    ;

    function getPattern(sName) {
        for (var i = 0; i < aPatterns.length; i++) {
            if (aPatterns[i].name == sName) {
                return aPatterns[i];
            }
        }
        return false;
    }

    function updatePatternSelect() {
        oPatternSelect.options.length = 0;
        for (var i = 0; i < aPatterns.length; i++) {
            oPatternSelect.options[i] = new Option(aPatterns[i].name, aPatterns[i].name);
        }
        oPatternSelect.selectedIndex = iCurrentPattern;
    }

    function newPattern() {
        if (iCurrentPattern >= 0) {
            savePattern();
        }
        Lazerbahn.trackEditor.clear();
        // find a new pattern name
        var sPatternBase = 'pattern '
        iId = 1;
        while (getPattern(sPatternBase + iId)) {iId++;}
        oPatternName.value = sPatternBase + iId;
        aPatterns.push({
            name : oPatternName.value,
            instruments : Lazerbahn.trackEditor.getInstruments(),
            tracks : Lazerbahn.trackEditor.getTracks()
        });
        iCurrentPattern = aPatterns.length - 1;
        selectPattern(iCurrentPattern);
    }

    function savePattern() {
        var oPattern = aPatterns[iCurrentPattern];
        oPattern.name = oPatternName.value;
        oPattern.tracks = Lazerbahn.trackEditor.getTracks();
        oPattern.instruments = Lazerbahn.trackEditor.getInstruments();
    }

    function selectPattern(iPatternId) {
        iCurrentPattern = iPatternId;
        oPatternSelect.selectedIndex = iPatternId;
    }

    function loadPatternData() {
        oPatternName.value = aPatterns[iCurrentPattern].name;
        Lazerbahn.trackEditor.update(aPatterns[iCurrentPattern].instruments, aPatterns[iCurrentPattern].tracks)
    }

    function clear() {
        iCurrentPattern = -1;
        aPatterns = [];
        newPattern();
        savePattern();
        updatePatternSelect();
    }

    oNewPatternButton.onclick = function () {
        newPattern();
        savePattern();
        updatePatternSelect();
        selectPattern(iCurrentPattern);
        loadPatternData();
    }

    oDeletPatternButton.onclick = function () {
        if (aPatterns.length > 1) {
            aPatterns.splice(iCurrentPattern, 1);
            iCurrentPattern = iCurrentPattern - 1;
        } else {
            newPattern();
            iCurrentPattern = 0;
        }
        updatePatternSelect();
        selectPattern(iCurrentPattern);
        Lazerbahn.songEditor.updateSongList();
    }

    oPatternSelect.onchange = function () {
        savePattern();
        selectPattern(oPatternSelect.selectedIndex);
        loadPatternData();
    }

    oPatternName.onchange = function () {
        savePattern();
        updatePatternSelect();
        Lazerbahn.songEditor.updateSongList();
    }

    var oRenderSongButton = document.getElementById('renderSong');
    oRenderSongButton.onclick = function () {

        var sBuffer = Lazerbahn.patternRenderer.render({
                instruments: Lazerbahn.trackEditor.getInstruments(),
                tracks: Lazerbahn.trackEditor.getTracks()
            });
        Lazerbahn.synth.buildAudio(sBuffer).play();
    };

    // create first empty pattern
    clear();

    Lazerbahn.patternEditor = {
        getPatternList: function () {
            return aPatterns;
        },
        setPatternList: function (aNewPatterns) {
            aPatterns = aNewPatterns;
            updatePatternSelect();
            loadPatternData();
        },
        getPattern: getPattern,
        save: savePattern,
        clear: clear,
        updatePatternSelect: updatePatternSelect
    }

})();