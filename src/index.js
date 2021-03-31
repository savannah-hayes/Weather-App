// Date and Hour functions
function formatDate(date, timezone) {
  let localOffsetInMs = date.getTimezoneOffset() * 60 * 1000;
  let targetOffsetInMs = timezone * 1000;
  let targetTimestamp = date.getTime() + localOffsetInMs + targetOffsetInMs;

  let localDate = new Date(targetTimestamp);

  let dayIndex = localDate.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[dayIndex];

  let monthIndex = localDate.getMonth();
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let month = months[monthIndex];
  let dateIndex = localDate.getDate();
  let year = localDate.getFullYear();

  let hours = localDate.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = localDate.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentTime = `${hours}:${minutes}`;
  let dateElement = document.querySelector("#date");
  dateElement.innerHTML = `${day} ${currentTime} ${month} ${dateIndex}, ${year}`;

  let formattedDate = `${day} ${currentTime} <br/>
  ${month} ${dateIndex}, ${year}`;

  return formattedDate;
}

// Diaplay weather
function displayTemperature(response) {
  let temperatureElemement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let countryElement = response.data.sys.country;
  let feelsLikeElement = document.querySelector("#feels-like");
  let descriptionElement = document.querySelector("#temperature-description");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let pressureElement = document.querySelector("#pressure");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");
  temperatureElemement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = `${response.data.name}, <br/> ${countryElement}`;
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);
  descriptionElement.innerHTML = response.data.weather[0].description;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  pressureElement.innerHTML = response.data.main.pressure;
  dateElement.innerHTML = formatDate(new Date(), response.data.timezone);
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  celsiusTemperature = response.data.main.temp;
}

function formatHours(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];

    forecastElement.innerHTML += `<div class="col-2">
    <h3>${formatHours(forecast.dt * 1000)}</h3>
    <img src= "http://openweathermap.org/img/wn/${
      forecast.weather[0].icon
    }@2x.png"/>
    <div class="weather-forecast-temperature"><br/> 
    <strong><span id="forecast-max">H: ${Math.round(
      forecast.main.temp_max
    )}</span>°</strong> <span id="forecast-min">L: ${Math.round(
      forecast.main.temp_min
    )}</span>°
    </div>
    </div> `;
  }
}

function search(city) {
  let apiKey = "97a509323a282fbb09c0bc8556148a31";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayTemperature);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

// recent city search buttons
function sanFrancisco(event) {
  event.preventDefault();
  search("San Francisco");
}
let sfButton = document.querySelector("#sf-button");
sfButton.addEventListener("click", sanFrancisco);

function tokyo(event) {
  event.preventDefault();
  search("Tokyo");
}
let tokyoButton = document.querySelector("#tokyo-button");
tokyoButton.addEventListener("click", tokyo);

function melbourne(event) {
  event.preventDefault();
  search("Melbourne");
}
let melbourneButton = document.querySelector("#melbourne-button");
melbourneButton.addEventListener("click", melbourne);

function paris(event) {
  event.preventDefault();
  search("Paris");
}
let parisButton = document.querySelector("#paris-button");
parisButton.addEventListener("click", paris);

function sãoPaulo(event) {
  event.preventDefault();
  search("São Paulo");
}
let saoButton = document.querySelector("#sao-button");
saoButton.addEventListener("click", sãoPaulo);

function lisbon(event) {
  event.preventDefault();
  search("Lisbon");
}
let lisbonButton = document.querySelector("#lisbon-button");
lisbonButton.addEventListener("click", lisbon);

// form
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

// Temperature Conversions
function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElemement = document.querySelector("#temperature");
  temperatureElemement.innerHTML = Math.round(celsiusTemperature);

  celsiusLink.removeEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
}

function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElemement = document.querySelector("#temperature");
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElemement.innerHTML = Math.round(fahrenheitTemperature);

  celsiusLink.addEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.removeEventListener("click", displayFahrenheitTemperature);
}

// Event Listeners
let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search("New York");
