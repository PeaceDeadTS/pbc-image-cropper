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
- Cropping tools should:
  - Allow users to **move/scale/rotate** the image within a fixed frame.
  - Provide **intuitive controls** with clear visual feedback.
  - Avoid unexpected changes to original image quality; cropping and scaling must preserve as much fidelity as practical.
- Any new feature must respect existing cropping flows and not break the primary use case.

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
