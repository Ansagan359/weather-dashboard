/**
 * Open-Meteo API client. Free, keyless, no sign-up required.
 * https://open-meteo.com/
 */

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";

/** Resolve a city name to coordinates. */
export async function geocode(name) {
  const url = `${GEO_URL}?name=${encodeURIComponent(name)}&count=1&language=en&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to look up that city.");
  const data = await res.json();
  if (!data.results || data.results.length === 0) {
    throw new Error(`Couldn't find "${name}". Try another spelling.`);
  }
  const c = data.results[0];
  return {
    name: c.name,
    country: c.country ?? "",
    lat: c.latitude,
    lon: c.longitude,
  };
}

/** Fetch current weather + 7-day forecast for coordinates. */
export async function getForecast(lat, lon, unit = "celsius") {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min",
    timezone: "auto",
    forecast_days: "7",
  });
  if (unit === "fahrenheit") {
    params.set("temperature_unit", "fahrenheit");
    params.set("wind_speed_unit", "mph");
  }
  const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to load the forecast.");
  return res.json();
}
