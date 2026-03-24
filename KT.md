# PhotoPandora Editor - Knowledge Transfer

## 1. Project Summary

This repository is a frontend prototype for a product-personalization workflow.

Primary goals:

- provide a small dashboard shell for products, assets, designs, and orders
- open a dedicated editor experience at `/editor`
- let a user add text/images on top of a product canvas
- autosave/export the current design locally

Current state:

- the app shell is functional
- auth is mock-only and stored in a Zustand store in memory
- the active editor UI exists under `src/editor`
- backend/API integration is not finished
- product template loading is not implemented yet, so the editor currently lands in an error state unless `loadProductTemplate()` is completed

## 2. Tech Stack

- React 19
- TypeScript
- Vite
- React Router v7
- Tailwind CSS v4
- shadcn styling imports
- Zustand for client state
- Konva / react-konva for canvas editing
- Lucide icons

Main scripts from `package.json`:

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run preview`

## 3. High-Level App Structure

### Routing

Defined in `src/App.tsx`.

- `/login` -> mock login page
- `/editor` -> standalone editor page
- `/` -> dashboard home
- `/products` -> product list
- `/designs` -> placeholder page
- `/assets` -> placeholder asset library
- `/orders` -> placeholder orders page

### Layout/Auth

- `src/layouts/MainLayout.tsx` provides the top navigation
- `src/components/ProtectedRoute.tsx` guards dashboard routes
- `src/store/authStore.ts` holds `isAuthenticated`, `login()`, and `logout()`

Important note: auth is not persisted. Refreshing the page resets login state.

## 4. Active Source Areas

### App shell

- `src/App.tsx`
- `src/main.tsx`
- `src/layouts/MainLayout.tsx`
- `src/pages/*`

### Active editor implementation

The editor currently used by routing is:

- `src/editor/Editor.tsx`

Main supporting files:

- `src/editor/store/editorStore.ts`
- `src/editor/store/historyStore.ts`
- `src/editor/components/CanvasStage.tsx`
- `src/editor/components/EditorToolbar.tsx`
- `src/editor/components/PropertiesPanel.tsx`
- `src/editor/components/LayersPanel.tsx`
- `src/editor/components/AssetLibrary.tsx`
- `src/editor/components/FontPanel.tsx`
- `src/editor/services/templateService.ts`
- `src/editor/utils/autoSave.ts`
- `src/editor/utils/exportDesign.ts`
- `src/editor/utils/generatePreview.ts`
- `src/editor/utils/generateSVG.ts`

### Possibly older / parallel editor code

There is a second editor code path under:

- `src/features/editor/*`

This folder is currently not routed from `src/App.tsx`. It looks like an alternate or earlier implementation and should be treated carefully before modifying or deleting it.

## 5. Editor Flow

### Entry

The editor reads URL query params:

- `platform`
- `shop`
- `productId`
- `variantId`
- `quantity`

These are read in `src/editor/Editor.tsx`.

### Initialization

On load:

1. `productId` is pulled from the URL
2. `loadProductTemplate(productId)` is called
3. if a template is returned, it is stored in Zustand and a random `designId` is created
4. if not, the editor shows an error screen

Current blocker:

- `src/editor/services/templateService.ts` returns `null`, so no product template is ever loaded

### Canvas behavior

The canvas is rendered with Konva in `src/editor/components/CanvasStage.tsx`.

Template drives:

- canvas width/height
- base product image
- personalization area rectangle
- allowed fonts/assets/designs
- content limits such as max text count / max characters

### Element model

Defined in `src/editor/types/element.ts`.

Supported element types:

- `text`
- `image`

Common editable fields:

- position
- rotation
- scale
- text/font/color properties
- image asset URL
- width/height

### Editor state

Managed in `src/editor/store/editorStore.ts`.

Core responsibilities:

- store all canvas elements
- track selected element
- hold the active template
- hold the generated `designId`
- track user-uploaded assets
- add/update/delete/reorder elements

### Undo/redo

Managed separately in `src/editor/store/historyStore.ts`.

Implementation details:

- snapshots of `elements` are stored in `past` and `future`
- state is deep-copied using `JSON.parse(JSON.stringify(...))`
- keyboard shortcuts are handled in `CanvasStage.tsx`

Shortcuts:

- `Ctrl/Cmd + Z` -> undo
- `Ctrl/Cmd + Shift + Z` -> redo

### Autosave

Implemented in `src/editor/utils/autoSave.ts`.

Behavior:

- debounced by 1 second
- saves to `localStorage`
- key format: `design_<designId>`

### Save/Export

Toolbar actions in `src/editor/components/EditorToolbar.tsx`:

- add text
- undo/redo
- export JSON
- save design
- delete selected element

`Save Design` currently:

- generates a canvas preview
- generates SVG content
- stores a mock design session in `localStorage` under `session_<designId>`
- triggers JSON export download

This is still client-side only, not a real API submission.

## 6. UI Pages Status

- `Home.tsx` -> simple welcome page
- `Products.tsx` -> mock product cards with links to `/editor`
- `Assets.tsx` -> placeholder skeleton grid
- `Orders.tsx` -> placeholder empty state
- `Designs.tsx` -> placeholder heading only
- `Login.tsx` -> mock login form with no backend validation

## 7. Environment / Backend Notes

`.env` currently contains:

- `VITE_API_URL`
- `VITE_STORAGE_URL`

Important caveat:

- the project currently does not consume these values in the active codepath
- `src/lib/config.ts` is empty
- `src/lib/apiClient.ts` is empty
- `prisma/` exists but is empty

This suggests backend integration was planned but is not implemented in this repo yet.

## 8. Styling Notes

- global styling is in `src/index.css`
- Tailwind v4 is used via CSS imports
- Geist Variable is the main font
- some shadcn/ui generated files exist under `src/components/ui`

The dashboard and editor are styled separately:

- dashboard pages use standard Tailwind utility classes
- editor uses a custom multi-panel layout with left/right sidebars and a center canvas

## 9. Build / Health Check

Current build status on March 24, 2026:

- `npm.cmd run build` fails

Observed TypeScript issues:

- `src/editor/services/templateService.ts` -> unused `productId`
- `src/features/editor/components/CanvasStage.tsx` -> unused `setElements`
- `src/features/editor/Editor.tsx` -> unused `useState`

Interpretation:

- the active app is partially wired
- the unused-code errors in `src/features/editor` block production build even though that folder is not the routed editor

## 10. Known Gaps / Risks

Most important gaps:

- product template loading is not implemented
- editor cannot complete a happy path without a real template source
- auth is mock-only and resets on refresh
- API client/config are empty
- assets/products/orders/designs pages are mostly placeholders
- build is currently red because of TypeScript errors
- there are two editor code paths, which can confuse maintenance

## 11. Recommended Next Steps

If someone is taking over this project, the practical order is:

1. implement `loadProductTemplate(productId)` in `src/editor/services/templateService.ts`
2. decide whether `src/features/editor` should be deleted, merged, or completed
3. fix current TypeScript build errors
4. wire `VITE_API_URL` / `VITE_STORAGE_URL` into `src/lib/config.ts` and `src/lib/apiClient.ts`
5. replace mock auth with real authentication if dashboard protection matters
6. connect save/export flow to backend persistence instead of only `localStorage`
7. finish placeholder pages or reduce scope if the editor is the only real deliverable

## 12. Files To Read First

For fastest onboarding, start here:

1. `src/App.tsx`
2. `src/layouts/MainLayout.tsx`
3. `src/editor/Editor.tsx`
4. `src/editor/store/editorStore.ts`
5. `src/editor/components/CanvasStage.tsx`
6. `src/editor/components/EditorToolbar.tsx`
7. `src/editor/services/templateService.ts`
8. `src/editor/types/template.ts`
9. `src/editor/types/element.ts`

## 13. One-Line Handoff

This repo is a frontend personalization-editor prototype with a working UI shell and local editor state, but it still needs template loading, backend wiring, and build cleanup before it behaves like a complete production app.

## Folder Structure 

```
src/
├── app/               # Global images, fonts, icons
│   ├── providers/     # 
│   └── Routes/        # 
├── assets/            # Global images, fonts, icons
├── components/        # Shared, UI-only components (Button, Input, Card)
│   ├── shared/        # Shared Components
│   └── UI/            # Shadcn Ui components
├── editor/            # Editor Module
├── config/            # Environment variables and global config
├── features/          # The heart of the app
│   ├── assets/        # Feature module: Assets
│   ├── auth/          # Feature module: Authentication
│   │   ├── api/       # Auth-specific API calls
│   │   ├── components/# Auth-specific components (LoginForm, SignupForm)
│   │   ├── hooks/     # Auth-specific hooks (useAuth, useUser)
│   │   ├── types/     # TypeScript interfaces for this feature
│   │   ├── utils/     # Helper functions for auth logic
│   │   └── index.ts   # Public API for the feature (exports only what's needed)
│   ├── profile/       # Feature module: User Profile
│   └── dashboard/     # Feature module: Main Dashboard
├── hooks/             # Global, reusable hooks (useLocalStorage, useWindowSize)
├── layouts/           # Page layouts (MainLayout, AdminLayout)
├── lib/               # Configurations for external libs (axios, react-query)
├── providers/         # Global Context/State providers
├── routes/            # Route definitions and protected routes
├── services/          # Global API services or SDKs
├── types/             # Global/Shared TypeScript types
└── utils/             # Global utility functions (formatDate, currency)
```