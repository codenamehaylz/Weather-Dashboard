var APIKey = "e74bf8be05c5eedb9d4a56d89339e903";

//TODO city variable should be whatever user inputs
var city = "London";

// AJAX call to find the city's co-ordinates
$.ajax({
  url: "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey,
  method: "GET"
}).then(function(coordResponse) {
    var cityLat = coordResponse[0].lat;
    var cityLon = coordResponse[0].lon;
    //AJAX calls using the coordinates to get the forecast data
    //for the current weather
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey,
      method: "GET"
    }).then(function(currentResponse) {
      console.log(currentResponse);
      getCurrentWeather(currentResponse);
    })
    //for the next five days
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      getFiveDays(response);
    })

})

//TODO City name, date and icon should be on one line header
function getCurrentWeather(data) {
  var cityName = data.name;
  var currentDate = moment.unix(data.dt).format("(DD/MM/YYYY)");
  var currentIconID = data.weather[0].icon;
  var currentTemp =  "Temp: " + (data.main.temp - 273.15).toFixed(1) + "°C";
  var currentHum = "Humidity: " + data.main.humidity + "%";
  var currentWind = "Wind speed: " + data.wind.speed + " kph";

  var currentIconEl = $("<img src=" + weatherIcon(currentIconID) + " style='display:inline'>");

  var currentWeatherEl = $("<h2 style='display:inline'>");
  currentWeatherEl.text(cityName + ' ' + currentDate);
  $("#today").append(currentWeatherEl);
  $("#today").append(currentIconEl);

  var currentData = [currentTemp, currentHum, currentWind];
  for (var i=0; i<currentData.length; i++){
    var container = $('<p>');
    container.append(currentData[i]);
    $('#today').append(container);
  }
}

//function to retrieve the midday weather data for the next 5 days
function getFiveDays(data) {
  for (var i=0; i<data.list.length; i++){
    var date = data.list[i].dt_txt;
    if (date.includes("12:00:00")){
      console.log(data.list[i]);
    }
  }
}

//function to get weather icon image
function weatherIcon(ID) {
  var imgURL = "http://openweathermap.org/img/wn/" + ID + "@2x.png";
  return imgURL;
}