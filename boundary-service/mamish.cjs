const { calculateMamish } = require('./vendor/weather-mamish/score.js');
const QUARTER = 15 * 60000;
function rotationAt(now) {
  const quarter = Math.floor(now / QUARTER);
  return { showMamish: quarter % 2 === 0, nextAt: (quarter + 1) * QUARTER };
}
function applyMamish(payload, weather, now) {
  const result = calculateMamish(weather, { now });
  if (result.unavailable) return payload; // Moon stays visible if current weather cannot be verified.
  const rotation = rotationAt(now);
  const nextAt = Math.min(Date.parse(payload.next_transition_at), rotation.nextAt, result.expiresAt);
  return { ...payload, next_transition_at: new Date(nextAt).toISOString(),
    mamish: rotation.showMamish ? { score: result.score, label: result.shortLabel, observedAt: result.observedAt,
      feels_like: Math.round(result.feelsLike), gauge: gauge(result.score) } : null };
}
function gauge(score) {
  // Crisp, monochrome ring with a numeric score alongside it. No gray/color dependency.
  const circumference = 2 * Math.PI * 22;
  const progress = circumference * score / 100;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="22" fill="none" stroke="black" stroke-width="1"/><circle cx="28" cy="28" r="22" fill="none" stroke="black" stroke-width="6" stroke-dasharray="${progress.toFixed(2)} ${circumference.toFixed(2)}" transform="rotate(-90 28 28)"/><path d="M28 6v4M50 28h-4M28 50v-4M6 28h4" stroke="black" stroke-width="2"/></svg>`;
}
module.exports = { rotationAt, applyMamish, gauge };
