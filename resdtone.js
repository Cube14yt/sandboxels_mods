dependOn("minecraft.js", function () {
	elements.redstone_dust.category = "redstone",
		elements.redstone_dust.conduct = 1
}, true);

elements.daylight_sensor = {
	category: "redstone",
	color: "#57400c",
	conduct: 1,
	properties: {
		day_mode: true
	},
	tick: function (pixel) {
		for (var i = 0; i < adjacentCoords.length; i++) {
			var coords = adjacentCoords[i];
			var x = pixel.x + coords[0];
			var y = pixel.y + coords[1];
			let day_mode = pixel.day_mode
			if (!isEmpty(x, y, true) && day_mode == true) {
				var sensed = pixelMap[x][y];
				if (pixel.sense && sensed.element !== pixel.sense) continue;
				if (!sensed.charge && !sensed.chargeCD && (sensed.element == "light" || sensed.element == "laser" || sensed.element == "liquid_light")) {
					pixel.charge = 1;
					if (!pixel.chargeStart) pixel.chargeStart = pixelTicks;
					break;
				}
			}
			if (day_mode == false) {
				let sensed;
				if (!isEmpty(x, y, true)) {
					sensed = pixelMap[x][y];
				} else {
					sensed = { element: null }; // treat empty space as a non-light element
				}

				if (pixel.sense && sensed.element !== pixel.sense) continue;

				if (sensed.element == "light" && sensed.element == "laser" && sensed.element == "liquid_light") {
					pixel.charge = 0;
					if (!pixel.chargeStart) pixel.chargeStart = pixelTicks;
					break;
				}
			}

		}
		doDefaults(pixel);
	},
};

/* elements.daylight_sensor_editor = {
	onSelect: function () {
		var inp = prompt("Input daylight mode")
		mode = inp
	},
	tool: function (pixel) {
		if (mode !== null) {
			let linp = mode.toLowerCase();
			if (linp == "day" && pixel.day_mode == false) {
				pixel.day_mode = true
			}
			if (linp == "night"  && pixel.day_mode == true) {
				pixel.day_mode = false
			}
		}
	}
}
*/