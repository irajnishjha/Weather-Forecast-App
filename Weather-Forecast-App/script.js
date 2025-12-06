// 🔑 IMPORTANT: Put your own OpenWeather API key here
const apiKey = "ba49b0ebd03dd496854f2123d3bf0407";

const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

// DOM ELEMENTS
const locationInput = document.getElementById("locationInput");
const searchButton = document.getElementById("searchButton");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const descriptionElement = document.getElementById("description");
const humidityElement = document.getElementById("humidity");
const windElement = document.getElementById("wind");
const feelsLikeElement = document.getElementById("feels-like");
const visibilityElement = document.getElementById("visibility");
const pressureElement = document.getElementById("pressure");
const sunCycleElement = document.getElementById("sun-cycle");
const statusMessage = document.getElementById("p1");
const loader = document.getElementById("loader");
const weatherIconElement = document.getElementById("weather-icon");
const forecastContainer = document.getElementById("forecast-container");
const fadeTarget = document.querySelector(".fade-target");
const darkModeToggle = document.getElementById("darkModeToggle");

// STATUS HANDLER
function setStatus({ loading = false, message = "" } = {}) {
    if (loading) {
        loader.classList.remove("hidden");
    } else {
        loader.classList.add("hidden");
    }
    statusMessage.textContent = message;
}

// TEMPERATURE COUNT-UP ANIMATION
function animateNumber(el, from, to, suffix = "", duration = 600) {
    const startTime = performance.now();
    const frame = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const current = Math.round(from + (to - from) * progress);
        el.textContent = `Temperature: ${current}°C${suffix}`;
        if (progress < 1) {
            requestAnimationFrame(frame);
        }
    };
    requestAnimationFrame(frame);
}

// ACCENT COLOR BASED ON WEATHER CONDITION
function setAccentByCondition(condition) {
    let color;
    switch (condition) {
        case "clear":
            color = "#fbbf24"; // sunny yellow
            break;
        case "clouds":
            color = "#9ca3af"; // grey
            break;
        case "rain":
        case "drizzle":
            color = "#3b82f6"; // blue
            break;
        case "thunderstorm":
            color = "#8b5cf6"; // purple
            break;
        case "snow":
            color = "#bfdbfe"; // soft blue
            break;
        case "mist":
        case "fog":
        case "haze":
            color = "#6b7280"; // muted grey
            break;
        default:
            color = "#3b82f6";
    }
    document.documentElement.style.setProperty("--accent", color);
    document.documentElement.style.setProperty(
        "--accent-soft",
        "rgba(59, 130, 246, 0.25)"
    );
}

// DARK MODE HANDLING
function applyThemeFromPreference() {
    const stored = localStorage.getItem("weather-theme");
    if (stored === "dark") {
        document.body.classList.add("dark");
        darkModeToggle.checked = true;
    } else {
        document.body.classList.remove("dark");
        darkModeToggle.checked = false;
    }
}

darkModeToggle.addEventListener("change", () => {
    if (darkModeToggle.checked) {
        document.body.classList.add("dark");
        localStorage.setItem("weather-theme", "dark");
    } else {
        document.body.classList.remove("dark");
        localStorage.setItem("weather-theme", "light");
    }
});

// EVENT: SEARCH BUTTON
searchButton.addEventListener("click", () => {
    const location = locationInput.value.trim();
    if (location) {
        fetchWeatherByCity(location);
    } else {
        setStatus({ message: "Please enter a city name." });
    }
});

// EVENT: ENTER KEY
locationInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        const location = locationInput.value.trim();
        if (location) {
            fetchWeatherByCity(location);
        } else {
            setStatus({ message: "Please enter a city name." });
        }
    }
});

// CLEARS INFO WHEN INPUT CLEARED
locationInput.addEventListener("input", () => {
    if (!locationInput.value.trim()) {
        resetWeatherInfo();
        setStatus({ message: "" });
        document.body.style.backgroundImage = "url('src/default.png')";
        forecastContainer.innerHTML = "";
    }
});

// ON LOAD: APPLY THEME + TRY GEOLOCATION
window.onload = () => {
    applyThemeFromPreference();

    if (navigator.geolocation) {
        setStatus({ loading: true, message: "Detecting your location..." });
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                fetchWeatherByCoords(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
                setStatus({
                    loading: false,
                    message:
                        "Location access denied. Please enter a city manually.",
                });
            }
        );
    } else {
        setStatus({
            message: "Geolocation is not supported by this browser.",
        });
    }
};

