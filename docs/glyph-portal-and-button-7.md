# Typography and expanding buttons

The project already supports TypeScript, Tailwind CSS 4 and shadcn aliases.
Reusable UI components: `components/ui/`. Tailwind entry: `styles/globals.css`.
No directory migration or setup is required.

`components/ui/glyph-portal.tsx` adapts the supplied Glyph Portal and retains its MIT
copyright notice. Its shared DOM engine is `lib/glyph-portal.js`; styles are in
`styles/glyph-portal.css`. The main page deliberately uses `typographyOnly` to
adopt the reference's 84%-width / 38%-height framing without scroll zoom.
Nurba is live measured SVG text. Four unshaded flower images remain static behind it.
The original scrolling behaviour can be explored with `glyph-portal-demo.tsx`.

The demo's Jakarta font is referenced through @font-face with font-display optional.
If the CDN is unreachable, Arial is used. A local download was unavailable because
shell DNS could not resolve cdn.21st.dev in this environment.

`components/ui/button-7.tsx` exports Component, with label, expandedWidth and asChild.
It uses Radix Slot for native links/summary elements and lucide-react ArrowRight.
Styles: `styles/button-7.css`. Demo: `components/ui/button-7-demo.tsx`.
The three header controls expand on hover, keyboard focus or when a menu is open.
Touch devices show labels immediately; reduced-motion disables transitions.
Labels remain black to retain the user's colour choice.

No additional dependencies beyond those already declared are required for these changes.
Run `npm install` then `npm run build` with Node >=22.12 to install the previously
added Radix Slot package and perform the full React build.
Node/npm are unavailable in this execution environment, so validation used the
Python offline exporter, TSX syntax/transpilation and JavaScriptCore runtime checks.
Browser rendering has not been visually verified here.

Offline export: `python3 scripts/build_site.py`. Open `Предпросмотр.html`.
