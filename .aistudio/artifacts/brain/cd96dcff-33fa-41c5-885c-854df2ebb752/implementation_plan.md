# Liga MX Analytics, FIFA Chemistry Hub & Mathematical Soccer Lab

Upgrade the advanced statistics platform to showcase Mexico's premier division (**Liga MX - Apertura & Clausura**), integrate an interactive **Spotify player** with curated matchday playlists and connect options, and introduce a signature **Math-Soccer Atomic Emblem** blending soccer ball geometry with atomic orbital rings and mathematical symbols.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following directions were confirmed during interactive clarification and govern the upgrade:
> - **League Scope**: Full current Liga MX Apertura & Clausura season featuring top tier clubs: Club América, Cruz Azul, Tigres UANL, CF Monterrey (Rayados), Deportivo Toluca, Chivas Guadalajara, Pumas UNAM, and CF Pachuca.
> - **Music Integration**: Interactive Spotify player featuring curated soccer playlists (Liga MX Stadium Anthems, FIFA Classics, Latin Urban Hype) alongside an optional Spotify Connect/Login workflow and embedded Spotify player mode.
> - **Mathematical Soccer Symbol**: Bespoke SVG emblem blending truncated icosahedron soccer ball seams with intersecting atomic electron orbitals, coordinate numbers, and mathematical nodes ($\Sigma, \pi, \int, \Delta$), featured as the animated brand header logo and subtle background watermark.

---

### 1. Overview & Core Concept

- **What It Does**: A comprehensive sports analytics and tactical workbench for Mexico's **Liga MX**, combining advanced predictive modeling (xG, xA, Possession Value / xT, PPDA Pressing Intensity, Elo), a custom **"La Liga" algorithmic model builder**, side-by-side **D3.js player radar comparison**, **FIFA Ultimate Team chemistry depth charts** anchored by franchise All-Stars, a **right-to-left album cover vinyl reel**, and an **interactive Spotify player**.
- **Target Audience**: Soccer analysts, Liga MX enthusiasts, FIFA/EA FC tactical players, and sports data researchers who want both deep metrics and broadcast-quality visual presentation.
- **Key Value**: Bridges European analytical frameworks ("La Liga" positional & technical models) with Liga MX's high-intensity style of play, delivering real-time statistical recalibration, head-to-head radar analysis, and match outcome simulations.

---

### 2. User Experience & Visual Design

#### Visual Identity & Theme
- **Theme & Atmosphere**: Obsidian stadium dark canvas (`#080B11` and `#0D131F`), vibrant electric Mexican neon accents (Emerald green `#10B981`, Mexican hot pink `#FF1493`, and Aztec Gold `#F59E0B`), and polished hairline glass panels.
- **Brand Mark**: Animated Math-Soccer Atom symbol (`<MathSoccerAtom />`):
  - 3 intersecting elliptical atomic orbitals rotating smoothly via CSS keyframes.
  - Central soccer ball hexagon/pentagon geometry with inscribed coordinate numbers (`10`, `4`, `7`, `9`).
  - Orbiting electron nodes carrying mathematical operator glyphs ($\Sigma, \int, \Delta, \pi$).
  - Rendered in the top navigation bar and as an ambient, non-intrusive backdrop watermark.
- **Typography**: `Outfit` for display headlines and brand lettering, `Rajdhani` for athletic FUT card ratings and jersey numerals, and `Space Grotesk` / tabular monospace for metrics, xG differentials, and formulas.

#### Key User Flows
1. **Right-to-Left Vinyl Album Reel**:
   - Smooth continuous marquee moving from right to left across the screen showing Liga MX clubs (e.g. Club América - Henry Martín, Tigres - Gignac, Monterrey - Canales, Cruz Azul - Rotondi, Toluca - Paulinho, Chivas - Alvarado).
   - Shows album title, track name, vinyl disc sticker, and franchise All-Star chemistry rating.
2. **Interactive Spotify Player**:
   - Header action button opens an interactive Spotify player drawer.
   - User can switch between curated soccer playlists:
     - *Liga MX Estadio Vivo (Estadio Azteca & Universitario Anthems)*
     - *FIFA & EA Sports FC Iconic Soundtracks*
     - *Latin Urban & Cumbia Matchday Hype*
     - *Tiki-Taka Instrumental Focus*
   - Includes full Spotify Embed player (`open.spotify.com/embed/...`) with play/pause, track info, plus a "Connect Spotify Account" modal allowing users to enter custom playlist/track links.
3. **Compare Players Modal with D3.js Radar Chart**:
   - Side-by-side FIFA Ultimate Team cards (e.g., Henry Martín vs. André-Pierre Gignac, or Álvaro Fidalgo vs. Sergio Canales).
   - Dynamic D3.js radial chart comparing 6 core soccer dimensions with polygon fills and hover tooltips.
   - Comprehensive head-to-head metric differences table with advantage badges.
4. **Team Chemistry Pitch & Positional Depth Chart**:
   - Interactive tactical pitch showing starting 11 formations (4-3-3, 4-2-3-1, 3-5-2).
   - The franchise All-Star (e.g. Gignac for Tigres, Canales for Monterrey, Fidalgo/Martín for América) acts as the **Chemistry Anchor**, radiating up to $\times 1.50$ synergy multipliers to teammates.