// FETCHING WEATHER BY CITY
function fetchWeatherByCity(location) {
    const url = `${weatherUrl}?q=${encodeURIComponent(
        location
    )}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

// FETCHING WEATHER BY COORDS
function fetchWeatherByCoords(lat, lon) {
    const url = `${weatherUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetchWeather(url);
}

// MAIN FETCH FUNCTION
function fetchWeather(url) {
    setStatus({ loading: true, message: "Fetching weather data..." });

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error("City not found. Please check the name.");
                }
                throw new Error("Weather data not available at the moment.");
            }
            return response.json();
        })
        .then((data) => {
            updateWeatherUI(data);
            // Get forecast using coordinates
            const { lat, lon } = data.coord;
            fetchForecastByCoords(lat, lon);
        })
        .catch((error) => {
            console.error("Error fetching weather data:", error);
            setStatus({
                loading: false,
                message:
                    error.message ||
                    "Please check your city name or try again later.",
            });
            resetWeatherInfo();
            document.body.style.backgroundImage = "url('src/default.png')";
            forecastContainer.innerHTML = "";
        });
}

// UPDATE MAIN UI
function updateWeatherUI(data) {
    const weatherMain = data.weather[0].main.toLowerCase();
    const temp = Math.round(data.main.temp);
    const feels = Math.round(data.main.feels_like);
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;
    const visibility = data.visibility; // in meters
    const pressure = data.main.pressure;
    const sunrise = data.sys.sunrise;
    const sunset = data.sys.sunset;

    // Fade-in animation reset
    fadeTarget.classList.remove("fade-in");
    // Force reflow to restart animation
    // eslint-disable-next-line no-unused-expressions
    fadeTarget.offsetHeight;
    fadeTarget.classList.add("fade-in");

    // Set accent theme
    setAccentByCondition(weatherMain);

    // Basic Info
    locationElement.textContent = data.name || "Unknown Location";
    descriptionElement.textContent = `Condition: ${data.weather[0].description}`;

    // Temperature animated
    animateNumber(temperatureElement, 0, temp);

    // Highlights
    feelsLikeElement.textContent = `${feels}°C`;
    humidityElement.textContent = `${humidity}%`;
    windElement.textContent = `${windSpeed} m/s`;
    visibilityElement.textContent = visibility
        ? `${(visibility / 1000).toFixed(1)} km`
        : "N/A";
    pressureElement.textContent = pressure ? `${pressure} hPa` : "N/A";

    const sunriseTime = formatTime(sunrise);
    const sunsetTime = formatTime(sunset);
    sunCycleElement.textContent = `${sunriseTime} / ${sunsetTime}`;

    // Weather icon from OpenWeather
    const iconCode = data.weather[0].icon;
    weatherIconElement.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIconElement.alt = data.weather[0].description;

    // Background image
    switch (weatherMain) {
        case "clear":
            document.body.style.backgroundImage = "url('src/clear.png')";
            break;
        case "clouds":
            document.body.style.backgroundImage = "url('src/clouds.png')";
            break;
        case "rain":
        case "drizzle":
            document.body.style.backgroundImage = "url('src/rain.png')";
            break;
        case "snow":
            document.body.style.backgroundImage = "url('src/snow.png')";
            break;
        case "thunderstorm":
            document.body.style.backgroundImage =
                "url('src/thunderstorm.png')";
            break;
        case "fog":
        case "mist":
        case "haze":
            document.body.style.backgroundImage = "url('src/fog.png')";
            break;
        default:
            document.body.style.backgroundImage = "url('src/default.png')";
            break;
    }

    setStatus({ loading: false, message: "" });
}

// FORMAT UNIX TIME TO LOCAL HH:MM
function formatTime(unixSeconds) {
    return new Date(unixSeconds * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

// FETCH FORECAST (NEXT HOURS)
function fetchForecastByCoords(lat, lon) {
    const url = `${forecastUrl}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Unable to fetch forecast data.");
            }
            return response.json();
        })
        .then((data) => {
            updateForecastUI(data.list);
        })
        .catch((error) => {
            console.error("Error fetching forecast:", error);
            forecastContainer.innerHTML = "";
        });
}

// UPDATE FORECAST STRIP
function updateForecastUI(list) {
    forecastContainer.innerHTML = "";

    if (!Array.isArray(list) || list.length === 0) return;

    // Take next 4 time slots (3h step)
    const nextSlots = list.slice(0, 4);

    nextSlots.forEach((item) => {
        const time = new Date(item.dt * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        const temp = Math.round(item.main.temp);
        const desc = item.weather[0].main.toLowerCase();
        const iconCode = item.weather[0].icon;

        const card = document.createElement("div");
        card.className = "forecast-card";

        card.innerHTML = `
            <div class="forecast-time">${time}</div>
            <img src="https://openweathermap.org/img/wn/${iconCode}.png" alt="${desc}">
            <div class="forecast-temp">${temp}°C</div>
            <div class="forecast-desc">${item.weather[0].description}</div>
        `;

        forecastContainer.appendChild(card);
    });
}

// RESET UI
function resetWeatherInfo() {
    locationElement.textContent = "";
    temperatureElement.textContent = "";
    descriptionElement.textContent = "";
    humidityElement.textContent = "";
    windElement.textContent = "";
    feelsLikeElement.textContent = "";
    visibilityElement.textContent = "";
    pressureElement.textContent = "";
    sunCycleElement.textContent = "";
    weatherIconElement.src = "src/weather-icon.png";
    weatherIconElement.alt = "Weather icon";
}
