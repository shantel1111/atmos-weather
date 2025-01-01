async function fetchWeather() {
  let searchInput = document.getElementById("search").value;
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";
  const apiKey = "a02a7da6212ee6d0502bade0fce2c940"; // insert API key

  if (searchInput == "") {
    weatherDataSection.style.fontFamily = "Josefin Sans, sans-serif";
    weatherDataSection.innerHTML = `
    <div>
      <h2>Empty Input!</h2>
      <p>Please try again with a valid <u>city name</u>.</p>
    </div>
    `;
    return;
  }
  document.getElementById("search").value = "";
  const geocodeData = await getLonAndLat();
  getWeatherData(geocodeData.lon, geocodeData.lat);

  async function getLonAndLat() {
    const countryCode = 61;
    const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput.replace(
      " ",
      "%20"
    )},${countryCode}&limit=1&appid=${apiKey}`;

    const response = await fetch(geocodeURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();

    if (data.length == 0) {
      console.log("Something went wrong here.");
      weatherDataSection.style.fontFamily = "Josefin Sans, sans-serif";
      weatherDataSection.innerHTML = `
      <div>
        <h2>Invalid Input: "${searchInput}"</h2>
        <p>Please try again with a valid <u>city name</u>.</p>
      </div>
      `;
    } else {
      return data[0];
    }
  }

  async function getWeatherData(lon, lat) {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const response = await fetch(weatherURL);
    if (!response.ok) {
      console.log("Bad response! ", response.status);
      return;
    }

    const data = await response.json();

    weatherDataSection.style.display = "flex";
    weatherDataSection.style.fontFamily = "Josefin Sans, sans-serif";
    weatherDataSection.innerHTML = `
    <img src="https://openweathermap.org/img/wn/${
      data.weather[0].icon
    }.png" alt="${data.weather[0].description}" width="100" />
    <div>
      <h2>${data.name}</h2>
      <p><strong>Temperature:</strong> ${Math.round(
        data.main.temp - 273.15
      )}°C</p>
      <p><strong>Description:</strong> ${data.weather[0].description}</p>
      <p><strong>Low:</strong> ${Math.round(
        data.main.temp_min - 273.15
      )}°C <strong>High:</strong> ${Math.round(
      data.main.temp_max - 273.15
    )}°C</p>
    </div>
    `;
  }
}
