var APIKey = "e74bf8be05c5eedb9d4a56d89339e903";

//TODO city variable should be whatever user inputs
var city = "London";

// AJAX call to find the city's co-ordinates
$.ajax({
  url: "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey,
  method: "GET"
}).then(function(response) {
    var cityLat = response[0].lat;
    var cityLon = response[0].lon;
    //AJAX call using the coordinates to get the forecast data
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey,
      method: "GET"
    }).then(function(response) {
      console.log(response);
      var todayArr = response.list[0];
      var cityName = response.city.name;
      var currentDate = todayArr.dt_txt;
      var currentIconCode = todayArr.weather[0].icon;
      var currentTemp = (todayArr.main.temp - 273.15).toFixed(1);
      var currentHum = todayArr.main.humidity;
      var currentWind = todayArr.wind.speed;
      var currentData = [cityName, currentDate, currentIconCode, currentTemp, currentHum, currentWind];
      for (var i=0; i<currentData.length; i++){
        var container = $('<p>');
        container.append(currentData[i]);
        $('#today').append(container);
      }

      getFiveDays(response);
    })

})

//function to retrieve the midday weather data for the next 5 days
function getFiveDays(dataArr) {
  for (var i=0; i<dataArr.list.length; i++){
    var date = dataArr.list[i].dt_txt;
    if (date.includes("12:00:00")){
      console.log(dataArr.list[i]);
    }
  }
}