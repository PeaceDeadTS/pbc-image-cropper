# PBC Image Cropper – Project Constitution

## 0. Mandatory Rules Files (Read First)

Before doing **anything** in this project, always read and follow the rules defined in:

- `.windsurf/rules/react.mdc`
- `.windsurf/rules/tailwind.mdc`
- `.windsurf/rules/typescript.mdc`

These files contain the authoritative guidelines for working with React, TailwindCSS, and TypeScript in this repository. All implementation and refactoring work **must** be consistent with these rules.

---

## 1. Project Purpose

PBC Image Cropper is a **front-end web application** that provides a professional, PBC-standard image cropping tool with:

- A fixed 2:3 aspect ratio as the primary standard.
- Support for rotation and precise positioning.
- Multiple output sizes for different use cases.
- A modern, accessible UI tailored for productivity.

The project is intended to be **public and reusable**, so all code, naming, and structure should remain clean, generic, and free of environment-specific or private details.

---

## 2. Tech Stack & Architecture

- **Framework**: React 18 (SPA)
- **Bundler/Dev Server**: Vite 5
- **Language**: TypeScript
- **UI Toolkit**: shadcn/ui + Radix UI primitives
- **Styling**: TailwindCSS (+ `tailwind-merge`, `class-variance-authority`)
- **State / Forms**:
  - `react-hook-form` (+ `@hookform/resolvers`, `zod` for validation)
  - Local component state via React hooks
- **Data / Async**: `@tanstack/react-query` when server-like interactions are needed
- **Internationalization**: `i18next` + `react-i18next` (+ `i18next-browser-languagedetector`)
- **Routing**: `react-router-dom`
- **Charts / Visuals** (if used): `recharts`
- **Notifications / Toasters**: `sonner`

The app is a **single-page application** built into static assets (HTML, JS, CSS, assets) located in the Vite `dist` folder.

---

## 3. Project Structure (High Level)

Key files and directories (non-exhaustive):

- `index.html` – Vite entry HTML.
- `src/` – main application source code.
  - `main.tsx` – React root entry.
  - `app` / `components` / `features` / `routes` – UI and feature modules (exact layout defined in codebase and must remain consistent).
- `public/` – static public assets (copied as-is).
- `tailwind.config.ts` – Tailwind configuration.
- `tsconfig*.json` – TypeScript project configs.
- `vite.config.ts` – Vite configuration.
- `PROJECT_CONSTITUTION.md` – this document.

Follow the existing folder/module structure when adding new files. Do **not** invent parallel, conflicting structures.

---

## 4. Coding Principles

### 4.1 General

- Always write **TypeScript**, not plain JS.
- Prefer **functional React components** with hooks over class components.
- Keep components **small, composable, and focused** on a single responsibility.
- Reuse existing UI primitives (shadcn/ui components, layout primitives) whenever possible before introducing new patterns.
- Never introduce environment-specific, secret, or deployment-related code into the repository.

### 4.2 Types & Validation

- Use **`zod`** schemas for validation of forms and domain objects where appropriate.
- Avoid `any`. Use **narrow, explicit types**.
- Prefer **type-safe APIs and hooks** (typed React Query, typed navigation, typed component props).

### 4.3 Styling & Layout

- Use **TailwindCSS** utility classes for styling, following `.windsurf/rules/tailwind.mdc`.
- For variant-heavy components, use **`class-variance-authority`** and `tailwind-merge`.
- Keep layout utilities and spacing consistent; avoid hardcoded arbitrary values when shared tokens/utilities are available.
- The main cropper workspace uses the Tailwind `container` with a **wider 2xl width (≈1600px)** to reduce excessive side gutters on large (e.g., 2K) displays while still keeping the content centered.
- The primary cropper layout is a **responsive grid**:
  - Mobile / small viewports: single-column flow (Original Image → Cropped Preview → Settings) for readability.
  - Desktop (`lg` and above): a 5-column grid split as **2 + 2 + 1** (Original Image – 2/5, Cropped Preview – 2/5, Settings – 1/5) so that image panels get most of the horizontal space.
- Vertical sizing of the Original Image and Cropped Preview panels should be **bounded by the viewport height** (e.g., using a `max-height` based on `100vh` minus header and paddings) to avoid overly tall panels on large screens.
- Prefer page-level scrolling over nested scrollbars inside the Original Image or Cropped Preview panels; inner scrollbars should be avoided unless there is a very strong UX reason.

### 4.4 React & Components

- Use function components with `FC<Props>`/typed props (as dictated by `.windsurf/rules/react.mdc`).
- Avoid prop drilling when a dedicated context or local state would be cleaner.
- Prefer controlled components for form elements, integrated with `react-hook-form`.
- Do not block the main thread with heavy computations; offload or debounce when necessary.

