# Sydney Jewish Events

A phone-first static site listing Jewish community events in Sydney: Shabbat and holidays, services, learning, culture, food, and community life, in person, hybrid, and online. List and calendar views, filters, add-to-calendar, share links, and an installable home-screen app. The palette is Israeli flag blue (`#0038B8`) and white, with navy text (`#0A1F5C`) and a light blue surface (`#E8EEFB`).

The site is plain HTML, CSS, and JavaScript. There is no build step. GitHub Pages should be served from the root of `main` (the repository owner turns Pages on; this repo does not enable it). GitHub Actions checks public-data privacy on pushes and pull requests.

Published URL: https://sfox2006.github.io/Sydney-Jewish-Events-/

Asset paths are relative (`./`, `styles.css`, `data/events.json`, `assets/…`), so the site works from that project-pages path, including the trailing hyphen in the repository name.

## What you can do

- Browse events in a three-day list, or switch to a week calendar. On a phone, the header stays compact, days swipe in a strip, and Filters opens a full-screen panel with large tap targets.
- Filter by category, movement, format (in person, hybrid, online), cost (free, paid, unknown), audience (including young adults 20s-30s), age, time of day, and highlights. Search matches the title, description, organiser, or venue. The page does not show or filter on kosher.
- Open an event for its description. Event page links go to the organiser's own page.
- Add an event to Google Calendar, download an ICS file, or open it in Outlook.
- Share a link that opens this site's own event view (`?event=` plus the event id).
- Install the page as an app with the header Install app button, next to Refresh and About. The button is shown in every browser unless the site is already open as an installed app. When the browser has offered an install prompt, the button opens it. Otherwise it shows steps for Chrome and Edge on a computer, Android Chrome, iPhone and iPad Safari, or Firefox on a computer. Refresh re-fetches `data/events.json` from the network whenever the device is online. The service worker keeps the app shell in `sydj-v1`, loads page navigations network-first so a stale cached page cannot hide Install app, and keeps a network-first data cache named `sydj-data-v1`. Manifest `start_url` and `scope` are `./`, so the install stays on the GitHub Pages path `/Sydney-Jewish-Events-/`.
- An event with `all_day` set to true is labelled All day in the list, the event detail, the calendar, and the share text, and it sorts ahead of timed events that day. Add to calendar downloads an all-day date (an `.ics` `VALUE=DATE` event). Events with `all_day` absent or false keep a clock time.
- The list and calendar include events from today through the next 31 days (Sydney time), evaluated in the browser. The date picker and day strip stop at that horizon.
- A multi-day event is shown on every day it runs, with a Day N of M badge.
- Unknown cost is shown as Unknown and is never treated as free. Unknown movement and audience are shown as Unknown.
- Prices are in Australian dollars. “Get the weekly email” opens a short note that the signup form is not open yet. It does not leave this site.

When `events` is empty, the page says “No events yet, data arrives after the first daily run”.

## Data

`data/events.json` is the only event source. Refresh it by replacing that file and pushing the commit Pages serves.

Public `source_ref` values must contain public provenance only. Keep private email messages, mailbox identifiers, Gmail inbox URLs, and audit files outside this repository. Before publishing an externally generated event file, run `node scripts/public-data.cjs --sanitize path/to/events.json` outside the repository, then copy only the validated public result to `data/events.json`. The sanitiser removes whole labelled mailbox-provenance segments from `source_ref`, retains public URLs and social references, and rejects other private mailbox metadata. It does not change event facts or religious coverage. Run `node scripts/public-data.cjs --check` and `node --test tests/*.test.cjs` before pushing; CI repeats these checks. There is no separate generated event output or collector in this repository.

```json
{
  "generated": "2026-10-11T08:30:00+11:00",
  "timezone": "Australia/Sydney",
  "window": ["2026-10-11", "2026-12-10"],
  "events": []
}
```

`generated` is an ISO 8601 timestamp. `events` is an array of objects. A pipeline may also include `timezone` (`Australia/Sydney`) and `window` (the file’s cut-off dates). The page reads `events` and ignores `window`, so the site still loads when those fields are missing or have another shape.

