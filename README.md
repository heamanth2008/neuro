# neuro
A dual-app music platform featuring Echo Music and Neuro Music. Echo is a sleek, full-stack streaming app that lets you search and play songs directly from YouTube Music with a modern UI. Neuro is an AI-powered platform that generates custom audio tracks from text prompts. Built with FastAPI, Python, and a responsive frontend
# 🎵 Neuro Music — Modern Glassmorphism Music Streaming Web Application

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg?style=flat&logo=python)](https://www.python.org/)
[![JavaScript](https://img.shields.io/badge/Frontend-Vanilla_JS_ES6%2B-F7DF1E.svg?style=flat&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/Styling-Glassmorphism_CSS3-1572B6.svg?style=flat&logo=css3)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![PWA Ready](https://img.shields.io/badge/PWA-Progressive_Web_App-5A0FC8.svg?style=flat&logo=pwa)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Neuro Music** is a high-performance, full-stack music streaming platform designed with a modern ultra-sleek **Glassmorphism UI**. Built from the ground up to provide a native app experience on both **Desktop (PC)** and **Mobile (iOS/Android)**, Neuro Music streams millions of tracks directly through YouTube Music integration with persistent background playback support.

---

## ✨ Key Features

### 💎 Next-Gen Glassmorphic UI/UX
- **Adaptive Dual-Layout Engine**:
  - **Desktop (PC ≥ 900px)**: Immersive 3-column dashboard featuring a persistent glass sidebar, center discovery stage, and sticky live player column.
  - **Mobile (< 900px)**: Compact single-column view with bottom navigation glass dock, floating mini-player bar, and fluid slide-up fullscreen player modal.
- **Dynamic Ambient Backdrops**: Multi-layered radial gradients and real-time frosted glass backdrop blur filters (`backdrop-filter: blur(28px)`).
- **Dark & Light Mode**: Built-in instant theme switcher with persistent local storage preferences.
- **Pure Vector UI**: 100% SVG Lucide icons with zero dependency on emojis for a clean, professional aesthetic.

### 🎧 Audio & Playback Capabilities
- **Continuous Mobile Background Audio**: Custom Web Audio keep-alive engine allowing uninterrupted playback even when switching tabs, browsing other apps, or locking your phone screen.
- **Lock-Screen & Headset Controls (MediaSession API)**: Full system-level media integration showing track title, artist, high-res artwork, next/prev, play/pause, and timeline scrubbing on lock screens and smartwatch interfaces.
- **Advanced Playback Controls**: Full queue management, shuffle, repeat one/all, seek scrubbing, volume attenuation, and mute toggle.
- **Auto-Recovery & Error Handling**: Automated detection of restricted or embedding-disabled tracks with seamless auto-skip to the next available track.

### 🔍 Search & Music Discovery
- **Real-Time YouTube Music Search**: Fast search querying millions of songs and artists via `ytmusicapi` with server-side caching (TTL 300s) to minimize latency.
- **Curated NCS & Electronic Playlists**: Instant access to curated NCS releases, Synthwave, Lofi, Gaming, and Ambient collections.
- **Custom Playlists & Favorites**: Create, edit, persist, and delete custom user playlists and favorite tracks saved directly in browser storage.
- **Synchronized Lyrics Drawer**: Dedicated lyrics slide-up view with smooth scrolling and dynamic typography.

### 📱 Progressive Web App (PWA)
- **Installable Native Feel**: Fully configured Web App Manifest (`manifest.webmanifest`) supporting "Add to Home Screen" on Android Chrome and iOS Safari.
- **Offline Shell & Smart Caching**: Service Worker (`service-worker.js`) caching core UI assets with background cache invalidation while passing live API search streams directly to the network.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | HTML5, Semantic CSS3 (Flexbox & CSS Grid), Vanilla ES6+ JavaScript |
| **Design System** | Glassmorphism, CSS Custom Properties, Lucide SVG Icons |
| **Backend** | Python 3.10+, FastAPI (ASGI Framework), Uvicorn Server |
| **Audio Engine** | YouTube IFrame API + Silent Audio Keep-Alive Session Engine |
| **Music Data API** | `ytmusicapi` (Unofficial YouTube Music API wrapper) |
| **PWA Services** | Service Worker Cache API, Web App Manifest, MediaSession API |

---

## 📂 Repository Structure

```plaintext
neuro/
├── backend/
│   ├── main.py                 # FastAPI application, search API & static file serving
│   └── requirements.txt        # Python backend dependencies
├── frontend/
│   ├── glass_home.html         # Main single-page application entry point
│   ├── style.css               # Responsive desktop & mobile Glassmorphism design system
│   ├── app.js                  # Audio playback engine, UI controller & state management
│   ├── service-worker.js       # PWA offline cache manager
│   ├── manifest.webmanifest    # Web application manifest for PWA installation
│   └── login.html              # Clean glass authentication view
├── requirements.txt            # Root build dependencies (for cloud deployment)
└── README.md                   # Project documentation
