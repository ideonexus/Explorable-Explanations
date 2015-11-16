var goat = function(ctx, position, goatImage) {
	var im = image(ctx, goatImage, position),
	isPeeking,
	lValue = 0;

	return {
		update: function() {
			if (isPeeking) {
				var y = mathStuff.smoothstep(im.initialPosition().y, im.initialPosition().y - 150, lValue);
				lValue += 0.05;
				if (lValue > 1) {
					lValue = 0;
					isPeeking = false;
				}
				im.setPosition(im.position().x, y);
			}
		},
		draw: function() {
			im.draw();
		},
		peek: function() {
			isPeeking = true;
		}
	};
};

