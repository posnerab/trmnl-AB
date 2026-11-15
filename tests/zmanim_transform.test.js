const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { buildPayload } = require("../scripts/zmanim_transform");

function fixture(date, weekdayCalendarItems) {
  const day = date.slice(0, 10);
  const at = (time) => `${day}T${time}-05:00`;
  return {
    IDX_0: {
      date: day,
      location: { title: "Milwaukee, Wisconsin, USA" },
      times: {
        chatzotNight: at("00:50:00"),
        alotHaShachar: at("03:16:00"),
        misheyakirMachmir: at("04:06:00"),
        sunrise: at("05:12:00"),
        sofZmanShmaMGA: at("08:25:00"),
        sofZmanShma: at("09:01:00"),
        sofZmanTfilla: at("10:18:00"),
        chatzot: at("12:50:00"),
        minchaGedola: at("13:28:00"),
        minchaKetana: at("17:17:00"),
        plagHaMincha: at("18:53:00"),
        sunset: at("20:28:00"),
        tzeit72min: at("21:40:00")
      }
    },
    IDX_1: {
      items: [
        { category: "hebdate", date: day, hdate: "22 Sivan 5786" },
        ...weekdayCalendarItems
      ]
    }
  };
}

test("weekday afternoon keeps intentionally visible times only", () => {
  const input = fixture("2026-06-07", [
    { category: "parashat", date: "2026-06-13", title_orig: "Parashat Sh'lach" }
  ]);
  const result = buildPayload(input, { now: "2026-06-07T13:47:00-05:00" });

  assert.equal(result.period, "Afternoon");
  assert.equal(result.parasha, "Shelach");
  assert.deepEqual(result.times, [["Sunset", "8:28 PM"]]);
});

test("normalizes numbered Sukkot Torah readings to Succos", () => {
  const input = fixture("2026-10-04", [
    { category: "parashat", date: "2026-10-10", title_orig: "Parashat Sukkot I" }
  ]);
  const result = buildPayload(input, { now: "2026-10-04T13:47:00-05:00" });

  assert.equal(result.parasha, "Succos I");
});

test("hidden mincha milestones remain absent later in the afternoon", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T18:54:00-05:00"
  });
  assert.deepEqual(result.times, [["Sunset", "8:28 PM"]]);
});

test("only the selected later Shema appears in the morning", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T08:55:00-05:00"
  });
  assert.deepEqual(result.times, [
    ["Shema", "9:01 AM"],
    ["Tefilla", "10:18 AM"],
    ["Chatzos", "12:50 PM"]
  ]);
});

test("passed selected zman disappears immediately while future zmanim remain", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T09:01:01-05:00"
  });
  assert.deepEqual(result.times, [
    ["Tefilla", "10:18 AM"],
    ["Chatzos", "12:50 PM"]
  ]);
});

test("weekday evening points chatzos night at the coming midnight", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T21:00:00-05:00"
  });
  assert.equal(result.period, "Evening");
  assert.deepEqual(result.times, [
    ["Tzeis", "9:40 PM"],
    ["Chatzos", "12:50 AM"]
  ]);
});

test("Friday afternoon uses early Shabbos candle lighting", () => {
  const result = buildPayload(fixture("2026-06-12", []), {
    now: "2026-06-12T14:00:00-05:00"
  });
  assert.equal(result.period, "Erev Shabbos");
  assert.deepEqual(result.times, [
    ["Candle Lighting", "7:04 PM"],
    ["Sunset", "8:27 PM"]
  ]);
});

test("published single CBJ Mincha is included from the shared schedule", () => {
  const result = buildPayload(fixture("2026-07-26", []), {
    now: "2026-07-26T14:00:00-05:00"
  });
  assert.deepEqual(result.times, [
    ["CBJ Mincha", "8:00 PM"],
    ["Sunset", "8:28 PM"]
  ]);
});

test("passed CBJ Mincha 1 is removed while future CBJ Mincha 2 remains", () => {
  const result = buildPayload(fixture("2026-08-01", []), {
    now: "2026-08-01T18:30:00-05:00"
  });
  assert.deepEqual(result.times, [
    ["CBJ Mincha 2", "7:40 PM"],
    ["Sunset", "8:28 PM"],
    ["Havdalah", "9:40 PM"]
  ]);
});

test("Shabbos afternoon retains its existing sunset and havdalah schedule", () => {
  const result = buildPayload(fixture("2026-06-13", []), {
    now: "2026-06-13T15:00:00-05:00"
  });
  assert.equal(result.period, "Shabbos Afternoon");
  assert.deepEqual(result.times, [
    ["Sunset", "8:28 PM"],
    ["Havdalah", "9:40 PM"]
  ]);
});

