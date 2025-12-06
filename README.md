# 🌦 Weather Forecast Web App

A modern, responsive, and visually enhanced weather forecast application built using **HTML, CSS, JavaScript**, and **OpenWeather API**. The app provides real-time weather updates, dynamic UI themes based on weather conditions, dark mode, 3-hour forecast previews, and smooth micro-interactions for a delightful user experience.

---

## 🚀 Features

### 🔍 Search & Auto-Detect

* Search weather by **city name**.
* Automatic weather detection using **Geolocation API**.

### 🌈 Modern UI/UX Enhancements

* **Glassmorphism card design**.
* **Gradient background overlay** for better text readability.
* **Weather-based theme colors** (sunny, rainy, cloudy, stormy, etc.).
* **Dark mode toggle** with local storage theme persistence.
* Smooth **fade-in animations** on data load.
* **Micro-interactions** including button animations & temperature count-up effect.

### 🌤 Real-Time Weather Data

* Current temperature (with animated counter).
* Weather description & dynamic icon.
* Feels-like temperature.
* Humidity, wind speed, visibility, pressure.
* Sunrise & sunset times.
* Dynamic background images based on weather.

### 🕒 3-Hour Forecast Section

* Displays next few hours’ weather.
* Condition-specific icons.
* Hour-by-hour temperature preview.

### 📱 Fully Responsive

* Smooth layout on mobile, tablet, and desktop.
* Adaptive grid for highlights section.

---

## 📁 Folder Structure

```
Weather-Forecast-App-main/
│
├── index.html                # Main UI structure
├── styles.css                # Styling & theme enhancements
├── script.js                 # API logic, DOM updates, UI interactions
│
└── src/                      # Assets
    ├── clear.jpg
    ├── clouds.jpg
    ├── default.jpg
    ├── fog.jpg
    ├── rain.jpg
    ├── snow.jpg
    ├── thunderstorm.jpg
    └── weather-icon.png
```

---

## 🛠️ Technologies Used

* **HTML5** – Markup structure
* **CSS3** – Modern UI, animations, responsiveness
* **JavaScript (ES6)** – API handling, UI logic
* **OpenWeather API** – Live weather & forecast data
* **Geolocation API** – Auto-detect user location

---

## 🔧 How It Works

### 1️⃣ User Input

* Enter a city name or allow geolocation access.

### 2️⃣ API Calls

Two API endpoints are used:

* **Current weather:** `https://api.openweathermap.org/data/2.5/weather`
* **Forecast (3-hour):** `https://api.openweathermap.org/data/2.5/forecast`

### 3️⃣ Dynamic UI Rendering

* Weather details, highlights, icon, and background update instantly.
* Accent color theme changes based on weather condition.
* Temperature animates from 0 → actual value.
* Forecast cards are generated dynamically.

### 4️⃣ Error Handling

* Invalid city → user-friendly message.
* No internet or API error → fallback UI.

---

## 🖥️ How to Run the Project

### **1. Download or Clone the Repository**

```
git clone https://github.com/yourusername/weather-forecast-app.git
```

### **2. Add Your OpenWeather API Key**

Edit `script.js`:

```
const apiKey = "YOUR_OPENWEATHER_API_KEY";
```

### **3. Open the App**

Simply open:

```
index.html
```

### **4. Allow Location (Optional)**

The app will automatically fetch your local weather.

---

## 🌍 Deployment

This project can be deployed easily using **GitHub Pages**:

1. Push project to GitHub.
2. Go to **Settings → Pages**.
3. Select the branch and folder (`root`).
4. Hit **Save**.

Your live link will be generated.

---

## 🧠 What I Can Explain in an Interview

* Consuming REST APIs using `fetch()`.
* Asynchronous programming with Promises.
* DOM manipulation for dynamic UI.
* Responsive web design principles.
* UI/UX improvements (glassmorphism, micro-animations, themes).
* Working with external APIs & handling geolocation data.
* Error handling and loading state management.
* Structuring a clean, scalable frontend project.

---

## 📌 Future Enhancements

* Full 5-day forecast visualization.
* Air quality index (AQI) integration.
* Weather map overlays using Leaflet/Mapbox.
* Voice search for hands-free usage.
* Favorite cities & saved locations.

---

## ❤️ Credits

* Weather data by **OpenWeather**
* UI designed & implemented by **Rajnish Kumar Jha**
* Free weather icons from OpenWeather

---

### ✨ Thank you for checking out this project!

Feel free to fork, contribute, or reach out for improvements.
