$(document).ready(function() {

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
	}

	var getLocationIP = function() {
		$.get("http://ip-api.com/json", function(data) {
			showData(data.lat, data.lon);
		});
	}

	var showData = function(lat, lon) {
		$.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon, function(data) {
			console.log("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon);
			temp.fahrenheit = Math.round((data.main.temp * 9 / 5 - 459.67) * 100) / 100;
			temp.celsius = Math.round((data.main.temp - 273.15) * 100) / 100;
			temp_min.fahrenheit = Math.round((data.main.temp_min * 9 / 5 - 459.67) * 100) / 100;
			temp_min.celsius = Math.round((data.main.temp_min - 273.15) * 100) / 100;
			temp_max.fahrenheit = Math.round((data.main.temp_max * 9 / 5 - 459.67) * 100) / 100;
			temp_max.celsius = Math.round((data.main.temp_max - 273.15) * 100) / 100;
			wind_speed.miles = data.wind.speed;
			wind_speed.km = Math.round((data.wind.speed * 1.609344) * 100) / 100;
			$("header h2 span").text(data.name + ", " + data.sys.country);
			$("#temp-now").text(temp.fahrenheit);
			$("#temp-min").text(temp_min.fahrenheit);
			$("#temp-max").text(temp_max.fahrenheit);
			$("#weather-now").text(data.weather[0].description);
			$("#humidity").text(data.main.humidity);
			$("#pressure").text(data.main.pressure);
			$("#wind-speed").text(wind_speed.miles);
			$("#weather-icon").attr("src", "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png");
		});
	}

	var temp = {};
	var temp_min = {};
	var temp_max = {};
	var wind_speed = {};

	getLocation();

	$("#celsius").click(function() {
		$("#temp-now").text(temp.celsius);
		$("#temp-min").text(temp_min.celsius);
		$("#temp-max").text(temp_max.celsius);
		$(".temp-units").text("C");
		$("#fahrenheit").removeClass("active").addClass("inactive");
		$("#celsius").removeClass("inactive").addClass("active");
	});

	$("#fahrenheit").click(function() {
		$("#temp-now").text(temp.fahrenheit);
		$("#temp-min").text(temp_min.fahrenheit);
		$("#temp-max").text(temp_max.fahrenheit);
		$(".temp-units").text("F");
		$("#celsius").removeClass("active").addClass("inactive");
		$("#fahrenheit").removeClass("inactive").addClass("active");
	});

	$("#kph").click(function() {
		$("#wind-speed").text(wind_speed.km);
		$("#speed-units").text("kph");
		$("#mph").removeClass("active").addClass("inactive");
		$("#kph").removeClass("inactive").addClass("active");
	});

	$("#mph").click(function() {
		$("#wind-speed").text(wind_speed.miles);
		$("#speed-units").text("mph");
		$("#kph").removeClass("active").addClass("inactive");
		$("#mph").removeClass("inactive").addClass("active");
	});
	
})