5. **Custom "La Liga" Algorithmic Model Builder**:
   - Calibrate weights for Technical Passing, Expected Threat (xT), Clinical Finishing, Press Resistance, High Pressing, and Aerial Duels.
   - Live mathematical formula updating in real-time.
   - Poisson match simulation engine predicting scorelines and win probabilities between any two Liga MX teams (e.g., Clásico Nacional: América vs Chivas; or Clásico Regio: Tigres vs Rayados).

---

### 3. Key Product Decisions & Trade-Offs

- **Liga MX Dataset Migration**:
  - *Chosen Approach*: Replace MLS dataset with 8 top Liga MX clubs and 16+ authentic star players with realistic 2024/2025 Apertura/Clausura statistics (xG, xA, PrgP, PV/xT, PPDA, duel win %, goals, assists).
  - *Why*: Gives users accurate, authentic Mexican soccer metrics matching the user's explicit request.
- **Spotify Integration Pattern**:
  - *Chosen Approach*: Deliver an interactive, compliant Spotify player supporting curated authentic matchday playlists via the Spotify iFrame API / Embed widget alongside an account connect dialogue for custom playlists.
  - *Why*: Bypasses server-side OAuth redirect limits in iframe sandboxes while giving immediate, zero-latency playback with zero third-party authorization hurdles.
- **Math-Soccer Atom Emblem**:
  - *Chosen Approach*: Pure vector SVG component with layered geometric orbital paths, mathematical vertex points, and CSS keyframe rotations.
  - *Why*: Crisply scales at any resolution, supports responsive dark-mode glow, and serves as both high-impact header icon and ambient background watermark without external image dependencies.

---

### 4. Technical Architecture & Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Root Layout (App.tsx)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Navigation Bar (Navbar.tsx)                                           │  │
│  │ ├─ Math-Soccer Atom Logo (<MathSoccerAtom size="sm" animate />)       │  │
│  │ ├─ Navigation Links: Dashboard · La Liga Model · Chemistry · Stats     │  │
│  │ ├─ Spotify Player Toggle Button (with Spotify branding & icon)        │  │
│  │ └─ Compare Players Modal Launcher                                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Spotify Drawer (<SpotifyPlayer />)                                    │  │
│  │ ├─ Curated Soccer Playlist Switcher                                   │  │
│  │ ├─ Interactive Spotify Embed IFrame & Track Controller                 │  │
│  │ └─ Custom Spotify Connect / URI input dialog                          │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Hero Banner with Ambient Math-Soccer Watermark                        │  │
│  │ └─ Quick Metrics & 1-Click Clásico Matchup Compare (América vs Chivas)│  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Right-to-Left Vinyl Album Carousel (<AlbumCoverCarousel />)           │  │
│  │ └─ Liga MX Club Vinyl Covers & All-Star Profile Photos                │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Custom "La Liga" Algorithmic Model Builder (<LaLigaModelBuilder />)   │  │
│  │ ├─ 6 Metric Sliders · Live Math Formula Display · Preset Switcher     │  │
│  │ └─ Liga MX Clásico Match Simulator (Poisson Distribution)             │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Team Chemistry Depth Chart (<TeamChemistryDepthChart />)              │  │
│  │ ├─ Tactical Pitch with All-Star Anchor Halo                           │  │
│  │ └─ Positional Depth Hierarchy Table                                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Advanced Liga MX Stats Table (<StatsTable />)                         │  │
│  │ ├─ 5 Model Method Filters · Search · Position Filter                  │  │
│  │ └─ Sortable Columns & Checkbox Multi-Select for Radar Compare         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Player Compare Modal with D3.js Radar Chart (<PlayerCompareModal />)  │  │
│  │ ├─ Side-by-Side FIFA Cards (FifaPlayerCard.tsx)                       │  │
│  │ ├─ D3.js Multi-Axial Radar Polygon Visualizer                         │  │
│  │ └─ Head-to-Head Advanced Metrics Difference Table                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Step-by-Step Implementation Sequence

1. **`src/types/soccer.ts`**: Update conferences/groups to Liga MX Apertura/Clausura standards and update team interface details.
2. **`src/data/ligaMxData.ts`**: Create rich dataset of 8 Liga MX powerhouse clubs and 16+ star players (Club América, Tigres, Monterrey, Cruz Azul, Toluca, Chivas, Pumas, Pachuca) with authentic soccer metrics and album cover themes.
3. **`src/components/MathSoccerAtom.tsx`**: Create the vector SVG brand mark combining soccer pentagon geometry, electron orbit ellipses, mathematical operators ($\Sigma, \pi, \int$), and coordinate numerals.
4. **`src/components/SpotifyPlayer.tsx`**: Build interactive Spotify music player with curated soccer playlists, embedded Spotify player view, track details, and custom Spotify account connect modal.
5. **`src/components/Navbar.tsx`**: Integrate the `<MathSoccerAtom />` animated logo, Spotify green button, and Liga MX branding.
6. **`src/components/AlbumCoverCarousel.tsx` & `src/components/TeamChemistryDepthChart.tsx`**: Update for Liga MX clubs and franchise chemistry anchors.
7. **`src/components/LaLigaModelBuilder.tsx` & `src/components/StatsTable.tsx`**: Adapt simulation and stats filtering for Liga MX matchups (e.g. Clásico Nacional, Clásico Regio).
8. **`src/App.tsx`**: Orchestrate updated components with the ambient math-soccer background watermark and Spotify drawer.
9. **Verification**: Run `compile_applet` and `lint_applet` to confirm zero errors and test dev server responsiveness.
