/* calculate the frequencies */

var Lazerbahn = Lazerbahn ? Lazerbahn : {};

(function () {

    var aNotes =   ('c1,c#1,d1,d#1,e1,f1,f#1,g1,g#1,a1,a#1,h1,' +
                    'c2,c#2,d2,d#2,e2,f2,f#2,g2,g#2,a2,a#2,h2,' +
                    'c3,c#3,d3,d#3,e3,f3,f#3,g3,g#3,a3').split(','),
        aBaseNoteA3 =  440
        ;
    Lazerbahn.frequencies = {};
    Lazerbahn.notes = aNotes;

    var iStep = 0;
    for (var i = aNotes.length -1; i >= 0; i--) {
        Lazerbahn.frequencies[aNotes[i]] = aBaseNoteA3 *  Math.pow(2, -iStep++/12)
    }
})();

