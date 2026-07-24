// TRMNL transform script for the Hebrew Date private plugin.
// Expected polling URLs:
// 1. https://www.hebcal.com/zmanim?cfg=json&sec=1&geonameid=5263045
// 2. https://www.hebcal.com/hebcal?v=1&cfg=json&zip=53216&d=on&s=on&c=on&M=on&o=on&lg=a

function transform(input) {
  return buildPayload(input);
}

function run(input) {
  return buildPayload(input);
}

function buildPayload(input) {
  const TZID = "America/Chicago";

  const PARASHA_MAP = {
    "Achrei Mot": "Acharei Mos",
    "Achrei Mot-Kedoshim": "Acharei Mos-Kedoshim",
    "Balak": "Balak",
    "Bamidbar": "Bamidbar",
    "Bechukotai": "Bechukosai",
    "Beha'alotcha": "Beha'aloscha",
    "Beha\u2019aloscha": "Beha'aloscha",
    "Beha\u2019alotcha": "Beha'aloscha",
    "Behar": "Behar",
    "Bereshit": "Bereishis",
    "Beshalach": "Beshalach",
    "Bo": "Bo",
    "Chayei Sara": "Chayei Sarah",
    "Chukat": "Chukas",
    "Chukat-Balak": "Chukas-Balak",
    "Devarim": "Devarim",
    "Eikev": "Eikev",
    "Emor": "Emor",
    "Ha'azinu": "Ha'azinu",
    "Ha\u2019azinu": "Ha'azinu",
    "Kedoshim": "Kedoshim",
    "Ki Tavo": "Ki Savo",
    "Ki Teitzei": "Ki Seitzei",
    "Ki Tisa": "Ki Sisa",
    "Korach": "Korach",
    "Lech-Lecha": "Lech Lecha",
    "Masei": "Masei",
    "Matot": "Matos",
    "Matot-Masei": "Matos-Masei",
    "Metzora": "Metzora",
    "Miketz": "Mikeitz",
    "Mishpatim": "Mishpatim",
    "Naso": "Nasso",
    "Nitzavim": "Nitzavim",
    "Nitzavim-Vayeilech": "Nitzavim-Vayeilech",
    "Noach": "Noach",
    "Pekudei": "Pekudei",
    "Pinchas": "Pinchas",
    "Re\u2019eh": "Re'eh",
    "Shabbat": "Shabbos",
    "Shemot": "Shemos",
    "Sh'lach": "Shelach",
    "Sh\u2019lach": "Shelach",
    "Shmini": "Shemini",
    "Shoftim": "Shoftim",
    "Tazria": "Tazria",
    "Tazria-Metzora": "Tazria-Metzora",
    "Terumah": "Terumah",
    "Tetzaveh": "Tetzaveh",
    "Toldot": "Toldos",
    "Tzav": "Tzav",
    "Vaetchanan": "Va'eschanan",
    "Vayakhel": "Vayakhel",
    "Vayakhel-Pekudei": "Vayakhel-Pekudei",
    "Vayechi": "Vayechi",
    "Vayeilech": "Vayeilech",
    "Vayera": "Vayeira",
    "Vaera": "Va'eira",
    "Vayeshev": "Vayeishev",
    "Vayetzei": "Vayeitzei",
    "Vayigash": "Vayigash",
    "Vayikra": "Vayikra",
    "Vayishlach": "Vayishlach",
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
  const calendarData = inputs.find((item) => item && Array.isArray(item.items));
  const locationData = inputs.find((item) => item && item.location);

  if (!calendarData && input && input.hdate) {
    return input;
  }

  if (!calendarData) {
    return { error: "Missing Hebcal calendar polling data" };
  }

  const now = new Date();
  const today = formatDateParam(now);
  const todayWeekday = weekday(now);

  return {
    date: formatDisplayDate(now),
    hdate: findHebrewDate(calendarData, today),
    omer: findOmer(calendarData, today),
    parasha: findUpcomingParasha(calendarData, now, todayWeekday),
    location: (locationData && locationData.location && locationData.location.title) ||
      (calendarData.location && calendarData.location.title) ||
      "Milwaukee, WI 53216",
    current_time: formatClock(now)
  };

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
    const copy = new Date(date);
    copy.setUTCDate(copy.getUTCDate() + days);
    return copy;
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

  function normalizeParashaName(name) {
    if (!name) return name;

    const cleaned = name
      .replace(/^Parashat\s+/i, "")
      .replace(/^Parshas\s+/i, "")
      .trim();
    const ascii = cleaned.replace(/\u2018|\u2019/g, "'");
    if (PARASHA_MAP[cleaned]) return PARASHA_MAP[cleaned];
    if (PARASHA_MAP[ascii]) return PARASHA_MAP[ascii];

    return Object.entries(PARASHA_MAP)
      .sort((a, b) => b[0].length - a[0].length)
      .reduce((result, [source, target]) => result.split(source).join(target), ascii);
  }

  function findHebrewDate(data, dateString) {
    const item = (data.items || []).find((entry) => {
      return entry.category === "hebdate" && entry.date === dateString;
    });

    return (item && item.hdate) || "Unknown";
  }

  function findUpcomingParasha(data, currentDate, currentWeekday) {
    const daysUntilSaturday = (6 - currentWeekday + 7) % 7;
    const shabbosDate = formatDateParam(addDays(currentDate, daysUntilSaturday));
    const item = (data.items || []).find((entry) => {
      return entry.category === "parashat" && entry.date === shabbosDate;
    });

    return normalizeParashaName(
      (item && (item.title_orig || item.title || item.memo)) || "Unknown"
    );
  }

  function findOmer(data, dateString) {
    const item = (data.items || []).find((entry) => {
      return entry.category === "omer" && entry.date === dateString;
    });

    if (!item) return "";

    const source = item.title_orig || item.title || "";
    const match = source.match(/\d+/);
    if (!match) return item.title || "";

    const count = Number(match[0]);
    if (!Number.isFinite(count)) return item.title || "";

    const weeks = Math.floor(count / 7);
    const days = count % 7;
    const dayWord = count === 1 ? "Day" : "Days";
    return `${count} ${dayWord} of the Omer, ${weeks}w ${days}d`;
  }
}