### 4.5 Async & Data Flows

- Prefer **`@tanstack/react-query`** for async data fetching, caching and invalidation.
- Clearly separate **UI state** from **server/remote state**.
- Handle loading/error states explicitly and provide user feedback via UI components and toasts (`sonner`).

---

## 5. Image Cropping Domain Rules

- The **2:3 aspect ratio** is the primary standard and must remain a first-class, well-tested path.
- Cropping is implemented via **`react-cropper`/`cropperjs`**. The **crop box is the single source of truth** for what will be saved:
  - The **Cropped Preview** panel and the saved image must always reflect exactly the contents of the crop box (1:1 pixels of the selected area, optionally rescaled by Output Size presets).
- Aspect ratio modes:
  - **Fixed presets** (e.g. PBC Standard 2:3, 16:9, 4:3, 1:1) must use a **strict aspect ratio constraint** – crop box resizing is constrained so that the ratio is preserved.
  - **Free Form** mode must allow the crop box to be resized in any shape (no fixed aspect ratio). Internally this is achieved by passing `NaN` to `setAspectRatio`.
  - Changing the aspect ratio in the UI must immediately update the crop box and the preview.
- Output Size behavior:
  - Output Size presets are **only available in PBC Standard (2:3)** mode. In any other aspect ratio mode (16:9, 4:3, 1:1, Free Form) the Output Size selector is disabled and effectively forced to `Original Resolution` to avoid distortion.
  - **`Original Resolution`** means: do **not** resample the cropped area; the output image resolution equals the raw pixel size of the crop box.
  - Preset sizes (e.g. 533×800, 600×900, 1000×1500, 1200×1800, 1280×1920, 1333×2000, 1400×2100, 1600×2400) may rescale the cropped content to the chosen resolution.
  - Presets whose **target height exceeds the original image height** must be disabled and marked with a localized “(unavailable)” suffix.
- The cropper must:
  - Allow users to **move/scale/rotate** the image within the crop box.
  - Apply an initial **auto-zoom** so that the full image height fits into the crop area container by default, minimizing the need for manual zoom on first load.
  - Avoid unexpected degradation of image quality; any scaling must be explicit and driven by Output Size presets.
- Export behavior:
  - The exported image format should default to the original file type (JPEG, PNG, WEBP), and the file extension displayed in the UI (e.g. `.jpg`, `.png`, `.webp`) must match the actual output format.
  - The **filename** is edited inline next to the Save button; clicking Save immediately downloads the file without intermediate modal dialogs.
  - Any new export-related feature must preserve the guarantee that the saved image matches both the crop box and the resolution information shown in the preview.

---

## 6. UI/UX Guidelines

- Prioritize **clarity and simplicity**. The interface should be usable by non-technical users.
- Maintain **visual consistency** using shared design tokens, shadcn/ui components, and Tailwind conventions.
- All interactive elements must have:
  - Clear affordances (it should look clickable or draggable when it is).
  - Keyboard accessibility where feasible.
  - Proper focus states.
- Keep copy (labels, tooltips, error messages) concise and user-friendly.

---

## 7. i18n & Content

- Use `i18next`/`react-i18next` for any text that might be localized.
- Do not hardcode user-facing strings directly in components if the app uses translation namespaces; instead, use translation hooks.
- Keep translation keys **descriptive and stable**.

---

## 8. Testing & Quality

- Follow eslint rules and fix reported issues before committing.
- Prefer **small, focused tests** for core logic (e.g., cropping math, ratio calculations) and critical UI interactions.
- Manually verify:
  - Initial load performance (no obvious blocking operations).
  - Main cropping flows on common viewport sizes.

---

## 9. Git & Workflow

- Keep commits **small and meaningful** with clear messages (e.g., `feat: add rotation controls`, `fix: correct 2:3 crop rounding issue`).
- Avoid committing temporary debug code, TODO comments without context, or commented-out blocks.
- When adding a new feature:
  1. Check existing patterns/components that can be reused.
  2. Align with `.windsurf/rules/*` and this constitution.
  3. Maintain backward compatibility of public APIs and core flows whenever possible.

---

## 10. What a New Assistant Session Must Do First

When a new AI assistant session starts and is asked to work on this project, it must:

1. Read and internalize:
   - `.windsurf/rules/react.mdc`
   - `.windsurf/rules/tailwind.mdc`
   - `.windsurf/rules/typescript.mdc`
2. Read this `PROJECT_CONSTITUTION.md`.
3. Inspect the existing code structure under `src/` before suggesting new patterns.
