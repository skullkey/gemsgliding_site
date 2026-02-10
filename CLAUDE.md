# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for the GEMS Thermal Soaring RC Gliding Club (www.gemsgliding.co.za). No build tools, no frameworks — just HTML, CSS, and vanilla JavaScript served by nginx on AWS EC2.

## Live site editing

You are editing the live site, so be careful!  Make sure you commit and push all changes.  

## Cache Busting

Cache busting is **manual** — the `?v=YYYYMMDD` query params on `styles.css` and `script.js` in `index.html` must be updated by hand when those files change. JSON files use `Date.now()` for automatic cache busting.

## Architecture

All website files live in `public/`. There is no build step.

- **`public/index.html`** — Single-page site. All content sections (About, Gallery, Location, Contact, SAMAA) open as modals over the hero landing page.
- **`public/styles.css`** — All styles. Responsive breakpoint at 768px. Dark theme.
- **`public/script.js`** — Gallery loading, modal system, lightbox viewer, hash-based routing with `history.pushState`.
- **`public/gallery.json`** — Array of gallery items (images and YouTube videos) with type, src, caption, and optional date fields. This is the primary content that gets updated.
- **`public/hero.json`** — Hero section config (image path, title, subtitle).
- **`public/images/`** — All image assets.

## Key Patterns

- **Modal system**: Navigation links use `#hash` anchors. JavaScript intercepts these to open/close modal overlays. Browser back/forward buttons work via `popstate` events.
- **Gallery**: Loads from `gallery.json` via fetch. Supports image and YouTube video types. Paginated (12 items/page). Items with dates sort by date descending, then undated items sort by filename.
- **Lightbox**: Full-screen image/video viewer triggered from gallery items. Supports Escape key and overlay click to close.

## Infrastructure

- **nginx.conf** — Server config. JSON/HTML: no-cache. Static assets (CSS/JS/images): 1-year cache with immutable. Security headers enabled. Gzip on.
- 
## Content Editing

- Gallery items: edit `public/gallery.json`
- Club info/contact/about: edit corresponding sections in `public/index.html`
- Hero image/title: edit `public/hero.json`
