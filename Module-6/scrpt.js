$(function () {
    // Get DOM elements
    const searchForm = document.getElementById('search-form');
    const cityInput = document.getElementById('city-input');
    const currentWeatherDetails = document.getElementById('current-weather-details');
    const forecastDetails = document.getElementById('forecast-details');
    const historyList = document.getElementById('history-list');
  
    // Load search history from localStorage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  
    // Display search history
    displaySearchHistory();
  
    // Handle form submission
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      const city = cityInput.value.trim();
  
      if (city !== '') {
        // Clear input field
        cityInput.value = '';
  
        // Fetch weather data for the city
        getWeatherData(city)
          .then(function (data) {
            // Update UI with current weather and forecast details
            displayCurrentWeather(data.current);
            displayForecast(data.forecast);
  
            // Add city to search history
            addCityToHistory(city);
          })
          .catch(function (error) {
            console.log('Error:', error);
            alert('Error fetching weather data. Please try again.');
          });
      }
    });
  
    // Handle click on search history item
    historyList.addEventListener('click', function (event) {
      if (event.target.classList.contains('search-history-item')) {
        const city = event.target.textContent;
        cityInput.value = city;
  
        // Trigger form submission
        searchForm.dispatchEvent(new Event('submit'));
      }
    });
  
    // Function to fetch weather data for a city from the API
    function getWeatherData(city) {
      const apiKey = '6d5c4c3934833e43bd02b86697510df7'; // Replace with your OpenWeatherMap API key
      const apiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid=${apiKey}`;
  
      // Fetch the weather data
      return fetch(apiUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then(function (data) {
          // Extract and format the current weather and forecast data
          const currentWeather = formatCurrentWeather(data.current);
          const forecast = formatForecast(data);
  
          // Return the formatted weather data
          return { current: currentWeather, forecast: forecast };
        });
    }
  
    // Function to format the forecast data
    function formatForecast(data) {
      // Extract relevant data from the API response
      const forecastList = data.list.slice(1, 6);
  
      // Create an array of formatted forecast data
      const forecast = forecastList.map(function (item) {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const icon = item.weather[0].icon;
        const temperature = Math.round(item.main.temp - 273.15);
        const humidity = item.main.humidity;
  
        // Return the formatted forecast item
        return {
          date: date,
          icon: icon,
          temperature: temperature,
          humidity: humidity,
        };
      });
  
      return forecast;
    }
  
  }); // Closing brace for $(function() {})
  
