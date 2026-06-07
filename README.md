# ResQ: Offline Disaster Response Assistant

ResQ is an offline-first emergency support platform designed to function during disasters when external internet access is down. It provides a local dashboard for victims, volunteers, and responders, offering survival instructions, interactive checklists, first aid guides, shelter lookup directories, and a locally-hosted AI assistant.

## Tech Stack
- **Frontend**: React, Tailwind CSS v3, Vite, Lucide Icons
- **Backend**: FastAPI, Uvicorn, SQLAlchemy (SQLite)
- **AI Engine**: Local Ollama Server executing the `gemma` model

---

## Installation & Setup

### 1. Prerequisites
- **Node.js** (v18 or newer)
- **Python** (v3.10 or newer)
- **Ollama** installed on your system

### 2. local AI Setup (Ollama)
1. Download and install [Ollama](https://ollama.com).
2. Open your terminal and start the server:
   ```bash
   ollama serve
   ```
3. Pull the Gemma model:
   ```bash
   ollama pull gemma
   ```

### 3. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```
3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI backend:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   *Note: On startup, the system will automatically create `resq.db` (SQLite) and seed it with mock shelters, contacts, first aid guides, and survival instructions.*

### 4. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the node packages:
   ```bash
   npm install
   ```
3. Launch the Vite dev server:
   ```bash
   npm run dev
   ```
4. Open your web browser to `http://localhost:5173`.

---

## Running Verification Tests
To run the automated backend test suite, navigate to the `backend/` directory with your virtual environment active and run:
```bash
python -m pytest test_main.py
```
This checks all core endpoints: `/api/status`, `/api/shelters`, `/api/contacts`, `/api/firstaid`, `/api/checklists`, and the `/api/chat` fallback mechanism.
