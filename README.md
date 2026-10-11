# 💌 Birthday Website

A two-page, romantic birthday site. Plain HTML, CSS and JavaScript. No frameworks, no build step.

```
birthday-site/
├── index.html        ← welcome page (petals, button, music toggle)
├── birthday.html     ← main page (letter, polaroids, flip cards, cake, confetti)
├── style.css         ← shared styles
├── script.js         ← shared interactions + the names to personalize
└── assets/
    ├── images/       ← photo1.jpg, photo2.jpg, photo3.jpg (placeholders) + favicon.svg
    └── audio/        ← optional: put music.mp3 here
```

## 1. Make it yours

1. **Names:** open `script.js` and edit the two lines at the top:
   ```js
   herName: '[Her Name]',
   yourName: '[Your Name]',
   ```
2. **Love note:** in `birthday.html`, edit the text inside `<template id="loveNote">`. Blank lines become paragraphs. It types itself out when she scrolls to it, and tapping the letter shows it all at once.
3. **Photos:** replace `photo1.jpg`, `photo2.jpg`, `photo3.jpg` in `assets/images/` with your own, keeping the same file names. Portrait photos (4:5) fit the frames best. Then edit the captions in `birthday.html` (look for `<figcaption>`).
   - Tip: resize photos to about 1200 px on the long side so the page loads fast on her phone.
   - Want a different file type (e.g. `.png`)? Change the `src` in `birthday.html` to match.
4. **Reasons I love you:** edit the `flip-label` (front) and `flip-back` (back) text on each card. Copy a whole `<button class="flip-card">…</button>` block to add more, or delete one to remove it.
5. **Music (optional):**
   - Add a song as `assets/audio/music.mp3` (use something you have the rights to use).
   - If there is no file, the toggle plays a soft built-in music-box melody instead.
   - Music is **off by default**. She turns it on with the ♪ button, and it carries over to page 2.

## 2. Preview locally

Just double-click `index.html`, or run a tiny local server from this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## 3. Deploy: GitHub → Vercel

**Push to GitHub**

1. Create a new repository on GitHub (private is fine), for example `birthday-surprise`.
2. In this folder, run:
   ```bash
   git init
   git add .
   git commit -m "Birthday website"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/birthday-surprise.git
   git push -u origin main
   ```
   (Or drag the files into the repo using GitHub's **Add file → Upload files**.)

**Deploy on Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **Add New… → Project** and import your `birthday-surprise` repo.
3. Leave everything on the defaults: **Framework Preset: Other**, no build command, no output directory.
4. Click **Deploy**. In under a minute you'll get a link like `https://birthday-surprise.vercel.app`.

Every time you push a change to GitHub, Vercel redeploys automatically.

**Make the link personal (optional):** in your Vercel project, go to **Settings → Domains** to rename the `.vercel.app` address or connect a domain of your own, such as `happybirthday-sophia.com`.

## 4. Before you send it

- Open the link on your own phone first. Tap the button, flip every card, blow out the candles.
- Check that her name appears on both pages.
- Remember: phones usually block autoplay, so the first music tap has to come from her. That's expected.

## Notes

- Fonts (Playfair Display, Lora, Dancing Script) load from Google Fonts. Confetti loads from the canvas-confetti CDN. The site still works without them, just with fallback fonts and no confetti.
- Animations are turned down automatically for people who have "reduce motion" enabled on their device.
- All paths are relative, so it works at the root of a Vercel domain or in any subfolder.

Happy birthday to her. 🌹
