#!/usr/bin/env node

const { buildPayload } = require("./zmanim_transform");

const GEONAME_ID = "5263045";
const ZIP = "53216";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    if (argv[index] === "--at") args.at = argv[++index];
    else if (argv[index] === "--json") args.json = true;
    else if (argv[index] === "--help" || argv[index] === "-h") args.help = true;
    else throw new Error(`Unknown argument: ${argv[index]}`);
  }
  return args;
}

function usage() {
  console.log("Usage: node scripts/test_zmanim.js [--at YYYY-MM-DDTHH:mm[:ss][offset]] [--json]");
  console.log("Without an offset, the time is interpreted in Milwaukee using Hebcal's offset for that date.");
}

function localDateString(date) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date).map((part) => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": "trmnl-AB-zmanim-tester/1.0" }
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

function requestedDate(at) {
  if (!at) return localDateString(new Date());
  const match = at.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) throw new Error("--at must begin with YYYY-MM-DD");
  return match[1];
}

function resolveNow(at, zmanim) {
  if (!at) return new Date();
  if (/(Z|[+-]\d{2}:\d{2})$/i.test(at)) return new Date(at);

  const normalized = at.replace(" ", "T");
  const sample = zmanim.times.sunrise;
  const offset = sample.match(/([+-]\d{2}:\d{2})$/);
  if (!offset) throw new Error("Could not determine Milwaukee UTC offset from Hebcal data");
  return new Date(`${normalized}${normalized.length === 16 ? ":00" : ""}${offset[1]}`);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    return;
  }

  const date = requestedDate(args.at);
  const end = new Date(`${date}T12:00:00Z`);
  end.setUTCDate(end.getUTCDate() + 7);
  const endDate = end.toISOString().slice(0, 10);

  const zmanimUrl = new URL("https://www.hebcal.com/zmanim");
  zmanimUrl.search = new URLSearchParams({
    cfg: "json",
    sec: "1",
    geonameid: GEONAME_ID,
    date
  });

  const calendarUrl = new URL("https://www.hebcal.com/hebcal");
  calendarUrl.search = new URLSearchParams({
    v: "1",
    cfg: "json",
    zip: ZIP,
    d: "on",
    s: "on",
    c: "on",
    M: "on",
    lg: "a",
    start: date,
    end: endDate
  });

  const [zmanim, calendar] = await Promise.all([
    fetchJson(zmanimUrl),
    fetchJson(calendarUrl)
  ]);
  const now = resolveNow(args.at, zmanim);
  const output = buildPayload({ IDX_0: zmanim, IDX_1: calendar }, { now });

  if (args.json) {
    console.log(JSON.stringify({ now: now.toISOString(), output, source: { zmanimUrl, calendarUrl } }, null, 2));
    return;
  }

  console.log(`${output.date} | ${output.hdate} | ${output.parasha}`);
  console.log(`${output.period} at ${output.current_time}`);
  for (const [label, time] of output.times || []) {
    console.log(`  ${label}: ${time}`);
  }
  console.log(`Location: ${output.location}`);
}

main().catch((error) => {
  console.error(`zmanim tester failed: ${error.message}`);
  process.exitCode = 1;
});
