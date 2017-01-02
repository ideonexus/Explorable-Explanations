// Requirements:
//
//  • Random letters appear in a containing <div> element, 1000px wide, at an interval of 1 second.
//
//  • Every 100 milliseconds, all the existing letters move right by 10px.
//
//  • Pressing a correct letter removes the oldest instance of that letter, and increases the score by 1 point.
//
//  • Pressing a letter that isn't on the page decreases the score by 1 point.
//
//  • Pressing Escape ends the game.
//
//  • If a letter gets all the way to the right-hand side of the container, the game is over.
//
//  • For every 20 letters that have been found, the interval of letter creation decreases by 10%.

var Game = {};

Game.initialize = function(letters, container_el, score_el, spacer_el, spacerWidth, letterWidth, containerWidth) {
  this.currentSpacerWidth = 0;
  this.spacerWidth = spacerWidth || 1; // requirements call for 10px, but I found that's way too much for a playable game
  this.letterWidth = letterWidth || 10;
  this.containerWidth = containerWidth || 1000;
  this.$container = container_el;
  this.$score = score_el;
  this.$spacer = spacer_el;
  this.letters = letters;
  this.score = 0;
  this.letterAccelerateByPercent = 0.10;
  this.letterAddSpeed = 1000; // milliseconds
  this.currentLetters = [];
  this.timerID = null; // set by startTimer()
  this.spacerTimerID = null; // set by spacerTimer()


  this.startTimer();
  this.spacerTimer();

  return this;
};

Game.checkIfLetterAddShouldAccelerate = function() {
  if (this.score != 0 && this.score % 20 == 0) {
    this.letterAddSpeed = this.letterAddSpeed - (this.letterAddSpeed * this.letterAccelerateByPercent);
    this.resetAddLetterTimer();
  }
};

Game.startTimer = function() {
  var that = this;
  this.timerID = setInterval(function(){
    that.checkIfAtEnd();
    that.checkIfLetterAddShouldAccelerate();

    that.appendLetter();
    that.lettersHTML();
    that.render();
  }, this.letterAddSpeed);
};

Game.resetAddLetterTimer = function() {
  clearInterval(this.timerID);
  this.startTimer();
};

Game.spacerTimer = function() {
  var that = this;
  this.spacerTimerID = setInterval(function(){
    that.checkIfAtEnd();

    that.currentSpacerWidth = that.currentSpacerWidth + that.spacerWidth;
    that.$spacer.width(that.currentSpacerWidth);
  }, 100);
};

Game.lettersHTML = function() {
  var html = "";
  $.each(this.currentLetters, function(k,v) {
    html += "<div class='letter'>" + v.toUpperCase() + "</div>";
  });
  return html;
};

Game.randomLetter = function() {
  var numberLimit = this.letters.length;
  var index = Math.floor((Math.random() * numberLimit) + 1);
  return this.letters[index - 1];
};

Game.render = function() {
  this.checkIfAtEnd();
  this.$container.html(this.lettersHTML());
  this.$score.html(this.score);
};

Game.appendLetter = function() {
  this.currentLetters.push(this.randomLetter());
};

Game.increaseScore = function() {
  this.score = this.score + 1;
};

Game.decreaseScore = function() {
  this.score = this.score - 1;
};

Game.stop = function() {
  clearInterval(this.timerID);
  clearInterval(this.spacerTimerID);
  this.trimFat();
};

Game.checkIfAtEnd = function() {
  if (this.letterWidth != 0 && this.containerWidth != 0) {
    var widthSum = this.currentLetters.length * this.letterWidth + this.currentSpacerWidth + this.spacerWidth;
    console.log(widthSum);

    if (widthSum >= this.containerWidth) {
      console.log("AT END");
      this.stop();
    }
  }
};

Game.removeFromCurrentLetters = function(character) {
  var letterIndex = $.inArray(character, this.currentLetters);
  if (letterIndex > -1) {
    this.currentLetters.splice(letterIndex, 1);
  }
};

Game.checkKey = function(key) {
  var character = String.fromCharCode(key.which).toLowerCase();
  console.log(character, this.currentLetters, $.inArray(character, this.currentLetters));
  if ($.inArray(character, this.currentLetters) > -1) {
    this.removeFromCurrentLetters(character);
    this.increaseScore();
  } else if ($.inArray(character, this.letters) > -1) {
    this.decreaseScore();
  } else {
    // noop
  }
};

Game.trimFat = function() {
  var widthSum = this.currentLetters.length * this.letterWidth + this.currentSpacerWidth + this.spacerWidth;
  if (widthSum > this.containerWidth) {
    this.currentSpacerWidth = this.containerWidth - (this.currentLetters.length * this.letterWidth);
    // adjust spacer width
    this.$spacer.width(this.currentSpacerWidth);
  }
};


// DOM READY

$(document).ready(function() {
  var lettersArray = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "u", "v", "x", "y", "z"];

  // START
  var game = Game.initialize(lettersArray, $("#container #letters"), $("#score"), $("#container #spacer"));

  $(window).on("keyup", function(event) {

    game.checkKey(event);

    if (event.which == 27)
      game.stop();
  });

  // DEBUG
  console.log(game.$container);
});
