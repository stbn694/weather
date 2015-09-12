$(document).ready(function() {

	var temp = {};
	var temp_min = {};
	var temp_max = {};
	var wind_speed = {};
	var wind_direction = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
	var backgrounds = {
		1: "http://cdn.desktopwallpapers4.me/wallpapers/digital-art/1920x1200/2/11543-grass-under-clear-sky-1920x1200-digital-art-wallpaper.jpg",
		2: "http://cdn2.landscapehdwalls.com/wallpapers/1/sunny-field-415-2560x1600.jpg",
		3: "http://cloud-maven.com/wp-content/uploads/2013/02/DSC05619.jpg",
		4: "http://api.ning.com/files/qEtmLLcXiWh5hyBkTw0SveroaUt75SKWW6GG-RVyxReU9zhC6FKpK8*-GKx7f8ws1f1v-2CSmVX7vf2CyBytkpeqXggJ66t3/DSC01458.JPG",
		9: "https://c2.staticflickr.com/8/7393/11375147803_0f453d8676_b.jpg",
		10: "http://s.w-x.co/56a3d494-ae4e-48be-a657-43197dac5401.jpg",
		11: "http://www.feardoche.com/wp-content/uploads/2015/04/finished-storm1.jpg",
		13: "https://emsnews.files.wordpress.com/2014/02/screen-shot-2014-02-14-at-6-53-52-am.png",
		50: "https://theplastichippo.files.wordpress.com/2011/02/mist.jpg"
	};

	var changeTempUnits = function(unit) {
		$("#temp-now").text(temp[unit]);
		$("#temp-min").text(temp_min[unit]);
		$("#temp-max").text(temp_max[unit]);
		$(".temp-units").text("º" + unit[0].toUpperCase());
		$(".temp .card-conf p[id!='" + unit + "']").removeClass("active").addClass("inactive");
		$("#" + unit).removeClass("inactive").addClass("active");
		if (typeof(localStorage) !== "undefined") {
			localStorage.tempUnits = unit;
		}
	};

	var changeSpeedUnits = function(unit) {
		$("#wind-speed").text(wind_speed[unit]);
		if (unit == "mps") {
			$("#speed-units").text("m/s");
		} else {
			$("#speed-units").text("mph");
		}
		$(".wind .card-conf p[id!='" + unit + "']").removeClass("active").addClass("inactive");
		$("#" + unit).removeClass("inactive").addClass("active");
		if (typeof(localStorage) !== "undefined") {
			localStorage.speedUnits = unit;
		}
	};

	var getWindDirection = function(degrees) {
		var direction = Math.round(degrees / 360 * wind_direction.length) % wind_direction.length;
		$("#wind-dir").text(wind_direction[direction]);
	};

	var setBackgroundImage = function(code) {
		var codeNum = parseInt(code.substr(0, 2));
		$("body").css("background-image", "url(" + backgrounds[codeNum] + ")");
	};

	var getLocation = function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				showData(position.coords.latitude, position.coords.longitude);
			},
			function(error) {
				if (error.code == error.PERMISSION_DENIED) {
					getLocationIP();
				}
			});
		} else {
			getLocationIP();
		}
	};

	var getLocationIP = function() {
		$.get("http://ip-api.com/json", function(data) {
			showData(data.lat, data.lon);
		});
	};

	var showData = function(lat, lon) {
		$.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon, function(data) {
			console.log("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon);
			temp.fahrenheit = Math.round((data.main.temp * 9 / 5 - 459.67) * 100) / 100;
			temp.celsius = Math.round((data.main.temp - 273.15) * 100) / 100;
			temp_min.fahrenheit = Math.round((data.main.temp_min * 9 / 5 - 459.67) * 100) / 100;
			temp_min.celsius = Math.round((data.main.temp_min - 273.15) * 100) / 100;
			temp_max.fahrenheit = Math.round((data.main.temp_max * 9 / 5 - 459.67) * 100) / 100;
			temp_max.celsius = Math.round((data.main.temp_max - 273.15) * 100) / 100;
			wind_speed.mps = data.wind.speed;
			wind_speed.mph = Math.round((data.wind.speed * 3600 / 1609.344) * 100) / 100;

			$("header h2 span").text(data.name + ", " + data.sys.country);
			$("#weather-now").text(data.weather[0].description);
			$("#humidity").text(data.main.humidity);
			$("#pressure").text(data.main.pressure);
			$("#weather-icon").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");

			setBackgroundImage(data.weather[0].icon);
			getWindDirection(data.wind.deg);

			if (typeof(localStorage) !== "undefined") {
				if (localStorage.tempUnits) {
					changeTempUnits(localStorage.tempUnits);
				} else {
					changeTempUnits("celsius");
				}

				if (localStorage.speedUnits) {
					changeSpeedUnits(localStorage.speedUnits);
				} else {
					changeSpeedUnits("mps");
				}
			} else {
				changeTempUnits("celsius");
				changeSpeedUnits("mps");
			}
		});
	};


	getLocation();

	$("#celsius").click(function() {
		changeTempUnits("celsius");
	});

	$("#fahrenheit").click(function() {
		changeTempUnits("fahrenheit");
	});

	$("#mps").click(function() {
		changeSpeedUnits("mps");
	});

	$("#mph").click(function() {
		changeSpeedUnits("mph");
	});
	
});