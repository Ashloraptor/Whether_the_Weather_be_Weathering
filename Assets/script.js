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


function renderSearchHistory() {
  searchHistoryContainer.innerHTML = '';

  //Start at end and count down to show recent at top
  for (var i = searchHistory.length - 1; i >= 0; i--) {
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
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}

function searchCurrentWeather(city, weather) {
  var date = dayjs().format('M/D/YYYY');
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

function renderForecast(dailyForecast) {
  //create unix timestamps for start and end of 5 day forecast
  var startDt = dayjs().add(1, 'day').startOf('day').unix();
  var endDt = dayjs().add(6, 'day').startOf('day').unix();

  var headingCol = document.createElement('div');
  var heading = document.crerateE('h4');

  headingCol.setAttribute('class', 'col-12');
  heading.textContent = '5-Day Forecast:';
  headingCol.append(heading);

  forecastContainer.innerHTML = '';
  forecastContainer.append(headingCol);

  for (var i = 0; i < dailyForecast.length; i++) {
    //returns data between one day after current data and up to 5 days later
    if (dailyForecast[i].dt >= startDt && dailyForecast[i].dt < endDt) {

      //returns only data captured at noon each day
      if (dailyForecast[i].dt_txt.slice(11, 13) == "12") {
        renderForecastCard(dailyForecast[i]);
      }
    }
  }

}

function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0], data.city.timezone);
  renderForecast(data.list);
}

function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.hostname;
//apiKey still needs to be included
  var apiUrl = `${weatherAPIRootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;

  fetch(apiUrl)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    renderItems(city, data);
  })
  .catch(function (err) {
    console.error(err);
  })
}

function fetchCoords(search) {
  var apiUrl = `${weatherAPIRootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;

  fetch(apiUrl)
  .then(function (res) {
    return res.json();
  })
  .then(function (data) {
    if (!data[0]) {
      alert('Location not found');
    } else {
      appendToHistory(search);
      fetchWeather(data[0]);
    }
  })
  .catch(function (err) {
    console.error(err);
  })
}


//handleSearchFormSubmit
// Function to log the search input value
function logMessage(event) {
  // Prevent the default form submission
  event.preventDefault();
  // Retrieve the input value
  var inputValue = searchInput.value.trim();
  // Log the message to the console
  console.log("You searched for: " + inputValue);

  fetchCoords(inputValue);
  searchInput.value = '';
  //callback to search function (the one that does the fetch request). Include parameter "input value"
  //my line
  //searchCurrentWeather(inputValue);
}

function handleSearchHistoryClick(event) {
  //don't do search if current elements is not a search history button
  if (!event.target.matches('.btn-history')) {
    return;
  } 

  var btn = e.target;
  var search = btn.getAttribute('data-search');
  fetchCoords(search);
}

initSearchHistory();

searchForm.addEventListener("submit", logMessage);
searchHistoryContainer.addEventListener('click', handleSearchHistoryClick);