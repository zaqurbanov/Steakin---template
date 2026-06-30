# Steak In

> A static, multi-page restaurant website template — pure HTML, SCSS and vanilla JavaScript. No build tooling, no framework, no `package.json`.

🇬🇧 **English** | 🇦🇿 [Azərbaycan dilində oxu](README.az.md)

---

## Overview

**Steak In** is a restaurant/steakhouse website template made of plain `.html` pages that share a common header, navigation and footer. Styling is authored in SCSS and compiled to a single CSS file; interactivity (page transitions, mobile nav, dark mode, cart, booking modal, carousels) is handled by two small vanilla-JS files. There is no bundler, no package manager and no test suite — you can open the pages directly in a browser or serve the folder with any static file server.

## Pages

| File | Description |
|---|---|
| `index.html` | Home page — hero, about, menu highlights, awards slider, testimonials, "Book a Table" trigger |
| `chefs.html` | Chefs / team page |
| `menuboard.html` | Menu board listing |
| `story.html` | About / our story page |
| `products.html` | Product/menu items with add-to-cart cards |
| `contact.html` | Contact page with form |

All pages link to the same compiled stylesheet (`assets/scss/main.css`) and share the same head boilerplate (anti-flash theme script, Font Awesome, Swiper CSS).

## Getting Started

There is no build step required to view the site — `assets/scss/main.css` is already compiled and committed.

1. Clone or download the repository.
2. Open `index.html` directly in a browser, **or** serve the project root with any static server, e.g.:

```bash
# Python
python -m http.server 5500

# Node (npx, no install needed)
npx serve .
```

3. Navigate the site via the nav links — page transitions, dark mode, the cart, and sliders all work without a server (though serving over HTTP avoids `file://` quirks).

### Editing styles (SCSS)

Source styles live in `assets/scss/` and compile to `assets/scss/main.css` (+ `main.css.map`). There is no npm script — compile with the [Dart Sass CLI](https://sass-lang.com/install) or an editor extension such as VS Code's "Live Sass Compiler":

```bash
sass assets/scss/main.scss assets/scss/main.css
```

> After editing any `.scss` partial, **recompile** so `main.css` stays in sync. Editing `main.css` directly will eventually be overwritten — always change the source partials.

## Architecture

### SCSS structure

Import order is centralized in `assets/scss/main.scss`. Partials are organized by role:

| Folder | Contents | Notes |
|---|---|---|
| `abstracts/` | `_mixin.scss`, `_variables.scss`, `_functions.scss` | No CSS output; imported first |
| `base/` | `_reset.scss`, `_typograpy.scss`, `_dark-mode.scss` | `_dark-mode.scss` is imported **last** so its overrides win |
| `components/` | `_buttons.scss`, `_slider.scss`, `_theme-toggle.scss`, `_cart.scss`, `_modal.scss`, `_page-loader.scss` | Reusable UI pieces |
| `layouts/` | `_header.scss`, `_navigation.scss`, `_footer.scss`, `_forms.scss`, `_menu.scss` | Structural chrome shared across pages |
| `pages/` | `_home.scss`, `_story.scss`, `_chefs.scss`, `_product.scss`, `_contact.scss` | One partial per page, page-specific styles |

Dark mode is implemented via a `[data-theme="dark"]` attribute on `<html>`. When adding new components or colors, add matching overrides in `base/_dark-mode.scss` rather than hardcoding a second color scheme inline.

### JavaScript

No bundler/modules — `script.js` and `slider.js` are loaded as plain `<script>` tags. Check each page's bottom `<script>` includes, since not every page needs `slider.js`. Swiper.js and Font Awesome are pulled from CDNs in each page's `<head>`.

**`script.js`** bundles several independent features:

- **Page loader / transition** — fake loading screen on load; intercepts same-page `.html` link clicks and animates between pages (`PAGE_TRANSITION_DELAY`).
- **Mobile nav toggle** — the `.bars` hamburger toggles `.nav-list`.
- **Scroll-aware nav** — adds `.active` to `.nav` past `250px` of scroll.
- **Dark mode toggle** — theme is set pre-paint by an inline anti-flash `<script>` in each page's `<head>` (reads `localStorage.theme`); `script.js` then wires up the `.theme-toggle` button to flip the `data-theme` attribute and persist the choice.
- **Cart system** — client-only, persisted to `localStorage` under the key `steakin_cart`. The cart drawer/overlay markup is generated dynamically in JS (not present in the HTML). `.card-button` elements read `.name` / `.price` text content from the closest `.card`, so product cards must keep the `.card > .name`, `.card > .price` structure for add-to-cart to work.
- **Book a Table modal** — only wired up if `.book-table-trigger` elements exist on the page (currently `index.html`); modal markup is also generated dynamically in JS.

**`slider.js`** only configures Swiper instances: `.card-swiper`, `.award-slider`, `.quoteSlider`, `.customer-slider`. Only include it on pages that actually contain those elements.

### Theming / dark mode flow

1. An inline anti-flash `<script>` in each page's `<head>` reads `localStorage.theme` and sets `data-theme="dark"` on `<html>` before first paint (avoids a flash of the wrong theme).
2. `script.js` binds a click handler on `.theme-toggle` that flips the attribute and writes the new value back to `localStorage`.
3. `base/_dark-mode.scss` is imported last in `main.scss` so its `[data-theme="dark"]` overrides win over base styles.

When adding a new HTML page, copy the anti-flash snippet verbatim from an existing page's `<head>`.

## Project Structure

```
Steakin---template/
├── index.html              # Home page
├── chefs.html               # Chefs / team page
├── menuboard.html            # Menu board
├── story.html                # About / our story
├── products.html             # Products with add-to-cart cards
├── contact.html               # Contact form
├── script.js                  # Page loader, nav, dark mode, cart, booking modal
├── slider.js                  # Swiper carousel configs
├── assets/
│   └── scss/
│       ├── main.scss          # Import entry point (compiles to main.css)
│       ├── main.css           # Compiled output (committed)
│       ├── abstracts/         # Variables, mixins, functions
│       ├── base/              # Reset, typography, dark mode
│       ├── components/        # Buttons, slider, theme toggle, cart, modal, page loader
│       ├── layouts/            # Header, navigation, footer, forms, menu
│       └── pages/              # Per-page styles
├── images/                    # Product, team, customer, client-logo and background images
└── CLAUDE.md                  # Guidance notes for working in this repo
```

## Conventions

- No package manager, no linter/formatter config, no test suite — there is nothing to "run" beyond opening the HTML files in a browser or serving the directory statically.
- Keep new pages consistent with existing ones: copy the shared `<head>` boilerplate (anti-flash theme script, `main.css` link, Font Awesome, Swiper CSS), nav markup, and footer from an existing page rather than rewriting them.
- When extending `script.js`, keep new features in their own clearly separated block rather than entangling with existing ones.
