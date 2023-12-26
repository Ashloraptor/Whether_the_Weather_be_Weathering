//var searchHistory = [];
var weatherAPIRootUrl = "https://api.openweathermap.org/data/2.5/weather";
//var APIKey = ;
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");
//Calls on DOM element
var rootEl = $('#root');
//Create a button from searched locations
var searchEl = $('<button/>');
//Put searched city name in button
searchEl.text('test');

//Append the search results button to the page
rootEl.append(searchEl);

// Function to log the search input value
function searchCurrentWeather(city) {

}
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