test("CBJ local clocks do not hard-code the daylight-saving offset", () => {
  const source = fs.readFileSync(
    path.join(__dirname, "..", "scripts", "zmanim_transform.js"),
    "utf8"
  );
  assert.doesNotMatch(source, /dateString}T\\${clock}:00-05:00/);
  assert.match(source, /timeZone: TZID/);
});

test("display calendar rolls at sunset and keeps bilingual parasha and holiday countdown", () => {
  const input = fixture("2026-10-29", [
    { category: "hebdate", date: "2026-10-30", hdate: "19 Cheshvan 5787", hebrew: "י״ט חשון" },
    { category: "parashat", date: "2026-10-31", title_orig: "Parashat Vayera", hebrew: "פרשת וירא" },
    { category: "holiday", subcat: "major", date: "2026-12-04T15:59:00-06:00", title: "Chanukah: 1 Candle" }
  ]);
  const result = buildPayload(input, { now: "2026-10-29T22:00:00-05:00" });
  assert.equal(result.display_hdate, "19 Cheshvan 5787");
  assert.equal(result.parasha_english, "Vayeira");
  assert.equal(result.parasha_hebrew, "וירא");
  assert.equal(result.hdate_hebrew, "י״ט חשון תשפ״ז");
  assert.deepEqual(result.holiday, { name: "Chanukah", days: 36, detail: "36 days to go" });
  assert.equal(result.calendar_through, "2026-12-31");
  assert.match(result.next_icon, /^<svg/);
  assert.ok(result.zman_rows.every(row => row.icon.includes('<svg') && row.time));
});

test("Plugin Merge unwraps private sources and retains native weather units and zero AQI", () => {
  const hebcal = fixture("2026-06-07", []);
  const result = buildPayload({
    private_plugin_123: { merge_variables: { zmanim: hebcal.IDX_0, calendar: hebcal.IDX_1 } },
    weather_456: { meta: { current_conditions: { time: Date.parse("2026-06-07T14:00:00-05:00") / 1000 } },
      forecast: { right_now: { temperature: 75, feels_like: 74, conditions: "Clear", icon: "clear-day" },
        today: { maxtemp: 80, mintemp: 58, precip: { probability: 0 } } } },
    private_plugin_789: { merge_variables: { data: { aqi: 0, status: "Good" } } },
    lunar_calendar_100: { illumination: 50, current_phase: { name: "First Quarter", keyname: "first_quarter" } }
  }, { now: "2026-06-07T14:00:00-05:00" });
  assert.deepEqual(result.next_zman, ["Sunset", "8:28 PM"]);
  assert.equal(result.weather.temperature, 75);
  assert.equal(result.weather.precipitation, 0);
  assert.deepEqual(result.air_quality, { value: 0, status: "Good", pollutant: "", pm25: null });
  assert.equal(result.lunar.illumination, 50);
  assert.match(result.lunar.icon, /^<svg/);
});

test("missing or stale environment sources never remove the zmanim", () => {
  const hebcal = fixture("2026-06-07", []);
  const result = buildPayload({ ...hebcal,
    weather_1: { meta: { current_conditions: { time: Date.parse("2026-06-06T14:00:00-05:00") / 1000 } },
      forecast: { right_now: { temperature: 75 } } },
    private_plugin_2: { merge_variables: { data: { aqi: null, error: "Unavailable" } } }
  }, { now: "2026-06-07T14:00:00-05:00" });
  assert.ok(result.next_zman);
  assert.equal(result.weather.unavailable, true);
  assert.equal(result.air_quality, null);
  assert.equal(result.lunar, null);
});

test("Hebrew year removes the thousands prefix without duplicating an existing year", () => {
  const input = fixture("2026-06-07", []);
  Object.assign(input.IDX_1.items[0], { hdate: "22 Sivan 5786", hebrew: "כ״ב סיון ה׳תשפ״ו" });
  const result = buildPayload(input, { now: "2026-06-07T14:00:00-05:00" });
  assert.equal(result.hdate_hebrew, "כ״ב סיון תשפ״ו");
});

test("Hebrew month names beginning with tav are never mistaken for a year", () => {
  for (const month of ["תמוז", "תשרי", "טבת"]) {
    const input = fixture("2026-06-07", []);
    Object.assign(input.IDX_1.items[0], { hdate: "22 Sivan 5786", hebrew: "כ״ב " + month });
    assert.equal(buildPayload(input, { now: "2026-06-07T14:00:00-05:00" }).hdate_hebrew,
      "כ״ב " + month + " תשפ״ו");
  }
});

