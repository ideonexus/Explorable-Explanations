var mathStuff = (function() {
	var lerp = function(from, to, w) {
		return from + (to - from) * w;
	};

	return {
		random: function (from, to) {
			return Math.floor(from + Math.random() * (to - from + 1));
		},
		lerp: lerp,
		cos: function(from, to, w) {
			return lerp(from, to, ( - Math.cos(Math.PI * w)));
		},
		smoothstep: function(from, to, w) {
			return lerp(from, to, (w * w) * (3 - 2 * w));
		}
	};
} ());

