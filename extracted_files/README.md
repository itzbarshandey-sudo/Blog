# Node — Barshan Dey's cybersecurity site

Static HTML/CSS/JS. No build step, no framework, no backend required. Blog posts are plain
Markdown files rendered client-side, per Path A of the launch plan.

## File map

```
index.html      Home — intro, interests, blog preview, CTA
blog.html       Blog listing — loads posts/manifest.json, renders cards + filters
post.html       Single post template — reads ?post=<slug>, renders posts/<slug>.md
resume.html     Resume — timeline, skills, projects (printable)
contact.html    Contact form (client-side validated demo — needs a real endpoint)
style.css       Shared design system (all pages)
script.js       Shared: mobile nav + contact form validation
blog.js         Blog listing logic
post.js         Single post rendering logic (uses marked.js from CDN)
posts/          Markdown posts + manifest.json
```

## Writing a new post (Path A: Markdown-based)

1. Create `posts/your-slug.md` with frontmatter:
   ```
   ---
   title: Your post title
   date: 2026-09-01
   category: network        # network | web | malware | privacy | awareness
   categoryLabel: Network
   excerpt: One sentence for the card and meta description.
   ---

   Your post body in Markdown starts here.
   ```
2. Add a matching entry to `posts/manifest.json` (same fields, plus `"slug"` and
   `"featured": true/false`).
3. That's it — no rebuild step. `blog.html` and `post.html` fetch the manifest and
   `.md` files directly at page load.

> Note: `fetch()` doesn't work on `file://` URLs. To preview locally, run a tiny server
> from this folder, e.g. `python3 -m http.server 8000`, then open `http://localhost:8000`.

If you outgrow this later, the plan's other two paths are still options: a headless CMS
(Sanity/Strapi) for a visual editor, or Notion-as-CMS via the Notion API — both would mean
swapping `blog.js`/`post.js` for API calls instead of `fetch()` on local files, while keeping
the same HTML/CSS.

## Deployment — matches your plan exactly

**1. Push to Git**
```
git init
git add .
git commit -m "Initial version of Node"
git branch -M main
git remote add origin https://github.com/<your-username>/node.git
git push -u origin main
```

**2. Connect to Vercel or Netlify**
- Vercel: New Project → import the GitHub repo → Framework Preset: "Other" (no build
  command needed, output directory is `/`) → Deploy.
- Netlify: Add new site → import from Git → build command: leave blank → publish
  directory: `/` → Deploy.
- GitHub Pages (simplest, zero extra account): repo Settings → Pages → Deploy from
  branch → `main` / root.

Any of the three redeploys automatically on every push to `main`.

**3. Point your domain at it**
In your registrar's DNS zone editor:
- `CNAME` record: `www` → `cname.vercel-dns.com` (or Netlify's equivalent, shown in
  their dashboard once you add the domain).
- `A` record: `@` (root) → the IP your host's dashboard gives you.
- Add the domain in the Vercel/Netlify dashboard, then enable automatic HTTPS — this
  is usually automatic within a few minutes once DNS propagates.

**4. SEO & analytics (already partly wired up)**
- Every page already has a `<title>`, meta description, canonical URL, and Open Graph
  tags — update the `og:url`/`canonical` values once your real domain is live, and
  add an actual `/assets/og-image.png` (1200×630) referenced in `index.html`.
- To add analytics, drop one script tag before `</head>` on every page:
  - Plausible (privacy-friendly): `<script defer data-domain="yourdomain.com" src="https://plausible.io/js/script.js"></script>`
  - Umami: similar single-line embed, see your Umami instance's tracking snippet.
  - Google Analytics: paste the gtag.js snippet from your GA4 property.

## Contact form

The form in `contact.html` validates in the browser but doesn't send anywhere yet.
Fastest options once you're on Netlify: add `data-netlify="true"` to the `<form>` tag
and Netlify will handle submissions for free. On Vercel, use a service like Formspree
or a small serverless function instead.