test("holiday countdown uses civil dates across DST and New Year", () => {
  const input = fixture("2026-12-31", [
    { category: "holiday", subcat: "minor", date: "2027-01-23", title: "Tu BiShvat" }
  ]);
  const result = buildPayload(input, { now: "2026-12-31T12:00:00-06:00" });
  assert.deepEqual(result.holiday, { name: "Tu BiShvat", days: 22, detail: "22 days to go" });
});

test("Chanukah is active after sunset and special Shabbos metadata is included", () => {
  const input = fixture("2026-12-04", [
    { category: "holiday", subcat: "major", date: "2026-12-04T15:59:00-06:00", title: "Chanukah: 1 Candle" },
    { category: "mevarchim", date: "2026-12-05", title: "Mevorchim Chodesh Teves" }
  ]);
  const result = buildPayload(input, { now: "2026-12-04T22:00:00-06:00" });
  assert.equal(result.holiday.name, "Chanukah");
  assert.equal(result.holiday.detail, "Today");
  assert.equal(result.special_shabbos, "Shabbos Mevarchim Teves");
});

test("one Shema chooses the latest Gra or MGA variant, excluding Baal Hatanya", () => {
  const input = fixture("2026-10-30", []);
  input.IDX_0.times.sofZmanShmaMGA = "2026-10-30T09:23:40-05:00";
  input.IDX_0.times.sofZmanShmaMGA16Point1 = "2026-10-30T09:16:53-05:00";
  input.IDX_0.times.sofZmanShmaBaalHatanya = "2026-10-30T10:57:31-05:00";
  input.IDX_0.times.sofZmanShma = "2026-10-30T09:59:40-05:00";
  const result = buildPayload(input, { now: "2026-10-30T08:00:00-05:00" });
  assert.deepEqual(result.next_zman, ["Shema", "9:59 AM"]);
  assert.equal(result.times.filter(([name]) => name.includes("Shema")).length, 1);
  input.IDX_0.times.sofZmanShmaMGA16Point1 = "2026-10-30T10:01:00-05:00";
  assert.deepEqual(buildPayload(input, { now: "2026-10-30T08:00:00-05:00" }).next_zman, ["Shema", "10:01 AM"]);
});

test("Earliest Daven is sunrise minus 72 minutes with an inclusive transition", () => {
  const input = fixture("2026-06-08", []);
  const expected = [["Earliest Daven", "4:00 AM"], ["Shema", "9:01 AM"], ["Tefilla", "10:18 AM"], ["Chatzos", "12:50 PM"]];
  assert.deepEqual(buildPayload(input, { now: "2026-06-08T03:00:00-05:00" }).times, expected);
  assert.deepEqual(buildPayload(input, { now: "2026-06-08T04:00:00-05:00" }).next_zman, expected[0]);
  assert.deepEqual(buildPayload(input, { now: "2026-06-08T04:00:01-05:00" }).next_zman, expected[1]);
});

test("civil midnight selects Chatzos or Sunday Melave Malka before morning", () => {
  assert.deepEqual(buildPayload(fixture("2026-06-08", []), { now: "2026-06-08T00:00:00-05:00" }).next_zman, ["Chatzos", "12:50 AM"]);
  assert.deepEqual(buildPayload(fixture("2026-06-07", []), { now: "2026-06-07T00:00:00-05:00" }).next_zman, ["Latest Melave Malka", "12:50 AM"]);
});

test("Shabbos Havdalah stays sunset plus 72 at every evening boundary", () => {
  const input = fixture("2026-06-13", []);
  // An inconsistent upstream nightfall must not alter Havdalah's fixed offset.
  input.IDX_0.times.tzeit72min = "2026-06-13T22:00:00-05:00";
  for (const clock of ["20:28:00", "21:39:59", "21:40:00"]) {
    assert.deepEqual(buildPayload(input, { now: `2026-06-13T${clock}-05:00` }).next_zman, ["Havdalah", "9:40 PM"]);
  }
  const after = buildPayload(input, { now: "2026-06-13T21:40:01-05:00" });
  assert.equal(after.period, "Motzei Shabbos");
  assert.deepEqual(after.next_zman, ["Latest Melave Malka", "12:50 AM"]);
});

