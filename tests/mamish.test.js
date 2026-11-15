const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { fromTempest, rotationAt, applyMamish } = require('../boundary-service/mamish.cjs');
const now = Date.parse('2026-11-15T16:00:00Z');
const input = (extra={}) => ({weather_140203:{meta:{units:{units_temp:'c'},current_conditions:{time:now/1000,air_temperature:6,feels_like:4,...extra}}}});
const payload={next_transition_at:'2026-11-15T18:00:00Z',lunar:{name:'Waxing crescent'},next_zman:['Tefilla','9:59 AM']};
test('raw metric Tempest observations become Fahrenheit before scoring',()=>{
  assert.equal(fromTempest(input()).feelsLike,39.2);
  assert.equal(applyMamish(payload,input(),now).mamish.score,45);
  assert.equal(fromTempest({weather_140203:{meta:{units:{},current_conditions:{}}}}),null);
  assert.equal(applyMamish(payload,input({feels_like:null}),now),payload);
});
test('alternates only the lunar slot on all four quarter-hours including DST repeats',()=>{
  for (const hour of ['2026-11-15T16:','2026-11-01T06:','2026-11-01T07:','2026-03-08T08:']) {
    for (const [minute,expected] of [['00',true],['14',true],['15',false],['29',false],['30',true],['44',true],['45',false],['59',false]]) {
      assert.equal(rotationAt(Date.parse(hour+minute+':00Z')).showMamish,expected);
    }
  }
  const first=applyMamish(payload,input(),now), second=applyMamish(payload,input(),now+900000);
  assert(first.mamish); assert.equal(second.mamish,null); assert.deepEqual(second.lunar,payload.lunar);
  assert.deepEqual(first.next_zman,payload.next_zman);
  assert.equal(first.next_transition_at,'2026-11-15T16:15:00.000Z');
});
test('zman boundary takes priority and a score expires instead of showing stale data',()=>{
  assert.equal(applyMamish({...payload,next_transition_at:'2026-11-15T16:02:00Z'},input(),now).next_transition_at,'2026-11-15T16:02:00.000Z');
  const old=input({time:(now-3590000)/1000});
  assert.equal(applyMamish(payload,old,now).next_transition_at,'2026-11-15T16:00:10.000Z');
  assert.equal(applyMamish(payload,old,now+10000),payload);
  assert.equal(applyMamish(payload,{},now),payload);
});
test('pinned score is identical to Weather Mamish canonical source when sibling is present',()=>{
  const canonical=path.resolve(__dirname,'../../abie.live/weather-mamish/score.js');
  if(fs.existsSync(canonical)) assert.equal(fs.readFileSync(canonical,'utf8'),fs.readFileSync(path.resolve(__dirname,'../boundary-service/vendor/weather-mamish/score.js'),'utf8'));
});
