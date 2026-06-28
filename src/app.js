/** Weather Dashboard — UI logic. */

import { geocode, getForecast } from "./api.js";
import { describeWeather } from "./weatherCodes.js";

const $ = (id) => document.getElementById(id);
const els = {
  form: $("searchForm"),
  input: $("cityInput"),
  geo: $("geoButton"),
  unit: $("unitToggle"),
  status: $("status"),
  result: $("result"),
  place: $("place"),
  current: $("current"),
  forecast: $("forecast"),
};

const state = { unit: "celsius", lat: null, lon: null, label: "" };

const tempUnit = () => (state.unit === "celsius" ? "°C" : "°F");
const windUnit = () => (state.unit === "celsius" ? "km/h" : "mph");
const round = (n) => Math.round(n);

function setStatus(message, isError = false) {
  els.status.textContent = message;
  els.status.classList.toggle("status--error", isError);
  els.status.hidden = !message;
}

function dayName(iso, index) {
  if (index === 0) return "Today";
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short" });
}

function renderCurrent(data, label) {
  const c = data.current;
  const { label: desc, icon } = describeWeather(c.weather_code, c.is_day);
  els.place.textContent = label;
  els.current.innerHTML = `
    <div class="now">
      <div class="now__icon">${icon}</div>
      <div class="now__temp">${round(c.temperature_2m)}${tempUnit()}</div>
      <div class="now__desc">${desc}</div>
    </div>
    <dl class="metrics">
      <div><dt>Feels like</dt><dd>${round(c.apparent_temperature)}${tempUnit()}</dd></div>
      <div><dt>Humidity</dt><dd>${c.relative_humidity_2m}%</dd></div>
      <div><dt>Wind</dt><dd>${round(c.wind_speed_10m)} ${windUnit()}</dd></div>
    </dl>`;
}

function renderForecast(data) {
  const d = data.daily;
  els.forecast.innerHTML = d.time
    .map((iso, i) => {
      const { icon } = describeWeather(d.weather_code[i]);
      return `
        <div class="day">
          <span class="day__name">${dayName(iso, i)}</span>
          <span class="day__icon">${icon}</span>
          <span class="day__temps">
            <b>${round(d.temperature_2m_max[i])}°</b>
            <span class="muted">${round(d.temperature_2m_min[i])}°</span>
          </span>
        </div>`;
    })
    .join("");
}

async function load(lat, lon, label) {
  state.lat = lat;
  state.lon = lon;
  state.label = label;
  setStatus("Loading…");
  els.result.hidden = true;
  try {
    const data = await getForecast(lat, lon, state.unit);
    renderCurrent(data, label);
    renderForecast(data);
    els.result.hidden = false;
    setStatus("");
  } catch (err) {
    setStatus(err.message || "Something went wrong.", true);
  }
}

async function searchCity(name) {
  if (!name.trim()) return;
  setStatus("Searching…");
  try {
    const { name: city, country, lat, lon } = await geocode(name);
    await load(lat, lon, country ? `${city}, ${country}` : city);
  } catch (err) {
    setStatus(err.message, true);
  }
}

function useGeolocation() {
  if (!navigator.geolocation) {
    setStatus("Geolocation isn't available in this browser.", true);
    return;
  }
  setStatus("Locating…");
  navigator.geolocation.getCurrentPosition(
    (pos) => load(pos.coords.latitude, pos.coords.longitude, "Your location"),
    () => setStatus("Couldn't get your location.", true),
  );
}

function init() {
  els.form.addEventListener("submit", (e) => {
    e.preventDefault();
    searchCity(els.input.value);
  });
  els.geo.addEventListener("click", useGeolocation);
  els.unit.addEventListener("click", () => {
    state.unit = state.unit === "celsius" ? "fahrenheit" : "celsius";
    els.unit.textContent = state.unit === "celsius" ? "°C" : "°F";
    if (state.lat != null) load(state.lat, state.lon, state.label);
  });

  // Sensible default so the dashboard isn't empty on first load.
  searchCity("London");
}

document.addEventListener("DOMContentLoaded", init);