test("published Maariv and special fast events match the shared CBJ calendar", () => {
  const shabbos = fixture("2026-11-14", []);
  const result = buildPayload(shabbos, { now: "2026-11-14T16:00:00-06:00" });
  assert.ok(result.times.some(([name, time]) => name === "Maariv" && time === "5:28 PM"));
  const fast = buildPayload(fixture("2026-12-20", []), { now: "2026-12-20T16:30:00-06:00" });
  assert.deepEqual(fast.next_zman, ["CBJ Maariv", "4:45 PM"]);
  assert.ok(fast.times.some(([name, time]) => name === "Asara B’Teves · Fast Ends" && time === "5:09 PM"));
});

function batch(...inputs) {
  const times = {};
  for (const input of inputs) for (const [key, value] of Object.entries(input.IDX_0.times)) {
    (times[key] ||= {})[input.IDX_0.date] = value;
  }
  return { IDX_0: { times, location: inputs[0].IDX_0.location }, IDX_1: { items: inputs.flatMap(input => input.IDX_1.items) } };
}

test("Friday's final-minute gap bridges to the actual tomorrow morning data", () => {
  const today = fixture("2026-06-12", []), tomorrow = fixture("2026-06-13", []);
  const result = buildPayload(batch(today, tomorrow), { now: "2026-06-12T20:27:01-05:00" });
  assert.equal(result.period, "Erev Shabbos");
  assert.equal(result.next_day, true);
  assert.deepEqual(result.next_zman, ["Chatzos", "12:50 AM"]);
  assert.equal(buildPayload(today, { now: "2026-06-12T20:27:01-05:00" }).next_zman, null);
});

test("missing current-day polling data fails closed instead of reusing stale clocks", () => {
  const yesterday = fixture("2026-06-07", []);
  assert.match(buildPayload(yesterday, { now: "2026-06-08T10:00:00-05:00" }).error, /current-day/);
  assert.match(buildPayload(batch(yesterday), { now: "2026-06-08T10:00:00-05:00" }).error, /current-day/);
});

test("batch selection honors Milwaukee civil days across UTC and DST boundaries", () => {
  const before = fixture("2026-11-01", []), after = fixture("2026-11-02", []);
  for (const input of [before, after]) for (const [key, value] of Object.entries(input.IDX_0.times)) {
    input.IDX_0.times[key] = value.replace("-05:00", "-06:00");
  }
  assert.deepEqual(buildPayload(batch(before, after), { now: "2026-11-02T00:00:00-06:00" }).next_zman, ["Chatzos", "12:50 AM"]);
  assert.equal(buildPayload(batch(before, after), { now: "2026-11-02T03:00:00Z" }).period, "Evening");
});

test('boundary metadata uses exact selected event seconds and inclusive rows', () => {
  const input = fixture('2026-06-07', []);
  input.IDX_0.times.sofZmanShma = '2026-06-07T09:01:37-05:00';
  const at = now => buildPayload(input, {now, transitionMetadata:true});
  assert.equal(at('2026-06-07T08:56:00-05:00').next_transition_at, '2026-06-07T14:01:37.001Z');
  assert.equal(at('2026-06-07T09:01:37-05:00').next_zman[0], 'Shema');
  assert.equal(at('2026-06-07T09:01:37.001-05:00').next_zman[0], 'Tefilla');
  assert.equal(buildPayload(input, {now:'2026-06-07T08:56:00-05:00'}).next_transition_at, undefined);
});

test('period, sunset date rollover and midnight wake even without a selected event', () => {
  const input = fixture('2026-06-07', []);
  const at = now => buildPayload(input, {now, transitionMetadata:true});
  assert.equal(at('2026-06-07T05:00:00-05:00').next_transition_at, '2026-06-07T10:12:00.000Z');
  assert.equal(at('2026-06-07T12:49:59-05:00').next_transition_at, '2026-06-07T17:50:00.000Z');
  assert.equal(at('2026-06-07T20:27:59-05:00').next_transition_at, '2026-06-08T01:28:00.000Z');
  assert.equal(at('2026-06-07T23:59:00-05:00').next_transition_at, '2026-06-08T05:00:00.000Z');
});

test('boundary midnight uses local civil date across both DST offsets', () => {
  for (const [day,offset,utc] of [['2026-03-08','-05:00','2026-03-09T05:00:00.000Z'], ['2026-11-01','-06:00','2026-11-02T06:00:00.000Z']]) {
    const input = fixture(day, []);
    for (const key of Object.keys(input.IDX_0.times)) input.IDX_0.times[key]=input.IDX_0.times[key].replace('-05:00',offset);
    assert.equal(buildPayload(input,{now:day+'T23:59:00'+offset,transitionMetadata:true}).next_transition_at,utc);
  }
});
