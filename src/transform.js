// Canonical TRMNL transform for the Zmanim plugin.
// Keep this file compatible with both TRMNL's runtime and Node.js tests.

function transform(input) {
  return buildPayload(input);
}

function run(input) {
  return buildPayload(input);
}

function buildPayload(input, options) {
  const TZID = "America/Chicago";
  const now = options && options.now ? new Date(options.now) : new Date();
  const CBJ_MINCHA_SCHEDULE = {
    "2026-07-01": [
      "20:20"
    ],
    "2026-07-02": [
      "19:50"
    ],
    "2026-07-03": [
      "18:35"
    ],
    "2026-07-04": [
      "18:20",
      "20:00"
    ],
    "2026-07-05": [
      "20:15"
    ],
    "2026-07-06": [
      "20:15"
    ],
    "2026-07-07": [
      "20:15"
    ],
    "2026-07-08": [
      "20:15"
    ],
    "2026-07-09": [
      "20:15"
    ],
    "2026-07-10": [
      "18:35"
    ],
    "2026-07-11": [
      "18:20",
      "20:00"
    ],
    "2026-07-12": [
      "20:15"
    ],
    "2026-07-13": [
      "20:15"
    ],
    "2026-07-14": [
      "20:15"
    ],
    "2026-07-15": [
      "20:15"
    ],
    "2026-07-16": [
      "20:15"
    ],
    "2026-07-17": [
      "18:30"
    ],
    "2026-07-18": [
      "18:15",
      "19:55"
    ],
    "2026-07-19": [
      "20:10"
    ],
    "2026-07-20": [
      "20:10"
    ],
    "2026-07-21": [
      "20:10"
    ],
    "2026-07-22": [
      "19:00"
    ],
    "2026-07-23": [
      "14:00",
      "19:35"
    ],
    "2026-07-24": [
      "18:25"
    ],
    "2026-07-25": [
      "18:10",
      "19:50"
    ],
    "2026-07-26": [
      "20:00"
    ],
    "2026-07-27": [
      "20:00"
    ],
    "2026-07-28": [
      "20:00"
    ],
    "2026-07-29": [
      "20:00"
    ],
    "2026-07-30": [
      "20:00"
    ],
    "2026-07-31": [
      "18:20"
    ],
    "2026-08-01": [
      "18:00",
      "19:40"
    ],
    "2026-08-02": [
      "19:50"
    ],
    "2026-08-03": [
      "19:50"
    ],
    "2026-08-04": [
      "19:50"
    ],
    "2026-08-05": [
      "19:50"
    ],
    "2026-08-06": [
      "19:50"
    ],
    "2026-08-07": [
      "18:15"
    ],
    "2026-08-08": [
      "17:50",
      "19:30"
    ],
    "2026-08-09": [
      "19:45"
    ],
    "2026-08-10": [
      "19:45"
    ],
    "2026-08-11": [
      "19:45"
    ],
    "2026-08-12": [
      "19:45"
    ],
    "2026-08-13": [
      "19:45"
    ],
    "2026-08-14": [
      "18:05",
      "19:30"
    ],
    "2026-08-15": [
      "17:40",
      "19:20"
    ],
    "2026-08-16": [
      "19:30"
    ],
    "2026-08-17": [
      "19:30"
    ],
    "2026-08-18": [
      "19:30"
    ],
    "2026-08-19": [
      "19:30"
    ],
    "2026-08-20": [
      "19:30"
    ],
    "2026-08-21": [
      "17:55",
      "19:20"
    ],
    "2026-08-22": [
      "17:30",
      "19:10"
    ],
    "2026-08-23": [
      "19:20"
    ],
    "2026-08-24": [
      "19:20"
    ],
    "2026-08-25": [
      "19:20"
    ],
    "2026-08-26": [
      "19:20"
    ],
    "2026-08-27": [
      "19:20"
    ],
    "2026-08-28": [
      "19:10"
    ],
    "2026-08-29": [
      "17:20",
      "19:00"
    ],
    "2026-08-30": [
      "19:10"
    ],
    "2026-08-31": [
      "19:10"
    ]
  };

  const CBJ_CANDLE_LIGHTING_SCHEDULE = {
    "2026-07-03": "19:10",
    "2026-07-10": "19:08",
    "2026-07-17": "19:04",
    "2026-07-24": "19:00",
    "2026-07-31": "18:54",
    "2026-08-07": "18:47",
    "2026-08-14": "18:39",
    "2026-08-21": "18:30",
    "2026-08-28": "19:15"
  };

  const PARASHA_MAP = {
    "Achrei Mot": "Acharei Mos",
    "Achrei Mot-Kedoshim": "Acharei Mos-Kedoshim",
    "Bechukotai": "Bechukosai",
    "Beha'alotcha": "Beha'aloscha",
    "Beha\u2019aloscha": "Beha'aloscha",
    "Beha\u2019alotcha": "Beha'aloscha",
    "Bereshit": "Bereishis",
    "Chayei Sara": "Chayei Sarah",
    "Chukat": "Chukas",
    "Chukat-Balak": "Chukas-Balak",
    "Ha\u2019azinu": "Ha'azinu",
    "Ki Tavo": "Ki Savo",
    "Ki Teitzei": "Ki Seitzei",
    "Ki Tisa": "Ki Sisa",
    "Lech-Lecha": "Lech Lecha",
    "Matot": "Matos",
    "Matot-Masei": "Matos-Masei",
    "Miketz": "Mikeitz",
    "Naso": "Nasso",
    "Re\u2019eh": "Re'eh",
    "Shabbat": "Shabbos",
    "Shemot": "Shemos",
    "Sh'lach": "Shelach",
    "Sh\u2019lach": "Shelach",
    "Shmini": "Shemini",
    "Toldot": "Toldos",
    "Vaetchanan": "Va'eschanan",
    "Vayera": "Vayeira",
    "Vaera": "Va'eira",
    "Vayeshev": "Vayeishev",
    "Vayetzei": "Vayeitzei",
    "Yitro": "Yisro",
    "Vezot Haberakhah": "Vezos Haberachah",
    "V'Zos Habracha": "Vezos Haberachah"
  };

  function candidates(value) {
    if (!value) return new Array();
    if (Array.isArray(value)) return value;

    const found = [value];
    for (const key of ["IDX_0", "IDX_1", "idx_0", "idx_1", "data", "body", "response"]) {
      if (value[key]) found.push(value[key]);
    }
    if (value.data && typeof value.data === "object") {
      found.push(...candidates(value.data));
    }
    return found;
  }

  const inputs = candidates(input);
  const zmanimData = inputs.find((item) => item && item.times && !Array.isArray(item.times));
  const calendarData = inputs.find((item) => item && Array.isArray(item.items));

  if (!zmanimData && input && input.period && Array.isArray(input.times)) {
    return input;
  }
  if (!zmanimData) {
    return { error: "Missing Hebcal zmanim polling data" };
  }
  if (Number.isNaN(now.getTime())) {
    return { error: "Invalid current time" };
  }

  const today = formatDateParam(now);
  const todayWeekday = weekday(now);
  const times = parseTimes(zmanimData.times);
  const cbjMincha = parseCbjMincha(today);
  const cbjCandleLighting = parseCbjCandleLighting(today);
  const hdate = findHebrewDate(calendarData, today);
  const parasha = findUpcomingParasha(calendarData, now, todayWeekday);

  return buildCurrentPeriodPayload({
    now,
    todayWeekday,
    times,
    cbjMincha,
    cbjCandleLighting,
    hdate,
    parasha,
    location: (zmanimData.location && zmanimData.location.title) || "Milwaukee, Wisconsin, USA"
  });

  function formatDateParam(date) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
      timeZone: TZID,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date).map((part) => [part.type, part.value]));
    return `${parts.year}-${parts.month}-${parts.day}`;
  }

  function weekday(date) {
    const label = new Intl.DateTimeFormat("en-US", {
      timeZone: TZID,
      weekday: "short"
    }).format(date);
    return { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[label];
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
  }

  function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60 * 1000);
  }

  function formatClock(date) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZID,
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    }).format(date);
  }

  function formatDisplayDate(date) {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZID,
      weekday: "short",
      month: "long",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }

  function parseTimes(rawTimes) {
    return Object.fromEntries(
      Object.entries(rawTimes || {}).map(([key, value]) => [key, value ? new Date(value) : null])
    );
  }

  function parseCbjMincha(dateString) {
    return (CBJ_MINCHA_SCHEDULE[dateString] || []).map((clock) =>
      new Date(`${dateString}T${clock}:00-05:00`)
    );
  }

  function parseCbjCandleLighting(dateString) {
    const clock = CBJ_CANDLE_LIGHTING_SCHEDULE[dateString];
    return clock ? new Date(`${dateString}T${clock}:00-05:00`) : null;
  }

  function cbjMinchaItems(items) {
    return items.map((time, index) => [
      items.length > 1 ? `CBJ Mincha ${index + 1}` : "CBJ Mincha",
      time
    ]);
  }

  function normalizeParashaName(name) {
    if (!name) return name;
    const cleaned = name
      .replace(/^Parashat\s+/i, "")
      .replace(/^Parshas\s+/i, "")
      .trim();
    const ascii = cleaned.replace(/\u2018|\u2019/g, "'");
    if (PARASHA_MAP[cleaned]) return PARASHA_MAP[cleaned];
    if (PARASHA_MAP[ascii]) return PARASHA_MAP[ascii];
    return ascii;
  }

  function findHebrewDate(data, dateString) {
    const item = ((data && data.items) || []).find((entry) => {
      return entry.category === "hebdate" && entry.date === dateString;
    });
    return (item && item.hdate) || "Unknown";
  }

  function findUpcomingParasha(data, currentDate, currentWeekday) {
    const daysUntilSaturday = (6 - currentWeekday + 7) % 7;
    const shabbosDate = formatDateParam(addDays(currentDate, daysUntilSaturday));
    const item = ((data && data.items) || []).find((entry) => {
      return entry.category === "parashat" && entry.date === shabbosDate;
    });
    return normalizeParashaName(
      (item && (item.title_orig || item.title || item.memo)) || "Unknown"
    );
  }

  function isEarlyShabbosSeason(value) {
    if (!value || value === "Unknown") return false;
    const parts = value.split(/\s+/);
    const day = Number(parts[0]);
    const month = parts[1];
    if (!Number.isFinite(day) || !month) return false;
    if (month === "Nisan") return day >= 15;
    if (["Iyyar", "Sivan", "Tammuz", "Tamuz", "Av", "Elul"].includes(month)) return true;
    return month === "Tishrei" && day < 15;
  }

  function buildCurrentPeriodPayload({ now: current, todayWeekday: day, times: z, cbjMincha, cbjCandleLighting, hdate: hd, parasha: p, location }) {
    const sunrise = z.sunrise;
    const chatzot = z.chatzot;
    const sunset = z.sunset;
    const tzeit72min = z.tzeit72min;
    const chatzotNight = z.chatzotNight;
    const nextChatzotNight = chatzotNight ? addDays(chatzotNight, 1) : null;

    if (!chatzot || !sunset) {
      return { error: "Missing critical times" };
    }

    let period = "Morning";
    let relevantTimes = [];

    if (chatzotNight && sunrise && current >= chatzotNight && current < sunrise) {
      period = "Early Morning";
      relevantTimes = [
        ["Midnight", chatzotNight],
        ["Dawn", z.alotHaShachar],
        ["Earliest Daven", z.misheyakirMachmir],
        ["Sunrise", sunrise]
      ];
    } else if (sunrise && current >= sunrise && current < chatzot) {
      period = day === 6 ? "Shabbos Morning" : "Morning";
      relevantTimes = [
        ["Shema (MGA)", z.sofZmanShmaMGA],
        ["Shema (Gra)", z.sofZmanShma],
        ["Tefilla (Gra)", z.sofZmanTfilla],
        ["Chatzos", chatzot]
      ];
    } else if (current >= chatzot && current < sunset) {
      period = day === 5 ? "Erev Shabbos" : day === 6 ? "Shabbos Afternoon" : "Afternoon";
      if (day === 6) {
        relevantTimes = [
          ["Sunset", sunset],
          ["Maariv", addMinutes(sunset, 60)],
          ["Havdalah", tzeit72min]
        ];
      } else if (day === 5) {
        const candleLighting = cbjCandleLighting ||
          (isEarlyShabbosSeason(hd) && z.plagHaMincha
            ? addMinutes(z.plagHaMincha, 11)
            : addMinutes(sunset, -18));
        relevantTimes = [
          // Temporarily hidden; uncomment to restore Mincha Gedola.
          // ["Mincha Gedola", z.minchaGedola],
          // Temporarily hidden; uncomment to restore Plag HaMincha.
          // ["Plag HaMincha", z.plagHaMincha],
          ["Candle Lighting", candleLighting],
          ["Sunset", addMinutes(sunset, -1)]
        ];
      } else {
        relevantTimes = [
          // Temporarily hidden; uncomment to restore Mincha Gedola.
          // ["Mincha Gedola", z.minchaGedola],
          // Temporarily hidden; uncomment to restore Mincha Ketana.
          // ["Mincha Ketana", z.minchaKetana],
          // Temporarily hidden; uncomment to restore Plag HaMincha.
          // ["Plag HaMincha", z.plagHaMincha],
          ["Sunset", sunset]
        ];
      }
    } else if (day === 6 && sunset && current >= sunset) {
      const havdalah = addMinutes(sunset, 73);
      if (current < havdalah) {
        period = "Shabbos Evening";
        relevantTimes = [
          ["Sunset", addMinutes(sunset, -1)],
          ["Maariv", addMinutes(sunset, 59)],
          ["Havdalah", havdalah]
        ];
      } else {
        period = "Motzei Shabbos";
        relevantTimes = [
          ["Havdalah", havdalah],
          ["Latest Maleve Malka", nextChatzotNight]
        ];
      }
    } else if (current >= sunset || (chatzotNight && current < chatzotNight)) {
      period = "Evening";
      relevantTimes = [
        ["Tzeis (72 min)", tzeit72min],
        ["Chatzos Night", nextChatzotNight]
      ];
    }

    if (current >= chatzot && current < sunset && cbjMincha.length) {
      relevantTimes.push(...cbjMinchaItems(cbjMincha));
    }

    const nextZman = findNextZman(relevantTimes, cbjMincha, current);

    return {
      period,
      current_time: formatClock(current),
      date: formatDisplayDate(current),
      hdate: hd,
      parasha: p,
      next_zman: nextZman,
      times: filterDisplayTimes(relevantTimes, current)
        .map(([name, time]) => [name, typeof time === "string" ? time : formatClock(time)]),
      location
    };
  }

  function findNextZman(items, minchaItems, current) {
    const candidates = items
      .filter((item) => item[1] instanceof Date && !Number.isNaN(item[1].getTime()))
      .concat(cbjMinchaItems(minchaItems))
      .filter((item) => item[1].getTime() >= current.getTime())
      .sort((a, b) => a[1].getTime() - b[1].getTime());
    if (!candidates.length) return null;
    return [candidates[0][0], formatClock(candidates[0][1])];
  }

  function filterDisplayTimes(items, current) {
    let mostRecentPast = null;
    const future = [];
    const undated = [];
    const nowValue = current.getTime();

    for (const item of items) {
      const time = item[1];
      if (!time) continue;
      if (item[0] === "CBJ Mincha 1" && time instanceof Date && time.getTime() <= nowValue) {
        continue;
      }
      if (!(time instanceof Date) || Number.isNaN(time.getTime())) {
        undated.push(item);
      } else if (time.getTime() < nowValue) {
        if (!mostRecentPast || time.getTime() > mostRecentPast[1].getTime()) {
          mostRecentPast = item;
        }
      } else {
        future.push(item);
      }
    }
    future.sort((a, b) => a[1].getTime() - b[1].getTime());
    return (mostRecentPast ? [mostRecentPast] : []).concat(future, undated);
  }
}

if (typeof module !== "undefined") {
  module.exports = { buildPayload, run, transform };
}
