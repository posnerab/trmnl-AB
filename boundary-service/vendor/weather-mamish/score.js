/* Weather Mamish's canonical dressing score. Also pinned by the TRMNL renderer. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.WeatherMamish = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const MODEL_VERSION = '2';
  const MAX_AGE_MS = 60 * 60 * 1000;
  const finite = value => typeof value === 'number' && Number.isFinite(value);
  const bands = [
    [82, 'Serious cold', 'Winter gear'],
    [66, 'Winter coat weather', 'Winter coat'],
    [48, 'Jacket plus accessories', 'Jacket + hat'],
    [30, 'Hoodie or light jacket', 'Light jacket'],
    [0, 'Light layers', 'Light layers'],
  ];
  function calculateMamish(weather, { now = Date.now() } = {}) {
    const { temperature, feelsLike, time } = weather || {};
    // Never coerce missing observations into a reassuring zero score.
    if (!finite(temperature) || !finite(feelsLike) || temperature < -130 || temperature > 140 || feelsLike < -180 || feelsLike > 180) {
      return { score: null, unavailable: true, reason: 'missing', label: 'Weather data incomplete' };
    }
    const observedAt = typeof time === 'string' && /(?:Z|[+-]\d{2}:\d{2})$/.test(time) ? Date.parse(time) : NaN;
    if (!finite(observedAt) || !finite(now) || observedAt > now + 5 * 60000 || now - observedAt >= MAX_AGE_MS) {
      return { score: null, unavailable: true, reason: 'stale', label: 'Weather update needed' };
    }
    // Preserve the original thermal scale. Apparent temperature already includes
    // wind/humidity (and, for Open-Meteo, solar radiation): do not count them twice.
    // UV and precipitation determine protection, not how much insulation to wear.
    const score = Math.max(0, Math.min(100, Math.round((68 - feelsLike) * 1.55)));
    const [, label, shortLabel] = bands.find(([minimum]) => score >= minimum);
    return { score, label, shortLabel, feelsLike, observedAt, expiresAt: observedAt + MAX_AGE_MS, modelVersion: MODEL_VERSION };
  }
  function fromOpenMeteo(data) {
    const c = data?.current, units = data?.current_units;
    if (!c || units?.temperature_2m !== '°F' || units?.apparent_temperature !== '°F' || units?.wind_speed_10m !== 'mp/h') {
      throw new Error('Weather units unavailable or unexpected');
    }
    if (!finite(c.time) || Math.abs(c.time) > 8640000000000) throw new Error('Weather timestamp missing');
    const optional = (value, min, max) => finite(value) && value >= min && value <= max ? value : null;
    return {
      temperature: c.temperature_2m, feelsLike: c.apparent_temperature,
      humidity: optional(c.relative_humidity_2m, 0, 100), wind: optional(c.wind_speed_10m, 0, 300),
      cloud: optional(c.cloud_cover, 0, 100), uv: optional(c.uv_index, 0, 30),
      code: optional(c.weather_code, 0, 99), isDay: c.is_day === 1,
      time: new Date(c.time * 1000).toISOString(), timezone: data.timezone,
    };
  }
  function isWet(weather) {
    return [51,53,55,56,57,61,63,65,66,67,71,73,75,77,80,81,82,85,86,95,96,99].includes(weather?.code);
  }
  return { calculateMamish, fromOpenMeteo, isWet, MAX_AGE_MS, MODEL_VERSION };
});
