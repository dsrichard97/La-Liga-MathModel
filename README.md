# ⚽ La Liga Math Model & Liga MX Analytics Hub

[![Live Demo](https://img.shields.io/badge/Live%20Site-GitHub%20Pages-00E5FF?style=for-the-badge&logo=github&logoColor=white)](https://dsrichard97.github.io/La-Liga-MathModel/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![D3.js](https://img.shields.io/badge/D3.js-v7-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white)](https://d3js.org/)

> **Live Deployment:** [https://dsrichard97.github.io/La-Liga-MathModel/](https://dsrichard97.github.io/La-Liga-MathModel/)

An advanced soccer analytics platform combining Mexican First Division (**Liga MX** Apertura & Clausura) statistics, EA Sports FC-style team chemistry depth charts, D3.js radar comparison charts, and an interactive **"La Liga"** algorithmic model builder.

---

## 🌟 Key Features

- ⚛️ **Math-Soccer Atomic Emblem**: Custom SVG blending truncated icosahedron soccer ball vertex indices with rotating atomic orbitals and mathematical operators ($\Sigma, \pi, \int, \Delta$).
- 🧮 **Custom "La Liga" Algorithmic Model Builder**:
  - Interactive multi-weight sliders: Progressive Passing, Expected Threat ($xT$), Finishing Clinicality ($G/xG$), Press Resistance, Transition Duels, and Aerial Dominance.
  - Live equation generator and preset switcher (Tiki-Taka Master, Direct Counter-Attack, High-Press Gegenpress, Low-Block Fortress).
  - 10,000-iteration Poisson distribution match outcome simulator with tactical clash insights.
- 📊 **Side-by-Side D3.js Radar Chart**:
  - Compare any two star players (e.g., Henry Martín vs André-Pierre Gignac) across 6 radar dimensions.
- 🏟️ **Team Chemistry Depth Chart**:
  - Tactical pitch visualization with All-Star franchise chemistry multipliers (Club América, Tigres UANL, Monterrey, Cruz Azul, Chivas, Toluca, Pachuca, Pumas UNAM).
- 🏆 **Official League Standings**:
  - Live table calculating Points, GP, W/D/L, GF, GA, GD, xGD, and Liguilla / Play-In qualification seeds.
- 🎵 **Spotify Matchday Audio Hub**:
  - Embedded matchday playlists and custom Spotify player connectivity.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Local Run
```bash
# Clone the repository
git clone https://github.com/dsrichard97/La-Liga-MathModel.git
cd La-Liga-MathModel

# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Build
```bash
npm run build
```

---

## 📦 Deployment to GitHub Pages

This repository includes a GitHub Actions workflow in `.github/workflows/deploy.yml`. When pushed to `main`, GitHub Pages automatically builds and deploys to:
**[https://dsrichard97.github.io/La-Liga-MathModel/](https://dsrichard97.github.io/La-Liga-MathModel/)**

Ensure GitHub Pages is enabled in your repository settings:
1. Go to **Settings** > **Pages**
2. Under **Build and deployment** > **Source**, choose **GitHub Actions**
