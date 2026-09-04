from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uuid
import os
import asyncio
import sqlite3

app = FastAPI(title="Echo Music Generator API")

# Add CORS so the frontend can easily call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for serving audio
os.makedirs("static", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Initialize Database
DB_FILE = "tasks.db"
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS tasks (
            task_id TEXT PRIMARY KEY,
            status TEXT,
            audio_url TEXT
        )
    ''')
    conn.commit()
    conn.close()

init_db()

class GenerationRequest(BaseModel):
    prompt: str
    duration_seconds: int = 10
    guidance_scale: float = 3.0

class GenerationStatus(BaseModel):
    task_id: str
    status: str
    audio_url: str | None = None

async def process_generation(task_id: str, req: GenerationRequest):
    """
    Mock function representing the ML model generation.
    In a real app, this would load EnCodec/T5/Transformer.
    """
    # Update status to processing
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("UPDATE tasks SET status = 'processing' WHERE task_id = ?", (task_id,))
    conn.commit()
    conn.close()
    
    # Simulate processing time based on duration
    await asyncio.sleep(min(req.duration_seconds, 15))
    
    # Create a dummy valid wav file for the frontend to play
    wav_hex = (
        "524946462400000057415645666d74201000000001000100"
        "44ac000088580100020010006461746100000000"
    )
    wav_bytes = bytes.fromhex(wav_hex)
    
    file_path = f"static/{task_id}.wav"
    with open(file_path, "wb") as f:
        f.write(wav_bytes)
        
    # Update status to completed and set audio url
    audio_url = f"http://localhost:8000/static/{task_id}.wav"
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("UPDATE tasks SET status = 'completed', audio_url = ? WHERE task_id = ?", (audio_url, task_id))
    conn.commit()
    conn.close()

@app.post("/api/generate", response_model=GenerationStatus)
async def generate_music(req: GenerationRequest, background_tasks: BackgroundTasks):
    if not req.prompt:
        raise HTTPException(status_code=400, detail="Prompt is required")
        
    task_id = str(uuid.uuid4())
    
    # Insert task into db
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("INSERT INTO tasks (task_id, status) VALUES (?, ?)", (task_id, "queued"))
    conn.commit()
    conn.close()
    
    # Trigger model inference in the background
    background_tasks.add_task(process_generation, task_id, req)
    
    return GenerationStatus(
        task_id=task_id, 
        status="queued"
    )

@app.get("/api/status/{task_id}", response_model=GenerationStatus)
async def get_status(task_id: str):
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT status, audio_url FROM tasks WHERE task_id = ?", (task_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        raise HTTPException(status_code=404, detail="Task not found")
        
    return GenerationStatus(
        task_id=task_id,
        status=row[0],
        audio_url=row[1]
    )

@app.get("/api/history")
async def get_history():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    cursor.execute("SELECT task_id, status, audio_url FROM tasks ORDER BY rowid DESC LIMIT 10")
    rows = cursor.fetchall()
    conn.close()
    
    return [
        GenerationStatus(task_id=row[0], status=row[1], audio_url=row[2])
        for row in rows
    ]
