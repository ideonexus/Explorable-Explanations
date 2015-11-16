var gameResult = function(utils, img) {
	var stopPosition = {
		x: utils.WIDTH / 2 - (img.width / 2),
		y: 130
	},
	startPos = {
		x: - img.width,
		y: 130
	},
	endPos = {
		x: utils.WIDTH + img.width,
		y: 130
	},
	im = image(utils.context, img, {
		x: - img.width,
		y: 130
	}),
	isEntering, isLeaving, lValue = 0;

	return {
		show: function() {
			im.show();
		},
		hide: function() {
			im.hide();
		},
		update: function() {
			var x = im.position().x, y = im.position().y;

			if (isEntering) {
				x = mathStuff.smoothstep(startPos.x, stopPosition.x, lValue);
				lValue += 0.1;
				if (lValue > 1) {
					lValue = 0;
					isEntering = false;
				}
			} else if (isLeaving) {
				x = mathStuff.smoothstep(stopPosition.x, endPos.x, lValue);
				lValue += 0.1;
				if (lValue > 1) {
					lValue = 0;
					x = startPos.x;
					isLeaving = false;
				}
			}

			im.setPosition(x, y);
		},
		draw: function() {
			im.draw();
		},
		enter: function() {
			isEntering = true;
		},
		leave: function() {
			isLeaving = true;
		}
	};
};

