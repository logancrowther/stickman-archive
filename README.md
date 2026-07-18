# Stickman Archive

A photo-collection web game. Stickmen of ~1000 different types wander across a
white screen; grab the camera, photograph them, and fill in your **Stickdex**.
Rarer stickmen are worth more money, and the **bounty frame** pays x20 for
photographing the type it's currently showing.

Every stickman is a procedurally drawn, jointed skeleton (two-bone IK limbs,
curved spine and limbs) whose look is derived from its name and description and
then hand-tuned per type.

## Running

It's a static site with no build step. Serve the folder over HTTP and open it:

```sh
# any static file server works, e.g.
npx http-server . -p 7000 -c-1
# then open http://localhost:7000
```

Opening `index.html` directly from the filesystem also works, but a local
server is recommended.

## Layout

| File | Purpose |
|------|---------|
| `index.html` | Page shell and UI elements |
| `style.css` | All styling |
| `js/data.js` | The 1000 stickman types (names, descriptions, rarity, value) |
| `js/appearance.js` | Procedural appearance + full skeleton rendering |
| `js/game.js` | World simulation, camera, bounty frame, Stickdex, saving |

Progress is saved to `localStorage` under the key `stickmanArchiveSaveV1`.
