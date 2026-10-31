# Liquid Glass buttons

Existing setup: React, TypeScript, Tailwind CSS 4 and shadcn conventions.
UI directory: `components/ui/`, configured in `components.json`.
Tailwind entry: `styles/globals.css`. Shared button styles:
`styles/liquid-glass-button.css`, imported in `main.tsx` and embedded in the offline export.
No context provider, image asset or additional hook package is required.

With Node >=22.12 installed:

```sh
npm install
npm run build
```

`class-variance-authority`, `clsx` and `tailwind-merge` were already declared.
`@radix-ui/react-slot` was added to package.json. Installation and a full React build
were not run here because this environment has no Node/npm.

Component: `components/ui/liquid-glass-button.tsx`.
Demo: `components/ui/liquid-glass-button-demo.tsx`.
Exports: Button, LiquidButton, MetalButton, buttonVariants, liquidbuttonVariants.

The supplied LiquidButton was adapted to support anchor and native summary children
through Radix Slot, forward refs, unique SVG filter IDs and decorative spans instead
of nested divs. SVG definitions stay outside interactive elements.
MetalButton uses CSS hover/active states, retaining caller event handlers.

```tsx
<LiquidButton asChild size="lg">
  <a href="#/ru/request">Оценить проект ↗</a>
</LiquidButton>
```

The effect uses the supplied turbulence/displacement filter and inset shadows.
SVG backdrop filtering varies by browser; CSS blur is provided as a fallback.
Browser visual verification was unavailable. Syntax checks do not replace a full build.

Offline preview: `python3 scripts/build_site.py`, then open `Предпросмотр.html`.
The same visual layers are exported for three header controls and two hero links.
