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
  // BEGIN GENERATED CBJ CALENDAR - shared/cbj_calendar/schedule.json
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
    ],
    "2026-09-01": [
      "19:10"
    ],
    "2026-09-02": [
      "19:10"
    ],
    "2026-09-03": [
      "19:10"
    ],
    "2026-09-04": [
      "19:00"
    ],
    "2026-09-05": [
      "18:45"
    ],
    "2026-09-06": [
      "18:55"
    ],
    "2026-09-07": [
      "18:55"
    ],
    "2026-09-08": [
      "18:55"
    ],
    "2026-09-09": [
      "18:55"
    ],
    "2026-09-10": [
      "18:55"
    ],
    "2026-09-11": [
      "18:40"
    ],
    "2026-09-12": [
      "18:35"
    ],
    "2026-09-13": [
      "18:35"
    ],
    "2026-09-14": [
      "18:25"
    ],
    "2026-09-15": [
      "18:40"
    ],
    "2026-09-16": [
      "18:40"
    ],
    "2026-09-17": [
      "18:40"
    ],
    "2026-09-18": [
      "18:35"
    ],
    "2026-09-19": [
      "18:20"
    ],
    "2026-09-20": [
      "14:15",
      "16:00"
    ],
    "2026-09-21": [
      "16:15"
    ],
    "2026-09-22": [
      "18:30"
    ],
    "2026-09-23": [
      "18:30"
    ],
    "2026-09-24": [
      "18:30"
    ],
    "2026-09-25": [
      "18:20"
    ],
    "2026-09-26": [
      "18:15"
    ],
    "2026-09-27": [
      "18:20"
    ],
    "2026-09-28": [
      "18:15"
    ],
    "2026-09-29": [
      "18:15"
    ],
    "2026-09-30": [
      "18:15"
    ],
    "2026-10-01": [
      "18:15"
    ],
    "2026-10-02": [
      "18:10"
    ],
    "2026-10-03": [
      "17:55"
    ],
    "2026-10-04": [
      "17:45"
    ],
    "2026-10-05": [
      "18:05"
    ],
    "2026-10-06": [
      "18:05"
    ],
    "2026-10-07": [
      "18:05"
    ],
    "2026-10-08": [
      "18:05"
    ],
    "2026-10-09": [
      "17:55"
    ],
    "2026-10-10": [
      "17:45"
    ],
    "2026-10-11": [
      "17:55"
    ],
    "2026-10-12": [
      "17:55"
    ],
    "2026-10-13": [
      "17:55"
    ],
    "2026-10-14": [
      "17:55"
    ],
    "2026-10-15": [
      "17:55"
    ],
    "2026-10-16": [
      "17:45"
    ],
    "2026-10-17": [
      "17:30"
    ],
    "2026-10-18": [
      "17:40"
    ],
    "2026-10-19": [
      "17:40"
    ],
    "2026-10-20": [
      "17:40"
    ],
    "2026-10-21": [
      "17:40"
    ],
    "2026-10-22": [
      "17:40"
    ],
    "2026-10-23": [
      "17:35"
    ],
    "2026-10-24": [
      "17:20"
    ],
    "2026-10-25": [
      "17:40"
    ],
    "2026-10-26": [
      "17:30"
    ],
    "2026-10-27": [
      "17:30"
    ],
    "2026-10-28": [
      "17:30"
    ],
    "2026-10-29": [
      "17:30"
    ],
    "2026-10-30": [
      "17:25"
    ],
    "2026-10-31": [
      "17:10"
    ],
    "2026-11-01": [
      "16:25"
    ],
    "2026-11-02": [
      "16:25"
    ],
    "2026-11-03": [
      "16:25"
    ],
    "2026-11-04": [
      "16:25"
    ],
    "2026-11-05": [
      "16:25"
    ],
    "2026-11-06": [
      "16:15"
    ],
    "2026-11-07": [
      "16:05"
    ],
    "2026-11-08": [
      "16:15"
    ],
    "2026-11-09": [
      "16:15"
    ],
    "2026-11-10": [
      "16:15"
    ],
    "2026-11-11": [
      "16:15"
    ],
    "2026-11-12": [
      "16:15"
    ],
    "2026-11-13": [
      "16:05"
    ],
    "2026-11-14": [
      "15:55"
    ],
    "2026-11-15": [
      "16:10"
    ],
    "2026-11-16": [
      "16:10"
    ],
    "2026-11-17": [
      "16:10"
    ],
    "2026-11-18": [
      "16:10"
    ],
    "2026-11-19": [
      "16:10"
    ],
    "2026-11-20": [
      "16:00"
    ],
    "2026-11-21": [
      "15:50"
    ],
    "2026-11-22": [
      "16:05"
    ],
    "2026-11-23": [
      "16:05"
    ],
    "2026-11-24": [
      "16:05"
    ],
    "2026-11-25": [
      "16:05"
    ],
    "2026-11-26": [
      "16:05"
    ],
    "2026-11-27": [
      "15:55"
    ],
    "2026-11-28": [
      "15:45"
    ],
    "2026-11-29": [
      "16:00"
    ],
    "2026-11-30": [
      "16:00"
    ],
    "2026-12-01": [
      "16:00"
    ],
    "2026-12-02": [
      "16:00"
    ],
    "2026-12-03": [
      "16:00"
    ],
    "2026-12-04": [
      "14:30",
      "15:55"
    ],
    "2026-12-05": [
      "15:45"
    ],
    "2026-12-06": [
      "16:00"
    ],
    "2026-12-07": [
      "16:00"
    ],
    "2026-12-08": [
      "16:00"
    ],
    "2026-12-09": [
      "16:00"
    ],
    "2026-12-10": [
      "16:00"
    ],
    "2026-12-11": [
      "14:30",
      "15:55"
    ],
    "2026-12-12": [
      "15:45"
    ],
    "2026-12-13": [
      "16:00"
    ],
    "2026-12-14": [
      "16:00"
    ],
    "2026-12-15": [
      "16:00"
    ],
    "2026-12-16": [
      "16:00"
    ],
    "2026-12-17": [
      "16:00"
    ],
    "2026-12-18": [
      "15:55"
    ],
    "2026-12-19": [
      "15:45"
    ],
    "2026-12-20": [
      "15:35"
    ],
    "2026-12-21": [
      "16:05"
    ],
    "2026-12-22": [
      "16:05"
    ],
    "2026-12-23": [
      "16:05"
    ],
    "2026-12-24": [
      "16:05"
    ],
    "2026-12-25": [
      "16:00"
    ],
    "2026-12-26": [
      "15:50"
    ],
    "2026-12-27": [
      "16:10"
    ],
    "2026-12-28": [
      "16:10"
    ],
    "2026-12-29": [
      "16:10"
    ],
    "2026-12-30": [
      "16:10"
    ],
    "2026-12-31": [
      "16:10"
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
    "2026-08-28": "19:15",
    "2026-09-04": "19:03",
    "2026-09-11": "18:50",
    "2026-09-18": "18:38",
    "2026-09-25": "18:25",
    "2026-10-02": "18:13",
    "2026-10-09": "18:00",
    "2026-10-16": "17:49",
    "2026-10-23": "17:38",
    "2026-10-30": "17:28",
    "2026-11-06": "16:19",
    "2026-11-13": "16:11",
    "2026-11-20": "16:05",
    "2026-11-27": "16:01",
    "2026-12-04": "15:59",
    "2026-12-11": "15:58",
    "2026-12-18": "16:00",
    "2026-12-25": "16:04"
  };

  const CBJ_MAARIV_SCHEDULE = {
    "2026-11-07": "17:36",
    "2026-11-14": "17:28",
    "2026-11-21": "17:23",
    "2026-11-28": "17:19",
    "2026-12-05": "17:17",
    "2026-12-12": "17:17",
    "2026-12-19": "17:19",
    "2026-12-26": "17:22"
  };

  const CBJ_SPECIAL_EVENTS = {
    "2026-12-20": [
      {
        "name": "Asara B’Teves · Fast Begins",
        "clock": "06:07"
      },
      {
        "name": "CBJ Maariv",
        "clock": "16:45"
      },
      {
        "name": "Asara B’Teves · Fast Ends",
        "clock": "17:09"
      }
    ]
  };
  // END GENERATED CBJ CALENDAR

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
    "Sukkot": "Succos",
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

  function candidates(value, depth = 0) {
    if (!value || depth > 6) return [];
    if (Array.isArray(value)) return value;

    const found = [value];
    for (const key of Object.keys(value)) {
      if (/^(IDX_\d+|idx_\d+|private_plugin_\d+|weather_\d+|lunar_calendar_\d+|merge_variables|data|body|response|zmanim|calendar)$/.test(key)) {
        found.push(...candidates(value[key], depth + 1));
      }
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
  const times = parseTimesForDay(zmanimData, today);
  if (!times) return { error: "No current-day Hebcal zmanim; refresh required" };
  const cbjMincha = parseCbjMincha(today);
  const cbjCandleLighting = parseCbjCandleLighting(today);
  const hdate = findHebrewDate(calendarData, today);
  const parasha = findUpcomingParasha(calendarData, now, todayWeekday);

  const payload = buildCurrentPeriodPayload({
    now,
    todayWeekday,
    times,
    cbjMincha,
    cbjCandleLighting,
    cbjMaariv: parseCbjMaariv(today),
    cbjEvents: parseCbjEvents(today),
    hdate,
    parasha,
    location: (zmanimData.location && zmanimData.location.title) || "Milwaukee, Wisconsin, USA"
  });

  if (payload.error) return payload;
  // Match NextZman's almanac-aware bridge. Never reuse today's clocks for tomorrow.
  if (!payload.next_zman) {
    const tomorrow = new Date(Date.parse(today + "T12:00:00Z") + 86400000).toISOString().slice(0, 10);
    const tomorrowTimes = parseTimesForDay(zmanimData, tomorrow);
    if (tomorrowTimes) {
      const tomorrowStart = parseLocalClock(tomorrow, "00:00");
      const following = buildCurrentPeriodPayload({
        now: tomorrowStart, todayWeekday: weekday(tomorrowStart), times: tomorrowTimes,
        cbjMincha: parseCbjMincha(tomorrow), cbjCandleLighting: parseCbjCandleLighting(tomorrow),
        cbjMaariv: parseCbjMaariv(tomorrow), cbjEvents: parseCbjEvents(tomorrow),
        hdate: findHebrewDate(calendarData, tomorrow), parasha, location: payload.location
      });
      if (following.next_zman) {
        payload.next_zman = following.next_zman;
        payload.times = following.times;
        payload.next_day = true;
      }
    }
  }
  const calendarItems = (calendarData && calendarData.items) || [];
  // Date arithmetic uses Gregorian date keys, not 24-hour intervals across DST.
  const shiftKey = (key, days) => new Date(Date.parse(key + "T12:00:00Z") + days * 86400000).toISOString().slice(0, 10);
  const jewishKey = times.sunset && now >= times.sunset ? shiftKey(today, 1) : today;
  const jewishWeekday = new Date(jewishKey + "T12:00:00Z").getUTCDay();
  const shabbosKey = shiftKey(jewishKey, (6 - jewishWeekday + 7) % 7);
  const hebrewDay = calendarItems.find(e => e.category === "hebdate" && e.date === jewishKey);
  const parashaItem = calendarItems.find(e => e.category === "parashat" && e.date === shabbosKey)
    || calendarItems.find(e => e.category === "holiday" && e.subcat === "major" && e.date === shabbosKey);
  const specialShabbos = calendarItems.filter(e => e.date === shabbosKey && (e.category === "mevarchim" || e.subcat === "shabbat"))
    .map(e => (e.title || "").replace("Mevorchim Chodesh", "Shabbos Mevarchim").replace("Shabbat", "Shabbos")).join(" · ");
  const holidays = calendarItems.filter(e => e.category === "holiday" && ["major", "minor", "fast"].includes(e.subcat) && !/^Erev /.test(e.title || ""));
  const activeHoliday = holidays.find(e => (e.date.includes("T") ? shiftKey(e.date.slice(0, 10), 1) : e.date) === jewishKey);
  let holiday = null;
  if (activeHoliday) holiday = { name: holidayName(activeHoliday.title), detail: "Today", days: 0 };
  else {
    for (const event of holidays.slice().sort((a,b) => a.date.localeCompare(b.date))) {
      const start = event.date.includes("T") || event.subcat === "fast" ? event.date.slice(0,10) : shiftKey(event.date, -1);
      const days = Math.round((Date.parse(start + "T12:00:00Z") - Date.parse(today + "T12:00:00Z")) / 86400000);
      if (days < 0 || (days === 0 && times.sunset && now >= times.sunset)) continue;
      holiday = { name: holidayName(event.title), days, detail: days === 0 ? (event.subcat === "fast" ? "Today" : "Begins tonight") : `${days} ${days === 1 ? "day" : "days"} to go` };
      break;
    }
  }
  return Object.assign(payload, {
    display_hdate: hebrewDay ? hebrewDay.hdate : payload.hdate,
    hdate_hebrew: hebrewDateWithYear(hebrewDay),
    parasha_english: parashaItem ? normalizeParashaName(parashaItem.title_orig || parashaItem.title) : "Parasha unavailable",
    parasha_hebrew: parashaItem ? (parashaItem.hebrew || "").replace(/^(פרשת|פרשה)\s+/, "") : "",
    special_shabbos: specialShabbos,
    holiday,
    calendar_through: Object.keys(CBJ_MINCHA_SCHEDULE).sort().slice(-1)[0],
    next_icon: zmanIcon(payload.next_zman ? payload.next_zman[0] : ""),
    zman_rows: payload.times.map(([name, time]) => ({ name, time, icon: zmanIcon(name) })),
    following_rows: payload.times.slice(1).map(([name, time]) => ({ name, time, icon: zmanIcon(name) })),
    weather: weatherSummary(),
    air_quality: airQualitySummary(),
    lunar: lunarSummary(),
    calendar_expired: today > Object.keys(CBJ_MINCHA_SCHEDULE).sort().slice(-1)[0]
  });

  function hebrewDateWithYear(day) {
    if (!day || !day.hebrew) return "";
    const year = Number((day.hdate || "").match(/\d{4}$/)?.[0]);
    if (!year) return day.hebrew;
    // Hebcal's daily Hebrew label omits the year. Match NextZman's short year.
    let rest = year % 1000, letters = "";
    for (const [value, letter] of [[400,"ת"],[300,"ש"],[200,"ר"],[100,"ק"],[90,"צ"],[80,"פ"],[70,"ע"],[60,"ס"],[50,"נ"],[40,"מ"],[30,"ל"],[20,"כ"]]) {
      while (rest >= value) { letters += letter; rest -= value; }
    }
    if (rest === 15 || rest === 16) { letters += rest === 15 ? "טו" : "טז"; rest = 0; }
    if (rest >= 10) { letters += "י"; rest -= 10; }
    if (rest) letters += "אבגדהוזחט"[rest - 1];
    const shortYear = letters.length > 1 ? letters.slice(0, -1) + "״" + letters.slice(-1) : letters + "׳";
    const nativeDate = day.hebrew.replace(new RegExp("\\s+(?:ה[׳']?)?" + shortYear + "$"), "");
    return nativeDate + " " + shortYear;
  }

  function numeric(value) {
    return typeof value === "number" && Number.isFinite(value) ? value : null;
  }
  function weatherSummary() {
    const source = inputs.find(v => v && v.forecast && v.forecast.right_now);
    if (!source) return null;
    const current = source.forecast.right_now, today = source.forecast.today || {};
    const observed = numeric(source.meta?.current_conditions?.time);
    const age = observed === null ? null : now.getTime() / 1000 - observed;
    if (age !== null && (age > 3 * 3600 || age < -3600)) return { unavailable: true, detail: "Weather update delayed" };
    const temperature = numeric(current.temperature);
    if (temperature === null) return null;
    return { temperature: Math.round(temperature), feels_like: numeric(current.feels_like),
      high: numeric(today.maxtemp), low: numeric(today.mintemp),
      conditions: current.conditions || source.right_now_conditions || "",
      icon: weatherIcon(current.icon || ""),
      precipitation: numeric(today.precip?.probability),
      wind: numeric(current.wind?.max), wind_unit: current.wind?.units || "",
      observed_at: observed ? formatClock(new Date(observed * 1000)) : "" };
  }
  function airQualitySummary() {
    const source = inputs.find(v => v && numeric(v.aqi) !== null);
    if (!source || source.error || source.aqi < 0) return null;
    return { value: Math.round(source.aqi), status: source.status || "",
      pollutant: source.pollutant_name || "", pm25: numeric(source.pm25) };
  }
  function lunarSummary() {
    const source = inputs.find(v => v && v.current_phase && numeric(v.illumination) !== null);
    if (!source) return null;
    const illumination = Math.max(0, Math.min(100, source.illumination));
    const waxing = !/waning|third/i.test(source.current_phase.keyname || source.current_phase.name || "");
    const radius = 23, width = Math.abs(1 - illumination / 50) * radius;
    const side = waxing ? 1 : 0;
    const terminator = illumination <= 50 ? 1 - side : side;
    const lit = `<path d="M28 5A23 23 0 0 ${side} 28 51A${width.toFixed(2)} 23 0 0 ${terminator} 28 5" fill="white"/>`;
    return { name: source.current_phase.name, illumination: Math.round(illumination),
      next_full_moon: source.next_full_moon, next_phase: source.next_phase,
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="24" fill="currentColor"/>' + lit + '</svg>' };
  }
  function weatherIcon(name) {
    const sun = '<circle cx="12" cy="12" r="5"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>';
    let path = '<path d="M5 18a4 4 0 0 1-1-8 7 7 0 0 1 13-2 5 5 0 1 1 1 10Z"/>';
    if (/clear|sunny/.test(name)) path = sun;
    if (/rain|drizzle/.test(name)) path += '<path d="m7 21-1 2m6-2-1 2m6-2-1 2"/>';
    if (/snow|sleet/.test(name)) path += '<path d="M6 21h2m-1-1v2m5-1h2m-1-1v2m5-1h2m-1-1v2"/>';
    return '<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }

  function holidayName(title) { return /^Chanukah:/.test(title || "") ? "Chanukah" : title; }

  function zmanIcon(name) {
    const sun = '<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>';
    const moon = '<path d="M20 15A9 9 0 0 1 9 4a9 9 0 1 0 11 11Z"/>';
    let path = '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>';
    if (/Shema|Tefilla|Daven/.test(name)) path = '<path d="M12 5v16M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z"/>';
    else if (/Candle|Havdalah/.test(name)) path = '<path d="M8 22V11h8v11M5 22h14M12 1c-6 6-2 9 0 8 3 0 4-4 0-8Z"/>';
    else if (/Mincha/.test(name)) path = '<path d="m2 9 10-6 10 6ZM4 21h16M6 10v8m6-8v8m6-8v8"/>';
    else if (/Sunrise|Dawn/.test(name)) path = '<path d="M2 18h20M5 17a7 7 0 0 1 14 0M12 2v4m-8 1 3 3m13-3-3 3M9 22h6"/>';
    else if (/Sunset/.test(name)) path = '<path d="M2 18h20M5 17a7 7 0 0 1 14 0M12 1v7m-3-3 3 3 3-3M4 8l2 2m14-2-2 2"/>';
    else if (/Tzeis/.test(name)) path = '<path d="m12 2 3 7 7 1-5 5 1 7-6-4-6 4 1-7-5-5 7-1Z"/>';
    else if (/Night|Midnight|Maariv|Malka/.test(name)) path = moon;
    else if (/Chatzos/.test(name)) path = sun;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + '</svg>';
  }

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

  function parseTimesForDay(data, day) {
    const raw = data.times || {};
    const batch = Object.values(raw).some(value => value && typeof value === "object");
    if (!batch && data.date !== day) return null;
    const values = Object.entries(raw).map(([key, value]) => {
      const text = batch ? value && value[day] : value;
      const time = text ? new Date(text) : null;
      return [key, time && Number.isFinite(time.getTime()) ? time : null];
    });
    const parsed = Object.fromEntries(values);
    return parsed.chatzot && parsed.sunset ? parsed : null;
  }

  function parseCbjMaariv(day) {
    const clock = CBJ_MAARIV_SCHEDULE[day];
    return clock ? parseLocalClock(day, clock) : null;
  }

  function parseCbjEvents(day) {
    return (CBJ_SPECIAL_EVENTS[day] || []).map(event => [event.name, parseLocalClock(day, event.clock)]);
  }

  function parseCbjMincha(dateString) {
    return (CBJ_MINCHA_SCHEDULE[dateString] || []).map((clock) =>
      parseLocalClock(dateString, clock)
    );
  }

  function parseCbjCandleLighting(dateString) {
    const clock = CBJ_CANDLE_LIGHTING_SCHEDULE[dateString];
    return clock ? parseLocalClock(dateString, clock) : null;
  }

  function parseLocalClock(dateString, clock) {
    const [year, month, day] = dateString.split("-").map(Number);
    const [hour, minute] = clock.split(":").map(Number);
    const utcGuess = new Date(Date.UTC(year, month - 1, day, hour, minute));
    const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
      timeZone: TZID,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23"
    }).formatToParts(utcGuess).map((part) => [part.type, part.value]));
    const representedAsUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute)
    );
    return new Date(utcGuess.getTime() - (representedAsUtc - utcGuess.getTime()));
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
    return ascii.replace(/^Sukkot\b/i, "Succos");
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

  function buildCurrentPeriodPayload({ now: current, todayWeekday: day, times: z, cbjMincha, cbjCandleLighting, cbjMaariv, cbjEvents, hdate: hd, parasha: p, location }) {
    const sunrise = z.sunrise;
    const chatzot = z.chatzot;
    const sunset = z.sunset;
    const chatzotNight = z.chatzotNight;
    // NextZman deliberately uses a fixed 24 hours, including DST transitions.
    const nextChatzotNight = chatzotNight ? addDays(chatzotNight, 1) : null;
    if (!chatzot || !sunset) return { error: "Missing critical times" };
    const havdalah = addMinutes(sunset, 72);
    let period = "Morning";
    let relevantTimes = [];

    if (current < chatzot) {
      period = sunrise && current < sunrise ? "Early Morning" : day === 6 ? "Shabbos Morning" : "Morning";
      if (chatzotNight && chatzotNight >= current && formatDateParam(chatzotNight) === formatDateParam(current)) {
        relevantTimes.push([day === 0 ? "Latest Melave Malka" : "Chatzos", chatzotNight]);
      }
      relevantTimes.push(
        ["Earliest Daven", sunrise ? addMinutes(sunrise, -72) : null],
        ["Shema", latestShema(z)], ["Tefilla", z.sofZmanTfilla], ["Chatzos", chatzot]
      );
    } else if (current < sunset) {
      period = day === 5 ? "Erev Shabbos" : day === 6 ? "Shabbos Afternoon" : "Afternoon";
      if (day === 6) {
        relevantTimes = [["Sunset", sunset], ["Maariv", cbjMaariv], ["Havdalah", havdalah]];
      } else if (day === 5) {
        const candleLighting = cbjCandleLighting ||
          (isEarlyShabbosSeason(hd) && z.plagHaMincha
            ? addMinutes(z.plagHaMincha, 11) : addMinutes(sunset, -18));
        relevantTimes = [["Candle Lighting", candleLighting], ["Sunset", addMinutes(sunset, -1)]];
      } else relevantTimes = [["Sunset", sunset]];
    } else if (day === 6) {
      if (current < havdalah) {
        period = "Shabbos Evening";
        relevantTimes = [["Sunset", addMinutes(sunset, -1)], ["Maariv", cbjMaariv], ["Havdalah", havdalah]];
      } else {
        period = "Motzei Shabbos";
        relevantTimes = [["Havdalah", havdalah], ["Latest Melave Malka", nextChatzotNight]];
      }
    } else {
      period = "Evening";
      relevantTimes = [["Tzeis", z.tzeit72min], ["Chatzos", nextChatzotNight]];
    }
    relevantTimes.push(...cbjMinchaItems(cbjMincha), ...(cbjEvents || []));
    return {
      period, current_time: formatClock(current), date: formatDisplayDate(current),
      hdate: hd, parasha: p, next_zman: findNextZman(relevantTimes, current),
      next_day: false,
      times: filterDisplayTimes(relevantTimes, current).map(([name, time]) => [name, formatClock(time)]),
      location
    };
  }

  function latestShema(z) {
    const candidates = Object.entries(z).filter(([key, value]) =>
      (key === "sofZmanShma" || key.startsWith("sofZmanShmaMGA")) && value instanceof Date && Number.isFinite(value.getTime())
    ).map(([, value]) => value.getTime());
    return candidates.length ? new Date(Math.max(...candidates)) : null;
  }

  function findNextZman(items, current) {
    const candidates = items
      .filter((item) => item[1] instanceof Date && !Number.isNaN(item[1].getTime()))
      .filter((item) => item[1].getTime() >= current.getTime())
      .sort((a, b) => a[1].getTime() - b[1].getTime());
    if (!candidates.length) return null;
    return [candidates[0][0], formatClock(candidates[0][1])];
  }

  function filterDisplayTimes(items, current) {
    // Show precisely the engine's upcoming selections; no expired 30-minute rows.
    return items.filter(([, time]) => time instanceof Date && Number.isFinite(time.getTime()) && time >= current)
      .sort((a, b) => a[1].getTime() - b[1].getTime());
  }

}

if (typeof module !== "undefined") {
  module.exports = { buildPayload, run, transform };
}
