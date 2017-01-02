jQuery.ajaxSettings.traditional = true;  

//spotify API objects
var sp = getSpotifyApi(1);
var models = sp.require("sp://import/scripts/api/models");
var player = models.player;

//lyric objects
var CurrentLyrics = null;		//contains currently playing lyrics and methods
var resetCurrentLyrics = false;	//set to true when the track changes. resets CurrentLyrics on next frame update 

//UI objects
var xMax;							//canvas x size
var yMax;							//canvase y size
var xOffSet;						//space alone sides of xOffset not written over
var canvas = document.getElementById("canvas");  
var CC = canvas.getContext("2d"); 

var textboxLR = "                                    " //textbox line return

//called on page load
function init() {
	sizeCanvas();

	//looks up lyrics for the current track, allowing updates to the text box, and not forcing a tunewiki quary 
	fetchLyrics(player.track.data, true, false);

	//updates the canvas with moving lyrics. constantly called with RequestAnimationFrame
	updateFrame();
}	

//creates largest possible canvas without adding scroll bars to the page
//called on page load and resize
function sizeCanvas(){
	canvas.width = 0;
	canvas.height = 0;

	xMax = window.innerWidth - 20;					
	yMax = window.innerHeight - 20					//height of canvas equal to page height minus the height of other elements
		- document.getElementById("upperCenter").offsetHeight
		- document.getElementById("lowerCenter").offsetHeight;	
	xOffSet = .08*xMax;								//space alone sides of xOffset not written over
	canvas = document.getElementById("canvas");
	canvas.width = xMax;
	canvas.height = yMax;
	CC = canvas.getContext("2d");
	CC.font = "30pt Calibri";

	//if there are lyrics playing, recalculate line wraps
	if (CurrentLyrics && CurrentLyrics.lyricsReady) {
		CurrentLyrics.findLineBreak(CurrentLyrics.lyricLines[CurrentLyrics.CL]);
	}
}

//querys tunewiki
function fetchLyrics(track, displayInfo, forceQuery) {
	console.log("at start of fetchLyrics player is playing: " + player.playing)

	//first try to load saved lyrics
	try {
		var savedRawLyrics = JSON.parse(localStorage.getItem(player.track.uri + "rawLyrics"));
	}
	catch (e){
		console.log("saved lyrics not an object");

	}
	if (savedRawLyrics && !forceQuery){
		console.log("loaded local lyrics");
		callFormatSongLyrics(savedRawLyrics, true);
	}

	//no valid saved lyrics, check and see if tunewiki has any
	else {
		console.log("querying tunewiki");
		if (displayInfo){
			info('Getting lyrics for ' + track.name.decodeForText() + 
			' by ' + track.artists[0].name.decodeForText() + "...");
		}

		player.playing = false;				//pause track					
		calledURI = player.track.uri;		//save URI of quaryed in case song is skipped during quary
		var url ='http://api.tunewiki.com/smp/v2/getLyric?device=900&spotifytok=64b27cdbdd824ce7d3c09782e9467176';
	    $.getJSON(url, {
	        'json':'true',
	        'artist':track.artists[0].name.decodeForText(),
	        'album':track.album.name.decodeForText(),
			'title':track.name.decodeForText()}, 
			function(ldata){
				//check to make sure currently playing song matches called song
				if (calledURI == player.track.uri){	
					console.log("no track change during query");
					callFormatSongLyrics (ldata, false);
				}		
				//if not, there was a track change while quary took place
				//changes CurrentLyrics.songID to the old ID so song change logic will be triggered again
				else {
					console.log("track change during query - starting over");
					CurrentLyrics = {songID: player.track.calledURI}
					alert(calledURI + " " + player.track.uri );
				}
			}
	        );
	}
}

//once a rawlyrics object has been found, it needs to be formated
function callFormatSongLyrics(ldata, localLyrics) {

	//if lyrics aren't valid this messages will be overwritten  
	if (player.playing == false) {
       info(textboxLR + "Got Lyrics - Click to Play!");
	}
	else {
		info(textboxLR + "Type the Lyrics!");
	}	

	//attempts to construct lyrics object from raw data
	CurrentLyrics = new formatSongLyrics(ldata);

	//saved local lyrics aren't valid; try again, requiring tunewiki query
	if (!CurrentLyrics.lyricsReady && localLyrics) {
		fetchLyrics(player.track.data, true, true);
	}

	//remote lyrics are valid; save them locally
	if (CurrentLyrics.lyricsReady && !localLyrics) {
		localStorage.setItem(player.track.uri + "rawLyrics",JSON.stringify(ldata));
		console.log("saved lyrics")
	}

	//if remote lyrics aren't valid, formatSongLyrics will leave a message indicating so
}

//constantly called, redrawing moving lyrics
//there is currently a bug in spotify that makes the animation lag 
//http://stackoverflow.com/q/12390722/1333195 
function updateFrame() {
	webkitRequestAnimationFrame (updateFrame);

	//if there has been a track change, CurrentLyrics are deleted and new query started
	if (resetCurrentLyrics){
		CurrentLyrics = null;
		resetCurrentLyrics = false;
		fetchLyrics(player.track.data, true);
	}

	if (CurrentLyrics) {	
		if (CurrentLyrics.lyricsReady) {
			CurrentLyrics.displayLyrics();
		}
		if (CurrentLyrics.songID != player.track.uri){
			trackChange();
		}
	}
}

//called when track has changed
function trackChange() {
	console.log("track change noticed - reseting CurrentLyrics");

	//A valid set of lyrics have finished playing
	if (CurrentLyrics.lyricsReady && CurrentLyrics.validScore) {
		//rounds and set scores to 0 if they aren't numbers
		var score = Math.round(CurrentLyrics.lineSpeed.sum());
		var scoreText;
		if (!isNum(CurrentLyrics.highScore)){CurrentLyrics.highScore = 0;}
		if (!isNum(score)){score = 0;}

		//saves and writes score info
		if (CurrentLyrics.highScore < score ) {
			scoreText = "High Score of " + score + " beacts the previous High Score  of " + 
				CurrentLyrics.highScore + " on " + CurrentLyrics.songName +"!";
			localStorage.setItem(CurrentLyrics.songID + "hs", score);
		}
		else {
				scoreText = "Score of " + score + " fails to beat the current High Score of " + 
					CurrentLyrics.highScoreAl + " on " + CurrentLyrics.songName +".";
		}				
		document.getElementById("highScoreAlert").innerHTML = scoreText.decodeForHTML();

	}		

	//next updateFrame call will reset CurrentLyrics
	resetCurrentLyrics = true;
}

//called when the text box is clicked
function textboxClick() {
	if (CurrentLyrics){
		if (CurrentLyrics.lyricsReady){
			player.playing = true;
			info(textboxLR + "Type the Lyrics!");
			console.log("textbox clicked");
		}
		else {
			player.next();		
		}
	}
}


$(window).bind('keypress', function(e) {
	saveKey = e;
    var code = (e.keyCode ? e.keyCode : e.which);
	if((CurrentLyrics && CurrentLyrics.lyricsReady) && player.playing){
		CurrentLyrics.compareToNext(String.fromCharCode(e.charCode));
	}
});

function info(s) {
	document.getElementById("textbox").innerHTML = s;					
}

Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};
Array.prototype.sum = function(){
	for(var i=0,sum=0;i<this.length;sum+=this[i++]);
	return sum;
}

function isNum(possibleInteger) {
    return !isNaN(parseInt(possibleInteger));
}


init();