var searchHistory = [];
var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");
var rootEl = document.getElementById("root");
var forecastContainer = document.getElementById("forecast-container");
var searchedCity = document.getElementById("history");
var weatherIcon = document.getElementById("weather-icon");
var weatherForecastIcon = document.getElementById("weather-forecast-icon");
var cityName = searchInput;

var weatherAPIRootUrl = "https://api.openweathermap.org/data/2.5/weather";
var forecastAPIRootUrl = "https://api.openweathermap.org/data/2.5/forecast";
var APIKey = "&appid=d82bbecccc82c0f9568531048f1a15ce";
var units = "&units=imperial";
var iconRootUrl = "http://openweathermap.org/img/w/"
//var iconUrl = iconRootUrl + data.weather.icon +".png";



//Direct Geocoding > Coordinates by location name > API call
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}




// Function to log the search input value
function searchCity(event) {
  // Prevent the default form submission
  event.preventDefault();
  // Retrieve the input value
  var inputValue = cityName.value.trim();

  //don't search if search is empty
  if (inputValue == '') {
    return false;
  } else {

    getCurrentWeather(inputValue);
    getForecast(inputValue);
    addToHistory(inputValue);
    //resets form back to clear
    searchInput.value = '';
  }
}

function addToHistory() {

  //takes searchInput and creates a button
  var inputValue = cityName.value.trim();
  var cityHistory = document.createElement('button');
  cityHistory.setAttribute('id', 'city-history');
  cityHistory.classList.add('history-btn', 'btn-history');
  cityHistory.value = `${inputValue}`;
  cityHistory.textContent = `${inputValue}`;
  searchedCity.append(cityHistory);
  cityHistory.addEventListener("click", searchCityHistory);
}

//create function to search using cityHistory
function searchCityHistory(event) {
  //event.preventDefault();

  var city = event.target.value;
  //console.log(event.target.value);
  //console.log(city);
  //call on other functions using the event listener
  getCurrentWeather(city);
  getForecast(city);
}

function getCurrentWeather(city) {
  var url = weatherAPIRootUrl + "?q=" + city + APIKey + units
  // Log the message to the console
  console.log("You searched current weather for: " + city);

  //callback to search function (the one that does the fetch request). Include parameter "input value"
  //loadJSON(url, gotData);
  fetch(url)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log(data);
      //  for (var i = 0; i < data.length; i++) {    }
      todayWeather(data);
    })
}

function getForecast(city) {
  var forecastUrl = forecastAPIRootUrl + "?q=" + city + APIKey + units
  // Log the message to the console
  console.log("You searched forecast for: " + city);

  //callback to search function (the one that does the fetch request)

  fetch(forecastUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      //console.log(data);

      forecast(data);
    })
}

function todayWeather(data) {

  //delete previous  data
  rootEl.innerHTML = '';
  console.log(data)
  //Store response data from fetch in variables
  var tempF = data.main.temp;
  var wind = data.wind.speed;
  var humidity = data.main.humidity;

  //Create elements
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  tempEl.textContent = `Temperature: ${tempF}°F`;
  windEl.textContent = `Wind Speed: ${wind}`;
  humidityEl.textContent = `Humidity: ${humidity}%`;

  //make a card
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var heading = document.createElement('h2');
  heading.setAttribute('class', 'h3 card-title');
  card.setAttribute('classs', 'card');
  cardBody.setAttribute('class', 'card-body');
  var city = data.name;

  var date = dayjs().format("MMMM D");
  heading.textContent = `${city} ${date}`;

  //icon
  console.log("Today's weather icon is" + data.weather[0].icon);
  var iconUrl = iconRootUrl + data.weather[0].icon + ".png";
  var icon = document.createElement('img');
  icon.setAttribute('class', 'image');
  icon.setAttribute('src', `${iconUrl}`);

  //append
  rootEl.append(card)
  card.append(cardBody);
  cardBody.append(heading, icon, tempEl, windEl, humidityEl);

}

function forecast(data) {
  //delete previous  data
  forecastContainer.innerHTML = '';

  var startDt = dayjs().add(1, 'day').startOf('day').unix();
  var endDt = dayjs().add(6, 'day').startOf('day').unix();

  for (var i = 0; i < data.list.length; i++) {
    //returns only data that falls between one day after the current date and up to 5 days later
    if (data.list[i].dt >= startDt && data.list[i].dt < endDt) {
      //then returns only data captured at noon each day
      if (data.list[i].dt_txt.slice(11, 13) == "12") {

        //Store response data from fetch in variables
        console.log(data);
        console.log("The forecast icons include " + data.list[i].weather[0].icon);
        var iconUrl = iconRootUrl + data.list[i].weather[0].icon + ".png";
        var tempF = data.list[i].main.temp;
        var wind = data.list[i].wind.speed;
        var humidity = data.list[i].main.humidity;

        //Create elements to later add to rootEl
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');

        tempEl.setAttribute('class', 'card-text');
        windEl.setAttribute('class', 'card-text');
        humidityEl.setAttribute('class', 'card-text');

        tempEl.textContent = `Temperature: ${tempF}°F`;
        windEl.textContent = `Wind Speed: ${wind}`;
        humidityEl.textContent = `Humidity: ${humidity}%`;

        //make a card
        var card = document.createElement('div');
        var cardBody = document.createElement('div');
        var heading = document.createElement('h2');

        heading.setAttribute('class', 'h3 card-title');
        card.setAttribute('classs', 'card');
        cardBody.setAttribute('class', 'card-body');

        var date = dayjs().format("MMM D");
        heading.textContent = `${date}`;

        //icon
        var icon = document.createElement('img');
        icon.setAttribute('class', 'image');
        icon.setAttribute('src', `${iconUrl}`);

        //append
        forecastContainer.append(card)
        card.append(cardBody);
        cardBody.append(heading, icon, tempEl, windEl, humidityEl);

      }
    }
  }
}



searchForm.addEventListener("submit", searchCity);