| Field | Meaning |
| --- | --- |
| `id` | Stable string. Share links use `?event=` plus this id. |
| `title` | Event name. |
| `org` | Organiser or venue name. |
| `start` | ISO 8601 start with a Sydney offset, for example `2026-10-25T19:00:00+11:00`. |
| `end` | ISO 8601 end with a Sydney offset. If it is missing or not after `start`, the event is one day and calendar exports use one hour. If it falls on later days, the event is listed on each of those days. An end time of exactly midnight does not add that next day. |
| `all_day` | Optional boolean. When `true`, the event is shown as All day instead of a clock time, listed first that day, and calendar files use an all-day date. Missing or `false` keeps the clock time. |
| `venue` | Place name. |
| `address` | Street address. Left blank when the organiser has not published one. |
| `maps_url` | Link opened from the venue line. |
| `url` | The organiser's own event page. |
| `category` | One of `shabbat_holidays`, `services`, `social_young_professionals`, `learning`, `arts_culture`, `food_drink`, `community_service`, `israel`, `sports_fitness`, `family`, `networking`, `other`. |
| `format` | `in_person`, `hybrid`, or `online`. |
| `cost` | `Free`, a price such as `A$15`, or `Unknown`. Unknown is never treated as free. |
| `age` | `all_ages`, `18+`, `21+`, or `unknown`. The age filter matches this field exactly. |
| `tags` | Booleans: `free_food`, `free_drinks`, `free_entry`, `young_adults`, `outdoor`. |
| `description` | Plain text shown when the event is opened. |
| `source` | Where the event was found. |
| `movement` | Optional. One of `reform`, `conservative`, `orthodox`, `chabad`, `pluralistic`, `secular_cultural`, `israeli`, `unknown`. Missing values are shown as Unknown. |
| `kosher` | Optional field the data pipeline may still supply (`kosher`, `kosher_style`, `not_kosher`, `unknown`). The page ignores it: no filter, badge, detail line, search field, or share parameter. |
| `audience` | Optional. One of `20s_30s`, `students`, `families`, `all`, `seniors`, `unknown`. `20s_30s` is young adults in their 20s and 30s. Missing values are shown as Unknown. |

Times on the page are Sydney time (`Australia/Sydney`). Dates are shown day-month, and prices are in Australian dollars.

Events in this file were checked against the organiser's own pages in October 2026. Standing synagogue times are the timetables those synagogues publish, expanded across 11 October to 28 November 2026. Where a street, price, or end time was not published, the field is left blank or set to Unknown, and the description says so.

Organisations with listings: The Great Synagogue (CBD), Central Synagogue (Bondi Junction), Emanuel Synagogue with Netzer Sydney (Woollahra), Adamama / Shalom Collective, SHIR at the Sydney Opera House, the NSW Jewish Board of Deputies, the Zionist Council of NSW with Ha'moadon, the Jewish Climate Network, Sydney Jewish Museum, JewishCare (North Shore seniors, Lindfield), Maccabi NSW Basketball, and the Jewish International Film Festival at Ritz Cinemas, Randwick.

These were checked and not given a dated listing, because no upcoming public time and place could be confirmed: North Shore Synagogue, Lindfield (service times are only in the weekly newsletter), Chabad Bondi and Chabad North Shore (no public session still ahead with a confirmed clock time), JCA (named as a funder of the Jewish Roots Festival, with no standalone event), AUJS, Hillel, AIJAC, ECAJ, NCJWA NSW (its 5 October concert had already been held), Limmud Oz (the published festival was Melbourne, June 2025), the Sydney Jewish Writers Festival, Hakoah, and the day schools. JIFF also screens at Roseville Cinemas from 29 October to 11 November 2026; those session times were not copied because the cinema page could not be read reliably. Maccabi's mixed social netball is listed as one season at Waverley Courts from 5 October to 7 December, 6.30pm to 8.30pm, without separate round dates. “We Are One”, the Chanukah gathering at Bondi Beach on 6 December 2026, has a date and place but no published start time. Habonim Dror's Yom Habo listing gave a midnight start that does not match its own “Sunday afternoon” description, so it is left out.

## Fonts

Inter and Crimson Pro are shipped in `fonts/` under the SIL Open Font License.
