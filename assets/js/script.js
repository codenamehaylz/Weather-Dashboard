var APIKey = "e74bf8be05c5eedb9d4a56d89339e903";

renderSearches();

//Click event for the search button
$("#search-button").on("click", function(event) {
  event.preventDefault();
  var city = $("#search-input").val();
  saveSearch(city);

  //API call to find the city's co-ordinates
  $.ajax({
    url: "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&limit=1&appid=" + APIKey,
    method: "GET"
  }).then(function(coordResponse) {
      var cityLat = coordResponse[0].lat;
      var cityLon = coordResponse[0].lon;
      //API calls using the coordinates to get the forecast data
      //for the current weather
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey,
        method: "GET"
      }).then(function(currentResponse) {
        getCurrentWeather(currentResponse);
      })
      //for the next five days
      $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey,
        method: "GET"
      }).then(function(fiveDayResponse) {
        getFiveDays(fiveDayResponse);
      })
  })
});

//Click event for the saved search buttons
$("#history").on("click", ".btn", function(event){
  $("#today").empty();
  $("#forecast").empty();
  var prevCity = $(event.target).text();
  $.ajax({
    url: "http://api.openweathermap.org/geo/1.0/direct?q=" + prevCity + "&limit=1&appid=" + APIKey,
    method: "GET"
  }).then(function(coordResponse) {
      var cityLat = coordResponse[0].lat;
      var cityLon = coordResponse[0].lon;
      //current weather
      $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey,
        method: "GET"
      }).then(function(currentResponse) {
        getCurrentWeather(currentResponse);
      })
      //next five days
      $.ajax({
        url: "http://api.openweathermap.org/data/2.5/forecast?lat=" + cityLat + "&lon=" + cityLon + "&appid=" + APIKey,
        method: "GET"
      }).then(function(fiveDayResponse) {
        getFiveDays(fiveDayResponse);
      })
  })
})


//----FUNCTIONS----

//function to display the current weather information
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
  $("#today").attr("style", "border:1px solid black; padding-left:10px")

  var currentData = [currentTemp, currentHum, currentWind];
  for (var i=0; i<currentData.length; i++){
    var currentContainer = $('<p>');
    currentContainer.append(currentData[i]);
    $("#today").append(currentContainer);
  }
}

//function to retrieve & display the midday weather data for the next 5 days
function getFiveDays(data) {
  var fiveDayArray = [];
  for (var i=0; i<data.list.length; i++){
    var date = data.list[i].dt_txt;
    if (date.includes("12:00:00")){
      fiveDayArray.push(data.list[i]);
    }
  }
  var title = $('<h3 class="col-lg-12">5 Day Forecast:</h3>');
  $("#forecast").append(title);

  fiveDayArray.forEach(function(day){
    var dayContainer = $('<div>');
    var date = moment.unix(day.dt).format("DD/MM/YYYY");
    var dateEl = $('<h4>');
    dateEl.text(date);
    dayContainer.append(dateEl);
    var dayIconID = day.weather[0].icon;
    var dayIconEl = $("<img src=" + weatherIcon(dayIconID) + ">");
    dayContainer.append(dayIconEl);
    var temp =  "Temp: " + (day.main.temp - 273.15).toFixed(1) + "°C";
    var humidity = "Humidity: " + day.main.humidity + "%";
    var wind = "Wind: " + day.wind.speed + " kph";
    var daysData = [temp, humidity, wind];
    for (var j=0; j<daysData.length; j++){
      var dayTextContainer = $('<p>');
      dayTextContainer.text(daysData[j]);
      dayContainer.append(dayTextContainer);
    }
    $("#forecast").append(dayContainer);
  })
}

//function to get weather icon image
function weatherIcon(ID) {
  var imgURL = "http://openweathermap.org/img/wn/" + ID + "@2x.png";
  return imgURL;
}

//TODO create if statements to check if city already in saved searches

//function for saving searches
function saveSearch(city){
  var search = city;
  var btn = $("<button>");
  btn.attr("class", "btn btn-secondary btn-block");
  btn.text(search);
  $("#history").append(btn);
  var savedSearches = JSON.parse(localStorage.getItem("searches")) || [];
  savedSearches.push(search);
  localStorage.setItem("searches", JSON.stringify(savedSearches));
  console.log(search);
}

//function to render saved searches onto the page
function renderSearches(){
  var savedSearches = JSON.parse(localStorage.getItem("searches"));
  if (savedSearches !== null){
    for (var i=0; i<savedSearches.length; i++){
      var btn = $("<button>");
      btn.attr("class", "btn btn-secondary btn-block");
      btn.text(savedSearches[i]);
      $("#history").append(btn);
    }
  }
}