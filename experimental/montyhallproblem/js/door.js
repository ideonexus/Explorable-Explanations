var boundingBox = function(pos, width, height) {
	return {
		isInBox: function(x, y) {
			return (x >= pos.x && y >= pos.y) && (x <= pos.x + width && y <= pos.y + height);
		}
	};
};

var door = function(id, utils, position, imageList) {
	var openImage = image(utils.context, imageList.opendoor, position),
	closedImage = image(utils.context, imageList.closeddoor, position),
	selectedClosedImage = image(utils.context, imageList.selectedcloseddoor, position),
	selectedOpenImage = image(utils.context, imageList.selectedopendoor, position),
	state = closedImage,
	bounds,
	open = function() {
		isOpened = true;
		state = isSelected ? selectedOpenImage : openImage;
	},
	close = function() {
		isOpened = false;
		state = closedImage;
	},
	isSelected,
	isOpened;

	bounds = boundingBox(position, closedImage.width(), closedImage.height());

	return {
		id: function() {
			return id;
		},
		open: open,
		close: close,
		toggle: function() {
			state === openImage ? close() : open();
		},
		select: function() {
			state = selectedClosedImage;
			isSelected = true;
		},
		draw: function() {
			state.draw();
		},
		isMouseOver: function(mouseX, mouseY) {
			return bounds.isInBox(mouseX, mouseY);
		},
		spawnGoat: function() {
			return goat(utils.context, {
				x: position.x,
				y: position.y + closedImage.height()
			},
			imageList.goat);
		},
		spawnCar: function() {
			return car(utils.context, {
				x: position.x + closedImage.width(),
				y: position.y + closedImage.height() - imageList.car.height
			},
			imageList.car);
		},
		isSelected: function() {
			return isSelected;
		},
		isOpened: function() {
			return isOpened;
		},
		reset: function() {
			close();
			isSelected = false;
		}
	};
};

