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
    console.log(cityLat);
    console.log(cityLon);
    //AJAX call using the coordinates to get the forecast data
    $.ajax({
      url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey,
      method: "GET"
    }).then(function(response) {
      console.log(response);
    })

})
