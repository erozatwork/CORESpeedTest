# ⚡ OneCore React App

A modular, scalable React-based web application framework with real-time capabilities, state management (Zustand), and a clean structure for building complex enterprise-grade frontends.

---

## 🚀 Features

- 🔒 Authentication system (`auth/`)
- 🧠 Global state management with Zustand
- 🔌 Real-time communication via WebSockets (`socket/`)
- 📦 Modular layout with sections, routes, and providers
- 📁 Organized file structure for scalable development
- 🎨 Custom styles and responsive UI
- 🔍 Hook and helper utilities
- 🧱 Reusable components and layouts

---

## 🛠️ Tech Stack

- **ReactJS**
- **Zustand** (state management)
- **Socket.IO** (real-time support)
- **React Router**
- **TailwindCSS / Custom styles**
- **Service Worker** (optional PWA support)

---

## 📁 Folder Structure

\`\`\`
src/
│
├── \shared/ # Core Assets/Configuration
├── assets/ # Static assets (images, icons)
├── auth/ # Auth logic & context
├── components/ # Reusable UI components
├── helper/ # Utility/helper functions
├── hooks/ # Custom React hooks
├── layout/ # Page layouts
├── pages/ # Route-based views/pages
├── providers/ # Context or state providers
├── routes/ # Routing configuration
├── section/ # Section-specific features
├── styles/ # Global styles
├── utils/ # Shared utilities
├── zustand/ # Zustand state store
├── App.jsx # Root component
├── main.jsx # Entry point
\`\`\`

---

## ⚙️ Installation

\`\`\`bash

# Clone the repository

git clone https://github.com/SysDev-Integration/Core.React_Template.Ui
cd Core.React_Template.Ui

# Install dependencies

npm install

# Set up environment variables

cp .env.example .env

# Update .env with your configuration

\`\`\`

---

## 🔧 Environment Variables

This project uses Vite's environment variable system. All variables must be prefixed with `VITE_` to be exposed to the client.

### Required Variables

Copy `.env.example` to `.env` and configure the following:

| Variable          | Description                               | Example                  |
| ----------------- | ----------------------------------------- | ------------------------ |
| `VITE_API_URL`    | Primary API endpoint (used by httpClient) | `https://localhost:7002` |
| `VITE_SOCKET_URL` | WebSocket server URL                      | `http://localhost:9001`  |
| `VITE_PUBLIC_URL` | Application public URL                    | `http://localhost:5173`  |
| `VITE_API_KEY`    | API authentication key                    | `api_key`                |

### Optional Variables

| Variable               | Description                 | Default                                         |
| ---------------------- | --------------------------- | ----------------------------------------------- |
| `VITE_STAGING_API`     | Staging API URL             | -                                               |
| `VITE_DEVELOPMENT_API` | Development API URL         | -                                               |
| `VITE_VERIFY_TOKEN`    | Token verification endpoint | `/api/Authentication/verify_token`              |
| `VITE_LOGIN`           | Login endpoint              | `/super_application/api/authentication/request` |

See `.env.example` for the complete list of available variables.

**Note:** After changing environment variables, restart the dev server for changes to take effect.

---

## 🧪 Run the App

\`\`\`bash
npm run start
\`\`\`

App will run on [http://localhost:5173](http://localhost:5173)

---

## 📡 Running WebSocket Server

If your `socket/` folder includes a Node.js-based WebSocket backend:

\`\`\`bash
node socket/index.js

# or however your socket server is structured

\`\`\`

Make sure the WebSocket server listens on a different port (e.g., 4000).

---

## 🧱 Build for Production

\`\`\`bash
npm run build
\`\`\`

---

## 📷 Screenshots _(Optional)_

_Add screenshots._

---

## 🤝 Contributing

Pull requests are welcome. For major changes, open an issue first.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 📬 Contact

Created by [OneCoreDev](https://github.com/SysDev-Integration/Core.React_Template.Ui) – feel free to reach out!
