function displayTemperature(response) {
  let temperatureElemement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#temperature-description");
  let windElement = document.querySelector("#wind");
  let humidityElement = document.querySelector("#humidity");
  let pressureElement = document.querySelector("#pressure");
  temperatureElemement.innerHTML = Math.round(response.data.main.temp);
  cityElement.innerHTML = response.data.name;
  descriptionElement.innerHTML = response.data.weather[0].description;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  humidityElement.innerHTML = response.data.main.humidity;
  pressureElement.innerHTML = response.data.main.pressure;
  console.log(response.data);
}
let apiKey = "97a509323a282fbb09c0bc8556148a31";
let city = "New York";
let units = "metric";
let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
console.log(apiUrl);

axios.get(apiUrl).then(displayTemperature);
