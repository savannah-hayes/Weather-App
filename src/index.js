// Local Date and Hour
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
  let currentHour = `${hours}:${minutes}`;

  return currentHour;
}

function formatDay(timestamp) {
  let date = new Date(timestamp);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function search(city) {
  let apiKey = "97a509323a282fbb09c0bc8556148a31";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeatherCondition);

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

  celsiusLink.removeEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
}

// form
function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 1; index < 7; index++) {
    forecast = response.data.daily[index];

    // Forecast icon
    let weatherID = forecast.weather[0].id;
    let icon = "";

    if (weatherID >= 200 && weatherID < 300) {
      // weather: thunderstorm
      icon = `<i class="fas fa-bolt"></i>`;
    } else if (weatherID >= 300 && weatherID < 500) {
      // weather: drizzle
      icon = `<i class="fas fa-cloud-showers-heavy"></i>`;
    } else if (weatherID <= 500 && weatherID < 600) {
      // weather: rain
      icon = `<i class="fas fa-cloud-rain"></i>`;
    } else if (weatherID <= 600 && weatherID < 700) {
      // weather: snow
      icon = `<i class="far fa-snowflake"></i>`;
    } else if (weatherID <= 700 && weatherID < 800) {
      // weather: atmosphere
      icon = `<i class="fas fa-smog"></i>`;
    } else if (weatherID === 800) {
      // weather: clear
      icon = `<i class="fas fa-sun"></i>`;
    } else if (weatherID >= 800) {
      // weather: clouds
      icon = `<i class="fas fa-cloud"></i>`;
    }

    forecastElement.innerHTML += `
      <div class="col-2">
        <div class="weather-forecast-date">${formatDay(
          forecast.dt * 1000
        )}</div>
        <div class="forecast-icon">${icon}</div>
        <div class="weather-forecast-temperatures">
          <span class="weather-forecast-temperature-max">${Math.round(
            forecast.temp.max
          )}</span>°
          <span class="weather-forecast-temperature-min">${Math.round(
            forecast.temp.min
          )}</span>°
        </div>
      </div>`;
  }
}

function getForecast(latitude, longitude) {
  let apiKey = "97a509323a282fbb09c0bc8556148a31";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

// Display temperature, time, date and descriptions
function displayWeatherCondition(response) {
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

  celsiusTemperature = response.data.main.temp;

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

  let forecastImage = document.querySelector(".weather-temperature");
  let weatherID = response.data.weather[0].id;
  if (weatherID >= 200 && weatherID < 300) {
    forecastImage.style.backgroundImage = "url(images/thunder.png)";
  } else if (weatherID >= 300 && weatherID < 500) {
    forecastImage.style.backgroundImage = "url(images/drizzle.png)";
  } else if (weatherID >= 500 && weatherID < 600) {
    forecastImage.style.backgroundImage = "url(images/rain.png)";
  } else if (weatherID >= 600 && weatherID < 700) {
    forecastImage.style.backgroundImage = "url(images/snow.png)";
  } else if (weatherID >= 700 && weatherID < 800) {
    forecastImage.style.backgroundImage = "url(image/haze.png)";
  } else if (weatherID === 800) {
    forecastImage.style.backgroundImage = "url(images/clear.png)";
  } else if (weatherID >= 800) {
    forecastImage.style.backgroundImage = "url(images/cloudy.png)";
  }

  let longitude = response.data.coord.lon;
  let latitude = response.data.coord.lat;
  getForecast(latitude, longitude);
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
  search("Melbourne, Au");
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

// Convert fahrenheit to celsius
function displayCelsiusTemperature(event) {
  event.preventDefault();
  let temperatureElemement = document.querySelector("#temperature");

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  temperatureElemement.innerHTML = Math.round(celsiusTemperature);

  convertForecastTemp("celsius");

  celsiusLink.removeEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
}

// convert celsius to fahrenheit
function displayFahrenheitTemperature(event) {
  event.preventDefault();
  let temperatureElemement = document.querySelector("#temperature");

  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = Math.round(celsiusTemperature * (9 / 5) + 32);
  temperatureElemement.innerHTML = Math.round(fahrenheitTemperature);

  convertForecastTemp("fahrenheit");

  celsiusLink.addEventListener("click", displayCelsiusTemperature);
  fahrenheitLink.removeEventListener("click", displayFahrenheitTemperature);
}

// Convert forecast max and min temp
function convertForecastTemp(unit) {
  let forecastMax = document.querySelectorAll(
    ".weather-forecast-temperature-max"
  );
  let forecastMin = document.querySelectorAll(
    ".weather-forecast-temperature-min"
  );

  if (unit === "celsius") {
    forecastMax.forEach(function (temperature) {
      let currentTemp = temperature.innerHTML;
      temperature.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
    forecastMin.forEach(function (temperature) {
      let currentTemp = temperature.innerHTML;
      temperature.innerHTML = Math.round(((currentTemp - 32) * 5) / 9);
    });
  } else {
    forecastMax.forEach(function (temperature) {
      let currentTemp = temperature.innerHTML;
      temperature.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
    forecastMin.forEach(function (temperature) {
      let currentTemp = temperature.innerHTML;
      temperature.innerHTML = Math.round((currentTemp * 9) / 5 + 32);
    });
  }
}

// Event Listeners
let celsiusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search("Stockholm");
