# Cube Solve 4 Ai 🧊🤖

**Cube Solve 4 Ai** is a complete, modern, responsive web application for solving, learning, practicing, and mastering the 3x3 Rubik's Cube. It combines interactive Three.js 3D graphics, a verified two-phase Herbert Kociemba solving engine, real-time camera scanning, manual color entry with strict parity validation, physical step-by-step guidance checklists, an algorithm database, comprehensive courses, a WCA speedcubing timer, and multi-language support (English, हिन्दी, and Hinglish).

---

## 🌟 Key Features

1. **Genuine Two-Phase Kociemba Engine**: Computes near-optimal solutions (around 20–22 moves) in milliseconds. Every single move sequence is strictly verified against an in-memory virtual cube before display.
2. **Beginner Layer-by-Layer Mode**: Pedagogical CFOP phases (Daisy/Cross, Corners, Middle Layer, Yellow Cross, OLL, PLL).
3. **Interactive 3D Rubik's Cube (Three.js)**: Full 360° orbit camera, layer rotation animations, raycasting sticker painter, and 2D net layout.
4. **Physical Turn Checklist**: Guides the cuber move-by-move. The app never auto-advances physical progress until the user confirms the turn on their real cube.
5. **WebRTC Camera Scanner**: Real-time video frame sampling using HSV & Euclidean color classification across the 9 grid patches with instant manual touchup.
6. **Speedcubing Practice Timer**: Official WCA 15-second inspection countdown with audio warning cues, spacebar/touch hold-to-start, and automatic Average of 5 (Ao5) and Average of 12 (Ao12) calculations.
7. **70+ Algorithm Library**: Searchable and filterable database for Beginner, F2L, 2-Look OLL, Full OLL, 2-Look PLL, Full PLL, and Roux cases with mini 3D cube demonstrators.
8. **Interactive Learning Academy**: 8 comprehensive stages from anatomy of the cube to advanced algorithms.
9. **Multi-Language Support (i18n)**: Instant switcher between English, हिन्दी (Devanagari script), and conversational Hinglish.
10. **Progress & Statistics Dashboard**: Personal bests, solve count, milestone badges, and session logs.
11. **Community Discussions**: Forum topics, replies, upvoting, and questions.
12. **PWA & Offline Readiness**: Service worker caching and web manifest for home-screen installation.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, PostCSS, Lucide Icons
- **3D Graphics**: Three.js (Scene, PerspectiveCamera, OrbitControls, WebGLRenderer)
- **Audio**: Procedural Web Audio API synthesizer (tactile mechanical clicks, whooshes, victory fanfare)
- **Routing**: React Router v6
- **Validation**: Strict mathematical permutation and parity validator
- **Backend / Auth**: Supabase integration ready (Google OAuth, cloud sync) with graceful IndexedDB/LocalStorage guest offline fallback

---

## 🚀 Quick Start & Local Setup

### 1. Prerequisites
- Node.js (v18 or newer recommended, tested on Node v24)
- npm or yarn

### 2. Installation
```bash
# Navigate to the project directory
cd cube-solve-4-ai

# Install dependencies
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run Automated Unit Tests
Verify cube math, parity validation, and Kociemba solver correctness:
```bash
npx tsx test/cube.test.mjs
```

### 5. Build for Production
```bash
npm run build
```

---

## ☁️ Supabase Cloud Sync Configuration (Optional)

Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```
If these variables are omitted, **Cube Solve 4 Ai** automatically runs in full local guest mode with IndexedDB/LocalStorage persistence.

---

## 🐙 Push to GitHub Repository

This repository is initialized locally with Git. To push to your GitHub account (`thevloger2024`):

1. Create a new empty repository on GitHub named `cube-solve-4-ai` (without initializing README or license).
2. Run the following commands in the project folder:
```powershell
git remote add origin https://github.com/thevloger2024/cube-solve-4-ai.git
git branch -M main
git push -u origin main
```
When prompted by Git, log in with your GitHub credentials or provide a Personal Access Token (PAT).

---

## 📜 License
MIT License. Created for the global speedcubing and puzzle-solving community.
