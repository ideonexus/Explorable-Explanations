var image = function(ctx, im, position) {
	var initialPos = {
		x: position.x,
		y: position.y
	},
	isHidden = false;

	return {
		initialPosition: function() {
			return initialPos;
		},
		position: function() {
			return position;
		},
		setPosition: function(x, y) {
			position.x = x;
			position.y = y;
		},
		draw: function() {
			if (!isHidden) {
				ctx.drawImage(im, position.x, position.y);
			}
		},
		width: function() {
			return im.width;
		},
		height: function() {
			return im.height;
		},
		show: function() {
			isHidden = false;
		},
		hide: function() {
			isHidden = true;
		}
	};
};

