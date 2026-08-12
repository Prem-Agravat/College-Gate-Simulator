# ID BATAVO — College Gate Simulator

POV: You are at your college gate.

A realistic, funny Indian/Gujarati college entrance simulator. Pick a role — student, ID checker, security free time, professor, or visitor — and live the gate.

## Run locally

```bash
npm install
npm run dev
```

## Stack

- React + Vite
- Local state only (no backend, no auth, no database)
- CSS/SVG scene (no heavy asset pipeline required)

## Audio

Sound unlocks after you click **ENTER COLLEGE**.

Place optional royalty-free files under:

```
public/audio/
  ambient/
  effects/
  music/
```

See `public/audio/README.md`. Until files exist, the app synthesizes ambient/effect fallbacks via the Web Audio API. Do not add copyrighted music.

## Roles

1. **Student** — personalize your ID, walk to the gate, show ID / talk / negotiate
2. **ID Checker** — inspect suspicious IDs, score decisions
3. **Security Free Time** — chai, music, phone, nap… until someone shows up
4. **Professor** — walk through; someone may try to follow
5. **Visitor** — visitor pass + security questions

## Scripts

| Command        | Description              |
|----------------|--------------------------|
| `npm run dev`  | Local development server |
| `npm run build`| Production build         |
| `npm run preview` | Preview production build |
