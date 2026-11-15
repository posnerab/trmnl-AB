const test=require('node:test');
const assert=require('node:assert/strict');
const {refreshSeconds,selectFrame,fingerprint,payloadAt}=require('../boundary-service/planner.cjs');
test('wakes after exact event with minimum interval and bounded weather refresh',()=>{
  const now=Date.parse('2026-11-15T00:00:00Z');
  assert.equal(refreshSeconds(now,'2026-11-15T00:07:12Z'),435);
  assert.equal(refreshSeconds(now,'2026-11-15T00:00:20Z'),60);
  assert.equal(refreshSeconds(now,'2026-11-15T04:00:00Z'),900);
});
test('promotes pre-rendered image without rendering or network at boundary',()=>{
  const frames=[{validFrom:100,validUntil:200,name:'before'},{validFrom:200,validUntil:300,name:'after'}];
  assert.equal(selectFrame(frames,199).name,'before');
  assert.equal(selectFrame(frames,200).name,'after');
  assert.equal(selectFrame(frames,300),undefined);
  assert.equal(selectFrame(frames,99),undefined);
});
test('clock footer does not trigger needless renders but selection changes do',()=>{
  assert.equal(fingerprint({current_time:'1:00',period:'Morning'}),fingerprint({current_time:'1:01',period:'Morning'}));
  assert.notEqual(fingerprint({next_zman:['Sunset','4:30']}),fingerprint({next_zman:['Tzeis','5:42']}));
});
test('missing solar data cannot produce an apparently healthy scheduled screen',()=>{
  assert.throws(()=>payloadAt({},Date.now()),/unavailable/);
});
