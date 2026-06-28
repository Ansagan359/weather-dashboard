# Weather Dashboard

A clean, fast weather dashboard with current conditions and a **7-day forecast** — powered by [Open-Meteo](https://open-meteo.com/). **No API key, no sign-up, no build step.**

<p>
  <img src="https://img.shields.io/badge/Vanilla-JS-141417?style=flat-square&logo=javascript&logoColor=6e56f7" />
  <img src="https://img.shields.io/badge/API-Open--Meteo-141417?style=flat-square" />
  <img src="https://img.shields.io/badge/API%20key-not%20required-141417?style=flat-square" />
  <img src="https://img.shields.io/badge/license-MIT-141417?style=flat-square" />
</p>

> **Demo**
>
> <!-- Replace with a real screenshot / GIF -->
> ![App screenshot](https://placehold.co/800x460/0a0a0b/6e56f7?text=Weather+Dashboard)

---

## ✨ Features

- 🔎 **City search** with geocoding
- 📍 **Use my location** via browser geolocation
- 🌡 **Current conditions** — temp, feels-like, humidity, wind
- 📅 **7-day forecast** with highs/lows and weather icons
- 🔁 **°C / °F** toggle (and km/h ↔ mph)
- 🌗 Day/night aware icons, clean loading & error states
- 🪶 **No API key, no dependencies, no build**

## 🚀 Usage

```bash
git clone https://github.com/Ansagan359/weather-dashboard.git
cd weather-dashboard
# open index.html — or serve it:
python -m http.server 8000   # http://localhost:8000
```

Deploy the folder to **GitHub Pages / Netlify / Vercel** as-is.

## 🗂 Structure

```
weather-dashboard/
├── index.html
├── styles.css
└── src/
    ├── api.js            # Open-Meteo geocoding + forecast
    ├── weatherCodes.js   # WMO code → label + icon
    └── app.js            # UI logic
```

## 🛠 Built with

- **Open-Meteo** free weather & geocoding APIs
- Vanilla JavaScript (ES modules), zero dependencies

## 📄 License

[MIT](LICENSE) © Ansagan
