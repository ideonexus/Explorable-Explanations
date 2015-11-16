var question = function(utils, imageList) {
	var questionImage = image(utils.context, imageList.switchquestion, {
		x: utils.WIDTH / 2 - imageList.switchquestion.width / 2,
		y: 140
	}),
	noAnswerImage = image(utils.context, imageList.noanswer, {
		x: 680,
		y: 139
	}),
	yesAnswerImage = image(utils.context, imageList.yesanswer, {
		x: 676,
		y: 137
	}),
	imageStates = {
		question: 0x1,
		no: 0x2,
		yes: 0x4
	},
	whatToDisplay = 0;

	return {
		show: function() {
			whatToDisplay |= imageStates.question;
		},
		hide: function() {
			whatToDisplay &= ~imageStates.question;
		},
		update: function() {

		},
		draw: function() {
			if (whatToDisplay & imageStates.question) {
				questionImage.draw();
			}

			if (whatToDisplay & imageStates.no) {
				noAnswerImage.draw();
			} else if (whatToDisplay & imageStates.yes) {
				yesAnswerImage.draw();
			}
		},
		showNoAnswer: function() {
			whatToDisplay |= imageStates.no;
			whatToDisplay &= ~imageStates.yes;
		},
		showYesAnswer: function() {
			whatToDisplay |= imageStates.yes;
			whatToDisplay &= ~imageStates.no;
		},
		hideAnswers: function() {
			whatToDisplay &= ~imageStates.yes;
			whatToDisplay &= ~imageStates.no;
		}
	};
};

