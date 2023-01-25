// Link to API key 
var APIKey = "";

var city = "London";

// The URL for the query response
var queryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=5&appid=" + APIKey;

// AJAX call
$.ajax({
  url: queryURL,
  method: "GET"
}).then(function(response) {
    console.log(response);
})