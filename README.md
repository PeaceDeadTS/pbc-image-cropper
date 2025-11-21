# PBC Image Cropper

**Image Cropper for PBC** is a web application for professional image cropping according to PBC standards. It focuses on a fixed 2:3 aspect ratio as the primary flow, while still supporting other aspect ratios, zoom, rotation, and convenient export.

The app is a fully client-side SPA (React + Vite) and can be deployed as a static site.

---

## Features

- **PBC Standard (2:3)** – primary workflow with a strict aspect ratio lock and support for `Output Size` presets.
- **Additional aspect ratios**:
  - 16:9, 4:3, 1:1 – fixed aspect ratio presets.
  - Free Form – fully flexible crop box (no fixed aspect ratio).
- **Output Size**:
  - Presets are **only available** when the aspect ratio is PBC Standard (2:3).
  - In all other aspect ratio modes the selector is disabled and the effective behavior is always `Original Resolution`.
  - Presets whose target height exceeds the original image height are disabled and marked with an `(unavailable)` suffix.
- **Zoom & panning**:
  - Automatic initial zoom on load – image height fits into the crop area container.
  - Zoom slider controls the scale **relative to the initial auto zoom**, providing smooth control without aggressive jumps.
  - Dragging the image inside the crop box to reposition it.
- **Rotation**:
  - Single button to rotate the image by +90° (cycling 0 → 90 → 180 → 270 → 0).
- **Preview & final resolution**:
  - The `Cropped Preview` panel always reflects exactly what will be saved.
  - Displayed resolution matches the real resolution of the exported image.
- **Export**:
  - Output format by default matches the original file type (`image/jpeg`, `image/png`, `image/webp`).
  - Filename is edited inline in a text input.
  - File extension is displayed to the right of the filename (e.g. `.jpg`, `.png`, `.webp`).
  - The **Save Image** button immediately downloads the file without intermediate modal dialogs.
- **i18n**:
  - At least two locales: **en** and **ru** using `i18next` + `react-i18next`.
  - Language switcher in the header.

---

## Tech Stack

- **Framework**: React 18 (SPA, Vite)
- **Language**: TypeScript
- **Bundler / Dev server**: Vite 5
- **UI**: shadcn/ui, Radix UI, Tailwind CSS
- **Cropper**: `react-cropper` + `cropperjs`
- **State / Forms**: React hooks, `react-hook-form`, `zod`
- **i18n**: `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **Notifications**: `sonner`

See `package.json` for the full list of dependencies.

---

## Getting Started

### Requirements

- Node.js (recommended: LTS 18+)
- npm or a compatible package manager (pnpm, yarn – adapt commands as needed)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

By default, Vite will start a dev server at `http://localhost:5173` (or another available port).

### Build

```bash
npm run build
```

The production build will be output to the `dist/` directory.

### Preview (serve production build)

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Usage

1. Upload an image (via drag & drop or the **Browse Files** button).
2. Choose an aspect ratio if needed:
   - `PBC Standard (2:3)` – the primary flow, with `Output Size` presets available.
   - `Free Form` or other presets (16:9, 4:3, 1:1) – the crop box is fixed or flexible, but always uses `Original Resolution`.
3. Adjust zoom and position using the zoom slider and drag‑to‑move.
4. Rotate the image in 90° steps if required.
5. In the right column, edit the filename and confirm that the file extension matches your desired output format.
6. Click **Save Image** – the file will be downloaded in the current format with the active crop applied.

All aspect ratio and Output Size changes are immediately reflected in both the crop box and the preview.

---

## Project Guidelines

For any architectural or feature-level changes, please follow:

- `.windsurf/rules/react.mdc`
- `.windsurf/rules/tailwind.mdc`
- `.windsurf/rules/typescript.mdc`
- [`PROJECT_CONSTITUTION.md`](./PROJECT_CONSTITUTION.md)

New features must not break the primary PBC 2:3 flow or the guarantee that the **preview and the saved image always match the crop box**.

