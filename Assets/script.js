//var searchHistory = [];
var weatherAPIRootUrl = "https://api.openweathermap.org/data/2.5/weather";
//var APIKey = ;
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}";
var searchForm = document.getElementById("search-form");
var searchInput = document.getElementById("search-input");
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