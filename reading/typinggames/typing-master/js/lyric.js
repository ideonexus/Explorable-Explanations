function formatSongLyrics(passedLyrics){
	this.lyrics = passedLyrics;								//object returned from tunewiki
	this.songID = player.track.uri;							//saves spotify URI to look up and save high score
	this.songName = player.track.name;						//saves name of song
	
	//loads high score from local storage
	this.validScore = true;									//set to false if song is rewond
	this.priorPosition = 0;									//last time drawLyrics was called. if it decreases, score not valid
	this.highScore = localStorage.getItem(this.songID + "hs");	
	if (!this.highScore) {
		this.highScore = 0;
	}
	this.lyricsReady = false;								//song loaded correctly and can be displayed
	
	//what porition of the canvas needs to be repainted
	this.clear = {};
	this.clear.yCord = .1*yMax;
	this.clear.height = 0;
	
	//location and number of linebreaks for word wrapping
	this.lineBreaks = [];
	this.numLineBreaks = 0;

	//if tunewiki data has timings, modifys data structure and formats
	if (this.lyrics.response.lyric.line){
		this.lyricA = this.lyrics.response.lyric.line;
		this.CK = 0;					//currently key
		this.CL = 0;					//current line - line of lyrics currently being displayed
		this.CPM = .002;				//Chars per milisecound
		this.offset = 0;				//how much of a buffer to give 
		this.lineSpeed = [];			//array of WPM rate at each typed line
		this.lineSpeed[0] = 0;			//score starts at 0
		this.linesTyped = 0;			//number of lines typed so far	
		this.lineFinished = false;		//if the currently displayed line has been completely typed
		CC.font = "30pt Calibri";

		this.lyricLines =[];			//song lyrics, by line
		this.lyricTiming = [];			//time when line is played
		for (var i = 0; i < this.lyricA.length; i++) {
			this.lyricTiming.push(getTiming(this.lyricA[i]["@timing"]));		
			this.lyricLines.push(this.lyricA[i].value);
			this.lyricLines[i] = this.lyricLines[i][0].toUpperCase() 
			+ this.lyricLines[i].slice(1).toLowerCase();
		}
		this.lyricTiming.push(sp.trackPlayer.getNowPlayingTrack().length);

		if (this.lyricTiming.length>0 && this.lyricLines.length>0) {
			this.lyricsReady = true;	//program ready to display lyrics only if lyrics exist
		}

	}
	console.log(" trying to make lyrics for " + this.lyrics.response.title.value + " while "
		 + this.songName + " is playing");

	//some value from the tunewiki quary is missing - give up
	if (this.lyricsReady == false) {
		console.log("lyric construction failed")
		info("No Lyrics" + textboxLR +  "Click for Next Track");
		player.playing = true;
	}

	//called when a key is pressed
	this.compareToNext = function(key){
		if (!this.lineFinished && key == this.lyricLines[this.CL][this.CK]) {
			if (this.CK == this.lyricLines[this.CL].length || !this.lyricLines[this.CL][this.CK+1]) {
				this.lineFinishedCalc();
				this.CK = this.lyricLines[this.CL].length;
				this.lineFinished = true;
			}
			else {
				this.CK++;
			}
		}
	}
	
	//finds and updates typing speed. called when a line is completed, either by typing all the letter or time expiring
	 this.lineFinishedCalc = function() {
		timePosition = sp.trackPlayer.getNowPlayingTrack().position;
		this.CPM = Math.max(.002, (this.CK/(timePosition - this.lyricTiming[this.CL])));
		this.linesTyped++;
		this.lineSpeed[this.linesTyped] = this.CPM*3600*5.5;
		this.reDrawScore = true;
	}

	//called when a line time ends. finds how many lines need to be skipped to match typing speed
	this.findNewOffset = function (nextCL) {
		CC.clearRect(0, 0, xMax, yMax);			//clears canvas

		if (!this.lineFinished) {
			this.lineFinishedCalc();
		}	
		if (nextCL <this.lyricLines.length) {
			this.CL = nextCL;
		}

		var i = 0;
		while (i + this.CL < this.lyricLines.length - 1 && 
		this.lyricLines[this.CL].length/(this.lyricTiming[this.CL + i + 1] - this.lyricTiming[this.CL] ) > this.CPM ) {
			i++;
		}
		this.offset = i;
		this.CK = 0;
		this.lineFinished = false;
		this.findLineBreak(this.lyricLines[this.CL]);
	}
	
	//clears board and draws scores on the top
	this.drawScore = function() {
		CC.fillStyle = "black";
		var scoreString = "";
		
		//this.lineSpeed[1] = 0;
		document.getElementById("highScore").innerHTML = this.addZeros(this.highScore,5);
		document.getElementById("currentScore").innerHTML = this.addZeros(Math.round(this.lineSpeed.sum()),5);
		document.getElementById("currentWPM").innerHTML =  this.addZeros(Math.round(this.CPM*3600*5.5),3);
	}

	//adds zeros before score info to preserve spacing
	this.addZeros = function(num, numZeros) {
		num = num + "";
		while (num.length < numZeros ) {
			num = "0" + num;
		}
		return num;
	}

	//calculates where line breaks should go
	this.findLineBreak = function(text) {
		this.lineBreaks = [];
		this.numLineBreaks = 0;
		var currentLineLength = 0;
		var currentLineNumLetters = 0;
		var words = text.split(" ");
		for (var i=0; i<words.length; i++){
			currentLineLength += this.wordLength(words[i]);
			if (currentLineLength > xMax - 3*xOffSet){
				this.lineBreaks[currentLineNumLetters] = true;
				this.numLineBreaks++;
				currentLineLength = this.wordLength(words[i]);
				//currentLineNumLetters = 0;
			}	
		currentLineNumLetters += (words[i].length) + 1;
			
		}
	}

	// writes updated line positions and scores to it every 20 ms
	this.displayLyrics = function() {
		if (this.reDrawScore){
			this.drawScore();
			this.reDrawScore = false;
		}
		else {
			CC.clearRect(0, this.clear.yCord, xMax, this.clear.height);
		}

		//using current position, finds line currently being played
		var timePosition = sp.trackPlayer.getNowPlayingTrack().position;		
		var temp;
		for (var i = 0; this.lyricTiming[i] <= timePosition; i++)
		{
			temp = i;
		}
		if (!(this.CL <= temp && temp <= this.CL + this.offset)) {
			this.findNewOffset(temp);
		}
		
		//percentage of current line's length that has been completed 
		var scale = (timePosition-this.lyricTiming[this.CL])/(this.lyricTiming[this.CL+1+this.offset] - this.lyricTiming[this.CL]);

		//current line of lyrics
		var text = this.lyricLines[this.CL];

		var lineLength = xOffSet;
		var lineNum = 1;
		var lineHeight = CC.measureText("m").width*1.3;
		var scalableHeight = yMax-lineHeight*(this.numLineBreaks+1);
		for (var i = 0; i <this.lyricLines[this.CL].length; i++){
			CC.fillStyle = "green"
			if (i + 1 > this.CK){
				CC.fillStyle = "rgb(215, 91, 5)";
			}

			CC.fillText(text[i], lineLength, scalableHeight*scale + lineHeight*lineNum);

			//disable clearing for cool effect
			//CC.fillStyle = "black"
			//CC.fillText(text[i], lineLength, scalableHeight*scale + lineHeight*lineNum + 3);

			lineLength += CC.measureText(text[i]).width;
			if (this.lineBreaks[i+1]){
				lineLength = xOffSet;
				lineNum++;
			}
		}
		this.clear.yCord =  scalableHeight*scale;
		this.clear.height = lineHeight*lineNum;

		if (this.priorPosition > timePosition) {
			console.log("score not valid");
			this.validScore = false;
		}
	}
	
	this.wordLength = function(word) {
		var length = 0
		for (var i=0;i<word.length;i++){
			length += CC.measureText(word[i]).width;
		}
		return length;
	}

	//decrypts tunewiki timing values
	function getTiming(a){var c=function(c){for(var b="",a=c.length-1;a>=0;a--)b+=c.charAt(a);return b};if(a=="")return"0";var b;a=c(a);b=parseInt(a.substring(a.length-1,a.length));a=a.substring(0,a.length-1);a=a.substring(0,b)+c(a.substring(b+b,a.length));a=parseInt(a)/b+"";if(a=="NaN")a="0";return a}
	
	CC.clearRect(0, 0, xMax, yMax);
	//draws score  and finds linebreak first time song is loaded
	if (this.lyricsReady){
		this.drawScore();
		this.findLineBreak(this.lyricLines[this.CL]);
	}
}