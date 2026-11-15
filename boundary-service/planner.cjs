const { buildPayload } = require('../scripts/zmanim_transform');
const crypto = require('node:crypto');
const { applyMamish } = require('./mamish.cjs');
function payloadAt(input, now) {
  const payload = buildPayload(input, { now, transitionMetadata: true });
  if (payload.error || !Number.isFinite(Date.parse(payload.next_transition_at))) throw new Error('Current solar data unavailable');
  return applyMamish(payload, input, now);
}
function refreshSeconds(now, transition) {
  // A small allowance clears inclusive event rows and tolerates clock skew.
  return Math.max(60, Math.min(900, Math.ceil((Date.parse(transition) + 3000 - now) / 1000)));
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
