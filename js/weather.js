$(function () {

	var coords = getLocation();
	getWeather(coords.lat,coords.lon,"metric");
  
  $('#myonoffswitch').change(
    function(){
        var units;
        if ($(this).is(':checked')) {
            units = 'metric';
        } else {
            units = 'imperial';
        }
        getWeather(coords.lat,coords.lon,units);
    });

	function getLocation() {
		var coords = {lat:"34.0500", lon:"-118.2500"};

		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(response) {
				coords.lat = response.coords.latitude;
				coords.lon = response.coords.longitude;
			});
		}
		return coords;
	}

	function getWeather(lat, lon, units) {
		var apiURL = "http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&units=" + units + "&APPID=6d8be793f1b3b9428b022e9db8e805dc";
		var tempUnitLabel;
    var windUnitLabel;
    var windSpeed;
		if (units === "metric") {
			tempUnitLabel = "°C";
      windUnitLabel = "Km/h.";
		} else {
			tempUnitLabel = "°F";
      windUnitLabel = "Mph";
		}

		$.get(apiURL, function(response) {
      $('.location').html(response.name+", "+response.sys.country);
      $('#description').html(capitalizeFirstLetter(response.weather[0].description));
      $('#picture').html("<img src='http://openweathermap.org/img/w/" + response.weather[0].icon + ".png'>");
      $('#temp').html(parseFloat((response.main.temp).toFixed(1))+" "+tempUnitLabel);
      windSpeed = units === 'metric' ? convertSpeed(response.wind.speed) : response.wind.speed;
      $('#windspeed').html(convertWindDirection(response.wind.deg)+ " " + windSpeed + " " + windUnitLabel);
      $('#humidity').html(response.main.humidity + "%");
      $('#pressure').html(convertPressure(response.main.pressure)+ " kPa");
      
      
      
		}, "jsonp");
	}

	function convertWindDirection(dir) {
		var rose = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
		var eightPoint = Math.floor(dir / 45);
		return rose[eightPoint];
	}
  
  function convertSpeed(speed) {
    return parseFloat((speed*3.6).toFixed(1));
  }

  function convertUTC(utc) {
  	var date = new Date(utc*1000);
  	var time = {hours:"",
  				minutes:""};
  	time.hours = date.getHours();
  	time.minutes = ("0" + date.getMinutes()).substr(-2);
  	return time;
  }
  function convertPressure(hpa) {
    return  parseFloat((hpa/10).toFixed(1));
  }
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
});