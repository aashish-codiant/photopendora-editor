# PhotoPandora Editor Client

PhotoPandora Editor Client is a high-performance, interactive product personalization tool designed for Shopify. It enables merchants and customers to create, customize, and manage product designs using a powerful canvas-based interface.

Built with **React 19**, **Vite**, and **Konva**, the editor provides a smooth, real-time editing experience with advanced features like text manipulation, image uploads, and template management.

---

## 🎨 Key Features

- **Interactive Canvas Editor**: Powered by `react-konva` for seamless layering, transformations, and real-time previews.
- **Advanced Text Editing**: Support for curved text, custom fonts (via Google Fonts), colors, and effects.
- **Product Personalization**: Allow customers to add their own images, text, and ornaments to Shopify products.
- **Template Management**: Create and manage design templates for different product variants.
- **Asset Library**: Integrated management for images, icons, and ornaments.
- **Order & Design Workflow**: Complete lifecycle management from design creation to order fulfillment.
- **Modern UI/UX**: Built with Tailwind CSS v4 and Radix UI primitives for a sleek, responsive experience.

---

## 💻 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [Shadcn/UI](https://ui.shadcn.com/)
- **Canvas Engine**: [Konva](https://konvajs.org/) + [React-Konva](https://konvajs.org/docs/react/index.html)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Routing**: [React Router 7](https://reactrouter.com/)
- **Networking**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd photopandora-editor-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Create a `.env` file based on `.env.example` (if available) with your API endpoints and Shopify configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`.

---

## 📂 Project Structure

```text
src/
├── app/            # Application-wide providers and configuration
├── components/     # Reusable UI components (buttons, inputs, etc.)
├── features/       # Modular features containing components, hooks, and logic
│   ├── auth/       # Authentication and login flow
│   ├── editor/     # Core canvas editor (the heart of the app)
│   ├── products/   # Product listing and detail management
│   ├── designs/    # Design templates and saved user designs
│   └── orders/     # Order tracking and management
├── hooks/          # Global custom React hooks
├── layouts/        # Shared page layouts
├── lib/            # External library configurations (e.g., shadcn/utils)
├── pages/          # Top-level page components
├── services/       # API services and external integrations
├── store/          # Zustand global state stores
└── utils/          # Helper functions and constants
```

---

## 🛠️ Commands

- `npm run dev`: Starts the development server with HMR.
- `npm run build`: Generates the production bundle.
- `npm run lint`: Runs ESLint for code quality checks.
- `npm run preview`: Previews the production build locally.

---

## 📄 License

This project is private and proprietary. All rights reserved.
