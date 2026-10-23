# Portfolio TODO

A card-by-card checklist for making every project card fully legitimate, then upgrading it. Written 2026-10-23.

## How to use this

Each card has two lists:

- **Make it legit:** fixes so the card, the repo, and your resume all say the same true thing. Do these first.
- **Upgrade:** moves the card up the status ladder: `Source code` → `Demo video` → `Live demo`.

When a card's work is done, apply its **Card change** to `src/data/projects.json`, then:

```bash
npm run verify     # build + validate cards + check every link
git commit -am "Upgrade <project> card" && git push    # Cloudflare deploys automatically
```

The build won't let a card overclaim. `"status": "live"` fails without `links.live`, and `"status": "video"` fails without `links.video`. Cards with `"hidden": true` are validated but not shown, so you can stage them early.

**Status ladder.** Pick the highest one that's true:
| Label | Means | Needs |
|---|---|---|
| Live demo | A recruiter can use it in one click, right now | `links.live` |
| Demo video | A recorded walkthrough (YouTube unlisted, Loom, etc.) | `links.video` |
| Source code | The repo is public and readable | `links.source` (every card) |

---

## 0. Launch (do this first)

All 7 visible cards are honest as-is, so ship now and upgrade later.

- [ ] Deploy to Cloudflare Pages (steps in `README.md`)
- [ ] Click the LinkedIn link once on the live site (the link checker can't verify LinkedIn)
- [ ] Look at the site on your phone, in both light and dark mode
- [ ] Optional: add a custom domain in the Pages project. Then set `site` in `astro.config.mjs` to it.
- [ ] Add the site to your GitHub profile: `gh api -X PATCH user -f blog="https://<your-domain>"`
- [ ] Add a "Portfolio" link to the profile README (`newwavejacob-web/newwavejacob-web`)

---

## 1. HealthDB (visible · Source code)

**Make it legit.** The full list is in `old-projects/ddsg/HealthDB.md` under "Back up what the resume says". In short:
- [ ] Snapshotting: resume claims it, but it's not started
- [ ] 5-node cluster: the code hardcodes 3 peers on localhost; make it configurable and run 5
- [ ] RPC timeout and retry: only the election timeout exists
- [ ] Persist `currentTerm` and `votedFor` (needed for the "crash-safe" claim)
- [ ] Finish commit index advancement and applying entries to the state machine
- [ ] TLS: remove "all over TLS" from the profile README, or add `tokio-rustls`
- [ ] Add a `README.md` (GitHub currently shows none; `HealthDB.md` is the content)
- [ ] Merge `wire-up-wal-raft` into `main`. GitHub's default branch `main` is one commit behind.
- [ ] Until the items above are done, edit the resume bullet to match the code

**Upgrade → Demo video**
- [ ] Script a 5-node local cluster (shell script or `docker-compose.yml`)
- [ ] Record a terminal session with [asciinema](https://asciinema.org) or a screen recording: start 5 nodes, write keys, kill the leader, watch re-election, read the keys back

**Card change:** `"status": "video"`, `"links.video": "<recording url>"`. Then mention snapshotting and 5 nodes in the summary, but only once they're real.

---

## 2. What 2 Watch (visible · Source code)

**Make it legit**
- [ ] **The site is down.** `what2watch.win` and `chidaucf.win` both timed out on 2026-10-22. Check the droplet: `docker compose ps`, `docker compose logs`, Caddy, and the Cloudflare DNS records.
- [ ] Settle the domain: the inventory says the CHIDA site is also planned for `chidaucf.win`. Give W2W `what2watch.win` only, and point CHIDA elsewhere.
- [ ] Your resume links `what2watch.win`, so make sure that exact URL works
- [ ] Confirm every item in `AUDIT_FINDINGS.md` is closed (the "Finish security remediation" commit)
- [ ] Add uptime monitoring so you hear about it before a recruiter does (UptimeRobot free tier, or a Cloudflare health check)
- [ ] Watch OpenAI API spend: set a hard usage limit, since a public demo can get hammered
- [ ] Add screenshots to the repo README

**Upgrade → Live demo**
- [ ] Site is back up and responding reliably

**Card change:** `"status": "live"`, `"links.live": "https://what2watch.win"`

---

## 3. BLE Mesh Sensor Network (**hidden** · senior design)

The repo is private right now, so this card stays hidden until it's public. The link checker will fail if you unhide it before then.

**Make it legit**
- [ ] Push the cleaned history from `~/Desktop/Projects/Sensor-Mesh` (`.browser/` and `.metadata/` are removed): `git push --force origin main`. Commit the new `.gitignore` first.
- [ ] Remove the build output folders (`GNU ARM v12.2.1 - Default/`, `outgoing/`, `sensor mesh 2`, `sensor mesh complete`) and the hotspot password from `siw_dual/wifi_app_config.h`. Replace it with a `wifi_secrets.h.example` that's gitignored.
- [ ] Lock down the Firebase Realtime DB rules for `ucf-jr-default-rtdb` (they're probably open)
- [ ] Write a README: an architecture diagram (MG24 nodes → BT mesh → SiW917 bridge → MQTT/Firebase → React Native app), hardware photos, build/flash steps, **the team members, and which parts were yours**
- [ ] Find out where the React Native app lives. Link it, or say it's in another repo.
- [ ] Make the repo public again: `gh repo edit newwavejacob-web/Sensor-Mesh --visibility public --accept-visibility-change-consequences`

**Card change (go live as Source code):** remove `"hidden": true`

**Upgrade → Demo video**
- [ ] Film the system end to end: change a sensor interval or toggle an LED from the phone, and show the node reacting while data shows up in Firebase. This is the strongest possible upgrade for this card, because hardware can't be a live demo.

**Card change:** `"status": "video"`, `"links.video": "<url>"`

---

## 4. Sealbound (visible · Source code · contributor)

**Make it legit**
- [ ] ⚠️ The local `old-projects/sealbound/` has about 184 uncommitted changes. Figure out which folder is canonical (`sealbound` or `sealbound-(4.7)`) before you touch anything.
- [ ] Ask the team whether they're OK with it being featured. Then add a "Team" or "Credits" section to the team repo README if it doesn't have one.
- [ ] `seal-bound.com` timed out on 2026-10-22. Fix it, or let it lapse and point people to itch.io.

**Upgrade → Live demo (one-click play)**
- [ ] In Godot 4.7, go to Project → Export → **Web**. Check **Thread Support: off** (single-threaded) so it runs without special COOP/COEP headers.
- [ ] Make sure Git LFS assets are pulled (`git lfs pull`) before exporting
- [ ] Create an itch.io page: upload the zip and set "This file will be played in the browser". If you exported with threads, also enable "SharedArrayBuffer support".
- [ ] Test it in a private window on desktop and on a phone. Add a controls blurb to the itch.io page.
- [ ] Put the play link on `seal-bound.com` too

**Card change:** `"status": "live"`, `"links.live": "https://<team>.itch.io/sealbound"`. Optionally add an extra `{ "label": "Website", "url": "https://seal-bound.com" }` once it's up.

---

## 5. LockIN (visible · Source code)

**Make it legit**
- [ ] Sync your local copy with GitHub: `git pull` in `~/Desktop/Projects/LockIN`. I removed `PrepCore/.build/` upstream, and your local `.build/` will be deleted, which is fine because it regenerates. If `README.md` conflicts, keep yours; the only upstream change was deleting a stray `p0-=` line.
- [ ] `LockIN/LockIN` is a nested git repo with about 15 uncommitted files. Fold it into the main repo (remove its `.git`, then commit), or turn it into a proper submodule.
- [ ] Push your newer local README
- [ ] Finish the Phase 3 on-device check from the README: redeem → wait → confirm auto-relock

**Upgrade → Demo video**
- [ ] Screen-record on device: shield blocks an app → answer questions → bank minutes → redeem → app unlocks → it relocks automatically. 60–90 seconds.

**Card change:** `"status": "video"`, `"links.video": "<url>"`

**Upgrade → Live demo (later)**
- [ ] Public TestFlight link. Note: shipping FamilyControls outside development needs Apple's **Family Controls (Distribution) entitlement**. Request it early, because approval takes time.

**Card change:** `"status": "live"`, `"links.live": "https://testflight.apple.com/join/<code>"`

---

## 6. PL/0 Compiler (visible · Source code)

**Make it legit**
- [ ] Rename the repo to match what it is: `gh repo rename pl0-compiler -R newwavejacob-web/MiniC-Compiler` (GitHub redirects the old URL). Update its description too, since it currently says "C compiler for a tiny pascal like language".
- [ ] Remove the generated files: `git rm elf.txt output.txt`, and add them to `.gitignore`
- [ ] Check your course's policy on publishing coursework (Spring 2025)

**Upgrade → Demo video (optional)**
- [ ] asciinema of `make run INPUT=examples/factorial.pl0`: the source, the generated code, the VM output. Add a couple of sample `.pl0` programs to the repo.

**Card change:** `"links.source"` → the new repo URL; optionally `"status": "video"` plus `"links.video"`

---

## 7. Solaris Shell (visible · Source code)

The card describes the single-file version that's on GitHub now.

**Upgrade the code (when you're back on the homelab)**
- [ ] Push the modular Conch version (9 modules, about 1.6k LOC) from Gitea to `Solaris-Shell`
- [ ] Pick one name. The folder says "conch", the banner says "SOLARIS", the title says "CONCH - N3WL1N3".
- [ ] Tone down the README claims ("Full POSIX Compliance", "Memory Safe - No leaks"), or back them up: a `valgrind --leak-check=full` run in CI, plus a test script
- [ ] Update the README I wrote. Remove the limitations that no longer apply (job control, multi-pipe).

**Card change:** update `"summary"` to mention job control, history, and tab completion, but only once that code is on GitHub

**Upgrade → Demo video**
- [ ] asciinema recording: boot sequence, a pipe, a redirect, a background job, `fg`

---

## 8. Molecule Ray Tracer (visible · Source code · In progress)

**Make it legit**
- [ ] Rename the repo: `gh repo rename molecule-ray-tracer -R newwavejacob-web/Learning_OpenGL`. Change the description from "OpenGL workthrough" to something like "GPU ray tracer for PDB molecular structures using OpenGL compute shaders".
- [ ] Add a README with what it does, build steps (CMake), and a screenshot
- [ ] Remove the leftover LearnOpenGL assets that aren't used (`backpack/`, `awesomeface.png`, `container.jpg`, `assignment2.zip`)

**Upgrade**
- [ ] Finish shading (normals → Lambert/Phong, CPK atom colors), camera controls, and maybe a BVH for big molecules
- [ ] Screenshot or a short orbit video of `dna.pdb`

**Card change:** remove `"inProgress": true` once it renders a shaded molecule; `"links.source"` → the new repo URL; optionally `"status": "video"`

---

## 9. Shadow of the Sword (**hidden** · ready now)

The source is public and the README states your role, so this card can go live today.

**Card change:** remove `"hidden": true`

**Upgrade**
- [ ] Record a 60-second gameplay clip: parrying, an enemy attack pattern, a lore book → `"status": "video"`
- [ ] Unity WebGL build → itch.io → `"status": "live"`

---

## Profile and resume cleanup

- [ ] Profile README: remove "all over TLS" (or add TLS to HealthDB)
- [ ] Resume HealthDB bullet: match the code until snapshotting, 5 nodes, and retry are done
- [ ] Pin your best 6 repos on your GitHub profile (only possible in the web UI: Customize your pins)
- [ ] Optional: some HealthDB commit messages on `main` have strong language, and recruiters do read commit history. You can leave them, or squash them when you merge `wire-up-wal-raft`.
- [ ] Optional: `"Jacob Roberts Resume with everything.pages"`: export it to PDF if you ever want that version on the site
