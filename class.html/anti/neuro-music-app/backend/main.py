from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from ytmusicapi import YTMusic
import uvicorn
import os

app = FastAPI()
ytmusic = YTMusic()

# Path to frontend directory
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend")

@app.get("/api/search")
def search_music(q: str):
    q = q.strip()
    if not q:
        raise HTTPException(status_code=400, detail="Search query is required")

    print(f"Searching YouTube Music for: {q}")
    try:
        # Search for songs
        results = ytmusic.search(q, filter="songs", limit=15)
    except Exception as exc:
        print(f"YouTube Music search failed: {exc}")
        raise HTTPException(status_code=502, detail="YouTube Music search is unavailable") from exc
    
    formatted_results = []
    for idx, item in enumerate(results):
        try:
            # Create a consistent color gradient based on the videoId string hash
            vid = item.get('videoId')
            if not vid:
                continue
            
            hash_val = sum(ord(c) for c in vid)
            hue1 = hash_val % 360
            hue2 = (hue1 + 45) % 360
            grad = f"linear-gradient(135deg, hsl({hue1}, 80%, 25%), hsl({hue2}, 80%, 40%))"
            
            artist_name = item['artists'][0]['name'] if item.get('artists') else 'Unknown Artist'
            album_name = item['album']['name'] if item.get('album') else 'Single'
            
            formatted_results.append({
                "id": hash_val + idx,
                "ytId": vid,
                "title": item.get('title'),
                "artist": artist_name,
                "album": album_name,
                "dur": item.get('duration_seconds', 0),
                "emoji": "🎵",
                "grad": grad,
                "genre": "YouTube Music"
            })
        except Exception as e:
            print(f"Error parsing search result item: {e}")
            pass
            
    return {"results": formatted_results}

# Serve specific pages explicitly
@app.get("/login")
def serve_login():
    return FileResponse(os.path.join(FRONTEND_DIR, "login.html"))

@app.get("/")
def serve_index():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

# Mount the static files (css, js, etc. if any)
app.mount("/", StaticFiles(directory=FRONTEND_DIR), name="frontend")

if __name__ == "__main__":
    print("Starting Neuro Music Backend on http://localhost:8000")
    uvicorn.run(app, host="0.0.0.0", port=8000)
