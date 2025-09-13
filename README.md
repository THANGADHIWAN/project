# My Blog (React + Vite + Decap CMS)

This repository demonstrates a simple setup where non-technical writers can edit content via `/admin`
and the site lists and renders Markdown posts.

## Quick start (local)

1. Clone this repo.
2. `npm install`
3. `npm run dev` (open http://localhost:5173)

## How content works

- CMS commits markdown files into `content/posts/*.md`.
- Before every build, `scripts/build-content.js` converts each `.md` into `public/content/<slug>.json` and creates `public/content/index.json`.
- The React app fetches `index.json` and per-post `<slug>.json` at runtime.

## Deploy to Netlify

1. Push this repo to GitHub.
2. In Netlify, create a new site from GitHub and select this repo.
3. Set build command `npm run build` and publish dir `dist` (netlify.toml already configured).

## Enable editing (Admin)

To enable CMS editing you'll need to enable **Netlify Identity** and **Git Gateway** for the repo:

1. On Netlify (site settings) → Identity → Enable Identity.
2. Identity → Services → Enable **Git Gateway**.
3. Invite users under Identity → Invite users. They will receive an email and can set a password.
4. Open `https://your-site.netlify.app/admin` and sign in.

### How writers add a raw .md file only

- Use the `Upload Markdown file` collection entry in the admin. Fill `Slug` with desired filename (no extension), paste raw markdown into the body, and click Publish. The CMS will create `content/posts/<slug>.md` in the repo.

## Notes and tips

- If you prefer drag-and-drop uploading of `.md` files directly to the repo via the browser, a custom endpoint using the GitHub API is required (not included)
- If you need instant site updates without rebuilds, switch to a hosted CMS (Sanity/Contentful). This repo uses a build-time approach (static JSON files in `public`) for simplicity.
