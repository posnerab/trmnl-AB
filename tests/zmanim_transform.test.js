const test = require("node:test");
const assert = require("node:assert/strict");
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

test("weekday afternoon includes mincha milestones and sunset", () => {
  const input = fixture("2026-06-07", [
    { category: "parashat", date: "2026-06-13", title_orig: "Parashat Sh'lach" }
  ]);
  const result = buildPayload(input, { now: "2026-06-07T13:47:00-05:00" });

  assert.equal(result.period, "Afternoon");
  assert.equal(result.parasha, "Shelach");
  assert.deepEqual(result.times, [
    ["Mincha Gedola", "1:28 PM"],
    ["Mincha Ketana", "5:17 PM"],
    ["Plag HaMincha", "6:53 PM"],
    ["Sunset", "8:28 PM"]
  ]);
});

test("weekday afternoon keeps only the most recent passed milestone", () => {
  const result = buildPayload(fixture("2026-06-07", []), {
    now: "2026-06-07T18:54:00-05:00"
  });
  assert.deepEqual(result.times, [
    ["Plag HaMincha", "6:53 PM"],
    ["Sunset", "8:28 PM"]
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
    ["Mincha Gedola", "1:28 PM"],
    ["Plag HaMincha", "6:53 PM"],
    ["Candle Lighting", "7:04 PM"],
    ["Sunset", "8:27 PM"]
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
