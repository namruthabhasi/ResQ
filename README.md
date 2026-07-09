# ResQ

### Offline LLM-Powered Emergency Response Assistant for Disaster Preparedness

## Overview

ResQ is an offline disaster response assistant designed to provide critical emergency guidance when internet connectivity is unavailable.

During disasters such as floods, earthquakes, cyclones, landslides, and fires, communication networks often become unreliable. ResQ addresses this challenge by leveraging a locally running Large Language Model (LLM) through Ollama to deliver emergency information, first-aid guidance, shelter details, and disaster preparedness resources directly on the user's device.

The system is designed to remain operational even in low-connectivity or completely offline environments.

---

## Problem Statement

Natural disasters frequently disrupt communication infrastructure, making it difficult for affected individuals to access reliable emergency information.

People often need immediate answers to questions such as:

* What should I do during a flood?
* How do I perform CPR?
* Where is the nearest shelter?
* What supplies should I prepare before a cyclone?

Most existing solutions depend on internet access, limiting their effectiveness during emergencies.

---

## Solution

ResQ provides:

* Offline AI-powered emergency assistance
* Disaster-specific response guidance
* First-aid and CPR instructions
* Shelter information management
* Emergency preparedness checklists
* Local knowledge base access

All AI processing is performed locally using Gemma through Ollama.

---

## Key Features

### Emergency Guidance

Provides step-by-step instructions for:

* Floods
* Earthquakes
* Cyclones
* Fires
* Landslides
* General emergencies

### First Aid & CPR Support

Emergency assistance for:

* Severe bleeding
* Burns
* Fractures
* Choking
* CPR procedures
* Drowning response

### Shelter Network

* Shelter directory
* Capacity information
* Availability tracking
* Local shelter management

### Emergency Protocols

Structured emergency response workflows:

1. Detect
2. Assess
3. Respond
4. Protect
5. Evacuate
6. Recover

### Offline AI Assistant

Powered by:

* Gemma
* Ollama
* Local knowledge base

No internet connection required.

---

## System Architecture

```text
User
 │
 ▼
Frontend Interface
 │
 ▼
Backend API
 │
 ├── Local Knowledge Base
 │      ├── First Aid Guides
 │      ├── Disaster Manuals
 │      ├── Shelter Database
 │      └── Emergency Protocols
 │
 ▼
Gemma (Ollama)
 │
 ▼
Response Generation
```

---

## Technology Stack

### Frontend

* React
* Vite
* CSS

### Backend

* FastAPI
* Python

### AI Layer

* Gemma
* Ollama

### Database

* SQLite

---

## Project Structure

```text
ResQ/
│
├── frontend/
│
├── backend/
│
├── knowledge_base/
│
├── shelters/
│
├── emergency_guides/
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/namruthabhasi/ResQ.git
cd ResQ
```

### Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Start Ollama

```bash
ollama run gemma
```

### Start Backend

```bash
uvicorn app.main:app --reload
```

### Start Frontend

```bash
npm run dev
```

---

## Future Enhancements

* Multilingual support
* Voice-based emergency assistance
* GPS-based shelter recommendations
* Offline maps
* Real-time disaster alerts
* Fine-tuned disaster-response model
* Mobile application deployment

---

## Impact

ResQ aims to make life-saving information accessible during emergencies, especially in regions where internet connectivity may be disrupted.

By combining local AI with disaster preparedness resources, the system helps communities respond more effectively during critical situations.

---

## Author

**Namrutha Bhasi**

B.Tech CSE(Artificial Intelligence and Machine Learning)

Sree Buddha College of Engineering

---

## License

This project is intended for educational and research purposes.
