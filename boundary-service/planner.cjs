const { buildPayload } = require('../scripts/zmanim_transform');
const crypto = require('node:crypto');
const { applyMamish } = require('./mamish.cjs');
function payloadAt(input, now, mamishWeather) {
  const payload = buildPayload(input, { now, transitionMetadata: true });
  if (payload.error || !Number.isFinite(Date.parse(payload.next_transition_at))) throw new Error('Current solar data unavailable');
  return applyMamish(payload, mamishWeather, now);
}
function refreshSeconds(now, transition, mamishObservedAt) {
  // A small allowance clears inclusive event rows and tolerates clock skew.
  // Pre-rendering can use the previous quarter's observation. Give the panel a
  // chance to collect the updated frame after the provider's next reading.
  const previousQuarter = Number.isFinite(mamishObservedAt) &&
    Math.floor(mamishObservedAt / 900000) < Math.floor(now / 900000);
  const maxSleep = previousQuarter ? 90 : 900;
  return Math.max(60, Math.min(maxSleep, Math.ceil((Date.parse(transition) + 3000 - now) / 1000)));
}
function fingerprint(payload) {
  const { current_time, next_transition_at, ...content } = payload;
  return crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex');
}
function matchesFrame(frame, payload) {
  return !!frame && frame.fingerprint === fingerprint(payload) && frame.nextTransition === payload.next_transition_at;
}
function selectFrame(frames, now) {
  return frames.filter(f => f.validFrom <= now && now < f.validUntil).sort((a,b) => b.validFrom - a.validFrom)[0];
}
module.exports = { payloadAt, refreshSeconds, fingerprint, selectFrame, matchesFrame };
