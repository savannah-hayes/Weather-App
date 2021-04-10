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
  document.querySelector(
    "#date"
  ).innerHTML = `${day} ${currentTime} ${month} ${dateIndex}, ${year}`;

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
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector("#city").innerHTML = response.data.name;
  celsiusFeels = response.data.main.feels_like;
  document.querySelector("#feels-like").innerHTML = Math.round(celsiusFeels);
  document.querySelector("#temperature-description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#pressure").innerHTML = response.data.main.pressure;
  document.querySelector("#date").innerHTML = formatDate(
    new Date(),
    response.data.timezone
  );

  celsiusTemperature = response.data.main.temp;

  let forecastImage = document.querySelector(".weather-temperature");
  let weatherID = response.data.weather[0].id;
  if (weatherID >= 200 && weatherID < 300) {
    forecastImage.style.backgroundImage = "url(images/thunder.png)";
  } else if (weatherID >= 300 && weatherID < 500) {
    forecastImage.style.backgroundImage = "url(images/rain.png)";
  } else if (weatherID >= 500 && weatherID < 600) {
    forecastImage.style.backgroundImage = "url(images/rain.png)";
  } else if (weatherID >= 600 && weatherID < 700) {
    forecastImage.style.backgroundImage = "url(images/snow.png)";
  } else if (weatherID >= 700 && weatherID < 800) {
    forecastImage.style.backgroundImage = "url(images/fog.png)";
  } else if (weatherID === 800) {
    forecastImage.style.backgroundImage = "url(images/sunny.png)";
  } else if (weatherID === 801) {
    forecastImage.style.backgroundImage = "url(images/fewclouds.png)";
  } else if (weatherID === 802) {
    forecastImage.style.backgroundImage = "url(images/scattered.png)";
  } else if (weatherID === 803) {
    forecastImage.style.backgroundImage = "url(images/clouds.png)";
  } else if (weatherID === 804) {
    forecastImage.style.backgroundImage = "url(images/overcast.png)";
  }

  let longitude = response.data.coord.lon;
  let latitude = response.data.coord.lat;
  getForecast(latitude, longitude);
}

// recent city search buttons
function tokyo(event) {
  event.preventDefault();
  search("Tokyo");
}
document.querySelector("#tokyo-button").addEventListener("click", tokyo);

function sf(event) {
  event.preventDefault();
  search("San Francisco");
}
document.querySelector("#sf-button").addEventListener("click", sf);

function capetown(event) {
  event.preventDefault();
  search("Cape Town");
}
document.querySelector("#capetown-button").addEventListener("click", capetown);

function melbourne(event) {
  event.preventDefault();
  search("Melbourne, AU");
}
document
  .querySelector("#melbourne-button")
  .addEventListener("click", melbourne);

function saopaulo(event) {
  event.preventDefault();
  search("Sao paulo");
}
document.querySelector("#saopaulo-button").addEventListener("click", saopaulo);

function london(event) {
  event.preventDefault();
  search("London");
}
document.querySelector("#london-button").addEventListener("click", london);

// Convert fahrenheit to celsius
function displayCelsiusTemperature(event) {
  event.preventDefault();
  document.querySelector("#temperature").innerHTML = Math.round(
    celsiusTemperature
  );
  document.querySelector("#feels-like").innerHTML = Math.round(celsiusFeels);

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");

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

  fahrenheitFeels = (celsiusFeels * 9) / 5 + 32;
  document.querySelector("#feels-like").innerHTML = Math.round(fahrenheitFeels);

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
let celsiusFeels = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);

search("Stockholm");
