var car = function(ctx, position, carImage) {
	var im = image(ctx, carImage, position),
	isDriving,
	lValue = 0;

	return {
		update: function() {
			if (isDriving) {
				var x = mathStuff.smoothstep(im.initialPosition().x, im.initialPosition().x - im.width(), lValue);
				lValue += 0.03;
				if (lValue > 1) {
					lValue = 0;
					isDriving = false;
				}
				im.setPosition(x, im.position().y);
			}
		},
		draw: function() {
			im.draw();
		},
		drive: function() {
			isDriving = true;
		}
	};
};


