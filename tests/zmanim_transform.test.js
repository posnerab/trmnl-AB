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

test("hidden mincha milestones remain absent later in the afternoon", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T18:54:00-05:00"
  });
  assert.deepEqual(result.times, [["Sunset", "8:28 PM"]]);
});

test("most recent past zman remains visible through exactly 30 minutes", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T08:55:00-05:00"
  });
  assert.deepEqual(result.times, [
    ["Shema (MGA)", "8:25 AM"],
    ["Shema (Gra)", "9:01 AM"],
    ["Tefilla (Gra)", "10:18 AM"],
    ["Chatzos", "12:50 PM"]
  ]);
});

test("past zman disappears after 30 minutes while future zmanim remain", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T08:55:01-05:00"
  });
  assert.deepEqual(result.times, [
    ["Shema (Gra)", "9:01 AM"],
    ["Tefilla (Gra)", "10:18 AM"],
    ["Chatzos", "12:50 PM"]
  ]);
});

test("weekday evening points chatzos night at the coming midnight", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T21:00:00-05:00"
  });
  assert.equal(result.period, "Evening");
  assert.deepEqual(result.times, [
    ["Tzeis (72 min)", "9:40 PM"],
    ["Chatzos Night", "12:50 AM"]
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
    ["Maariv", "9:28 PM"],
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
    ["Maariv", "9:28 PM"],
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
