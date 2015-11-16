var imageManager = function(imageCollection) {
	var images = {},
	totalComplete = 0,
	numOfImages = (function() {
		var image, total = 0;
		for (image in imageCollection) {
			if (!imageCollection.hasOwnProperty(image)) {
				continue;
			}
			total++;
		}
		return total;
	} ());

	return {
		load: function(callback) {
			var name;
			for (name in imageCollection) {
				if (!imageCollection.hasOwnProperty(name)) {
					continue;
				}

				(function(imageName) {
					var image = new Image();
					image.addEventListener("load", function() {
						images[imageName] = image;
						totalComplete++;

						if (totalComplete === numOfImages) { // We're done
							callback(images);
						}
					});

					image.src = imageCollection[imageName];

				} (name));
			}
		}
	};
};

