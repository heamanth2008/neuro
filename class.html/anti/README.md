# Music Apps Collection

This repository contains two distinct music application projects: **Echo Music App** and **Neuro Music App**.

## 1. Echo Music App

Echo Music App is a full-stack music streaming platform that allows you to search and play songs directly from YouTube Music, all within a beautifully designed interface.

### Features
*   **YouTube Music Integration:** Search for any song, artist, or album available on YouTube Music.
*   **Modern UI/UX:** A responsive and visually appealing frontend inspired by top streaming platforms.
*   **FastAPI Backend:** A lightweight and fast backend to handle API requests and serve the frontend.
*   **Unified Server:** The backend serves both the REST API and the static frontend files on the same port.

### How to Run
1.  Navigate to the `echo-music-app/backend` directory.
2.  Install requirements (if not already done): `pip install -r requirements.txt` (or install `fastapi`, `uvicorn`, `ytmusicapi`).
3.  Start the server:
    ```bash
    uvicorn main:app --host 0.0.0.0 --port 8001
    ```
4.  Open your browser and navigate to `http://localhost:8001`.

---

## 2. Neuro Music App

Neuro Music App is an AI-powered music generation platform that creates custom audio tracks based on text prompts using machine learning.

### Features
*   **AI Music Generation:** Enter a prompt and generate unique music tracks on the fly.
*   **Background Processing:** Handles generation tasks asynchronously in the background.
*   **Task Management:** Uses SQLite to keep track of generation tasks, their statuses, and output URLs.
*   **Interactive UI:** A frontend interface to submit prompts and listen to the generated results.

### How to Run
1.  Navigate to the `neuro-music-app/backend` directory.
2.  Install requirements: `pip install -r requirements.txt`
3.  Start the backend API server:
    ```bash
    uvicorn main:app --port 8000
    ```
4.  Start the frontend static server (in the `neuro-music-app/frontend` directory):
    ```bash
    python -m http.server 8080
    ```
5.  Open your browser and navigate to `http://localhost:8080`.

---
*Created with the help of Antigravity AI.*
