var searchHistory = [];
var weatherAPIRootUrl = "https://api.openweathermap.org/data/2.5/weather";
//var APIKey = ;
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");

var todayContainer = document.querySelector('#search-form');
var forecastContainer = document.querySelector('#forecast');
var searchHistoryContainer = document.querySelector('#history');

//Add timezone plugins to day.js
//dayjs.extend(window.dayjs_plugin_utc);
//dayjs.extend(window.dayjs_plugin_timezone);


function renderSearchHistory(){
  searchHistoryContainer.innerHTML = '';

  //Start at end and count down to show recent at top
  for (var i = searchHistory.length -1; i>= 0; i--) {
    var btn = document.createElement('button');
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-controls', 'today forecast');
    btn.classList.add('history-btn', 'btn-history');

    //'data-search' allows access to city name when click handler is invoked
    btn.setAttribute('data-search', searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}


function appendToHistory(search) {
  //if there is no search term return the function
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);
  
  localStorage.setItem('search-history', JSON.stringify(searchHistory));
  renderSearchHistory();
}

//Display search history
function initSearchHistory() {
  var storedHistory = localStorage.getItem('search-history');
  if(storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

function searchCurrentWeather(city, weather) {
var date  = dayjs().format('M/D/YYYY');
//Store response data from fetch in variables
var tempF = weather.main.temp;
var windMph = weather.wind.speed;
var humidity = weather.maain.humidity;
var iconUrl = 'https://openweathermap.org/img/w/${weather.weather[0].icon}.png';
var iconDescription = weather.weather[0].description || weather[0].main;

var card = document.createElement('div');
var cardBody = document.createElement('div');
var heading = document.createElement('h2');
var weatherIcon = document.createElement('img');
var tempEl = document.createElement('p');
var windEl = document.createElement('p');
var humidityEl = document.createElement('p');

card.setAttribute('classs', 'card');
cardBody.setAttribute('class', 'card-body');
card.append(cardBody);

heading.setAttribute('class', 'h3 card-title');
tempEl.setAttribute('class', 'card-text'); 
humidityEl.setAttribute('class', 'card-text');

heading.textContent = `${city} (${date})`;
weatherIcon.setAttribute('src', iconUrl);
weatherIcon.setAttribute('alt', iconDescription);
weatherIcon.setAttribute('class', 'weather-img');
heading.append(weatherIcon);
tempEl.textContent = `Temperature: ${tempF}°F`;
windEl.textContent = `Wind: ${windMph} MPH`;
humidityEl.textContent = `Humidity: ${humidity}%`;
cardBody.append(heading, tempEl, windEl, humidityEl);

todayContainer.innerHTML = '';
todayContainer.append(card);
}

//Function to display forecast card
function renderForecastCard(forecast) {
  //variables for data from API
  var iconUrl = 'https://openweathermap.org/img/w/${weather.weather[0].icon}.png';
  var iconDescription = forecast.weather[0].description;
  var tempF = forecast.main.humidity;
  var windMph = forecast.wind.speed;

  //Card elements
  var col = document.createElement('div');
  var card = document.createElement('div');
  var cardBody = document.createElement('div');
  var cardTitle = document.createElement('h5');
  var weatherIcon = document.createElement('img');
  var tempEl = document.createElement('p');
  var windEl = document.createElement('p');
  var humidityEl = document.createElement('p');

  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);

  col.setAttribute('class', 'col-md');
  col.classList.add('five-day-card');
  card.setAttribute('class', 'card-body p-2');
  cardTitle.setAttribute('class', 'card-text');
  tempEl.setAttribute('class', 'card-text');
  windEl.setAttribute('class', 'card-text');
  humidityEl.setAttribute('class', 'card-text');

  //Add content to elements
  cardTitle.textContent = dayjs(forecast.dt_txt).format('M/D/YYYY');
  weatherIcon.setAttribute('src', iconUrl);
  weatherIcon.setAttribute('alt', iconDescription);
  tempEl.textContent = `Temperature: ${tempF} °F`;
  windEl.textContent = `Wind: ${windMph} MPH`;
  humidityEl.textContent = `Humidity: ${humidity} %`;

  forecastContainer.append(col);
}

// Function to log the search input value
function logMessage(event) {
    // Prevent the default form submission
    event.preventDefault();
    // Retrieve the input value
    var inputValue = searchInput.value.trim();
    // Log the message to the console
    console.log("You searched for: " + inputValue);
    //callback to search function (the one that does the fetch request). Include parameter "input value"
    searchCurrentWeather(inputValue);
  }



searchForm.addEventListener("submit", logMessage);
