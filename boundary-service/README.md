# Zmanim boundary display

This Pi service renders the existing full-screen Liquid template with the
canonical `scripts/zmanim_transform.js`, then serves the Redirect plugin's
`filename`, `url` and `refresh_rate` response. It binds only to
`127.0.0.1:8794`; the public allowlist in `abie.live` exposes `/trmnl/display`,
`/trmnl/health` and content-addressed PNGs at `zmanim.abie.live`.

## Timing and failure behavior

The opt-in `transitionMetadata` transform option reports an ISO timestamp for
the earliest selected event expiry, period change, sunset/date change or local
midnight. It does not change the normal plugin output. Event rows expire one
millisecond after their inclusive boundary. Midnight uses Milwaukee civil time,
not a 24-hour duration across DST. Both transform copies must stay identical.

The worker pre-renders the next screen when the transition is within 16 minutes.
HTTP requests only select a ready image: they do not fetch sources or launch a
renderer. Device sleep is capped at 15 minutes for weather, or shortened to the
next boundary plus three seconds. Redirect's 60-second minimum and device clock,
network and e-ink latency preclude an exact-second guarantee. Once a frame's
boundary passes, it cannot be served; a missing next image displays a clear
refresh-delay screen and requests a 60-second retry. Restart regenerates images
from the retained data and current code. Cached solar data is accepted only when
the canonical transform finds the actual current day. Images expire from disk
after two days, except active/fallback frames.

Hebcal solar/calendar data is fetched independently every six hours with current
and future civil dates. A private Python helper reads only weather, AQI and lunar
inputs from the existing Zmanim merge every 15 minutes; account/device metadata
is discarded. Weather retains the canonical three-hour freshness check. The
source helper can request a refresh of the original merged plugin and its
dependencies using `TRMNL_REFRESH_ALIAS`. A queued refresh is asynchronous: the
following read may still contain the previous observations, which remain subject
to their own freshness checks. Ambiguous refresh submissions are not replayed.

**Activation gate:** keep the original playlist item visible until both the
Redirect image is verified and ongoing source refresh is configured. A hidden
merged plugin does not continue scheduled source updates by itself. A legacy
`user_` account key can create/configure Redirect but cannot add playlist items
or call the current refresh API. Use a current scoped account key with `read`
and `content` access to the existing source/merge plugins and this device, or
complete the playlist setup in the signed-in UI. Do not bypass these limits.
The runtime key stays in the existing shared credential store; only its alias
belongs in `/etc/trmnl-boundary.env`.

## Installation and release

1. Run `npm test` in the parent; inspect an actual Pi-rendered 800x480 1-bit PNG.
   Commit/push the plugin mirror, parent tooling and `abie.live` routing change.
   Verify clean Pi checkouts, then fetch/pull `main --ff-only` (never overwrite
   the historical dirty `/var/www/trmnl-zmanim` checkout).
2. Back up existing `/usr/local/lib/trmnl-boundary`, its systemd unit,
   `/etc/trmnl-boundary.env` if present, and the Zmanim nginx vhost into a private
   timestamped `/home/xander/deploy-backups` directory. Record source commits
   and file hashes. Save the current TRMNL plugin settings, markup and playlist.
3. Install Debian `chromium`, `fonts-noto-core` and ImageMagick (`convert`).
   Stage `boundary-service/`, `scripts/zmanim_transform.js` and
   `plugins/zmanim/src/full.liquid` under `/usr/local/lib/trmnl-boundary`, retaining
   that relative structure. Run `npm ci --omit=dev` in `boundary-service` using a
   task-owned npm cache. Do not change global npm-cache ownership.
4. Create `/var/lib/trmnl-boundary` owned by `xander`, mode 0700. Run
   `node boundary-service/assets.cjs /var/lib/trmnl-boundary/assets` as that user.
   This downloads the pinned official TRMNL Framework 3.4.6 and embeds its fonts
   locally. Generated assets, input caches and rendered files are runtime-only.
5. The existing Pi `/home/xander/.shared-credentials.env` unlocks its existing
   shared store through `start.sh`. Never pass this shell-format unlock file
   to systemd `EnvironmentFile`: invalid assignments can be logged verbatim.
   Verify `trmnl:zmanim` is usable without displaying it. Set
   `TRMNL_REFRESH_ALIAS=<approved-current-account-key-alias>` in the optional
   root-owned `/etc/trmnl-boundary.env`; never put the value there. This key must
   already be installed through the documented credential workflow.
6. Install `trmnl-boundary.service` into `/etc/systemd/system`, daemon-reload and
   enable/start only that service. Chromium retains its sandbox and runs as the
   unprivileged user. The service has a 900 MB memory limit, 256-task limit and
   read-only source/home filesystem; only its state and private temp are writable.
7. Back up, install and `nginx -t` the tracked
   `abie.live/deploy/nginx/zmanim.abie.live.conf`, then reload nginx. No DNS or
   tunnel change is needed. Run that repo's security checks at origin/public.
8. Configure Redirect's `url` to `https://zmanim.abie.live/trmnl/display`.
   Add it to device 27064 only after validation; hide original item 887709 without
   deleting it. Keep the existing merge plugin 140532 and its dependencies.
   Disable "Wait for the next update" if it overrides Redirect's timing.
   Verify settings/readback, the served device image and a new hardware check-in.
   HTTP success and a check-in are not a photograph of the physical panel.

## Checks and rollback

- `curl -fsS http://127.0.0.1:8794/trmnl/health`
- `curl -fsS https://zmanim.abie.live/trmnl/display`
- `systemctl status trmnl-boundary.service`
- `journalctl -u trmnl-boundary.service`: display requests record time, image hash,
  target transition and fallback status, never credentials or source payloads.
- Confirm forbidden routes such as `/trmnl/input.json` return 404; the service
  accepts only GET/HEAD. PNG replies have a correct Content-Length.
- Restore original visible playlist item 887709 and hide Redirect for immediate
  display rollback. Restore backed-up service/source/vhost files as needed,
  validate nginx before reload, and restart only this service. Keep backups.

## Installed state (November 14, 2026)

The service and HTTPS endpoint are installed and verified. Redirect instance
`541366` has the endpoint configured; it is not yet in the device playlist.
Original item `887709` remains the sole visible item. Activation is pending
playlist access and a current account API credential for continued refresh of
source plugins after hiding the original merged item. Local browser access was
disabled during this release, and the available account key is legacy.

Validation: 265 Node tests passed; actual Pi rendering switched Latest Melave
Malka to tomorrow's Earliest Daven across a simulated timestamp boundary; public
PNG is 800x480, 1-bit, with correct Content-Length. All 74 origin security checks
passed. Public checks passed 79/81; the two failures are unrelated existing
AltRainbow Ally routes returning 502. A photograph or boundary-aligned hardware
check-in is not yet verified. Source backups and detailed receipts stay local.
