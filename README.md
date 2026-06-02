# Cavai High Impact Landing

Static landing page generated from `Cavai High Impact.pptx`.

## Files
- `index.html` – landing page structure
- `styles.css` – responsive styling
- `script.js` – reveal animations
- `sw.js` – offline cache service worker
- `_headers` – cache headers for Cloudflare-compatible static hosting
- `assets/` – extracted PPTX images/GIFs

## Usage
Open `index.html` directly in a browser or deploy the whole folder to any static host.

When deployed over HTTPS, the page registers a service worker that caches the full local site after the first successful visit. The page, CSS, JavaScript and local assets can then load again without an internet connection. External links still require internet access when clicked.
