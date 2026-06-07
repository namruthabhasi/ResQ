import httpx
import json
from typing import List, Dict, Optional

OLLAMA_HOST = "http://localhost:11434"
DEFAULT_MODEL = "gemma"  # Gemma model pulled locally via Ollama

SYSTEM_PROMPT = """You are ResQ, an AI emergency response assistant. Your job is to help users during critical situations (floods, fires, earthquakes, cyclones, medical emergencies).
Respond according to these rules:
1. Provide IMMEDIATE, CONCISE, action-oriented, and safety-focused guidance.
2. Use clear, bulleted steps to reduce cognitive load under stress.
3. Use simple vocabulary.
4. Highlight critical WARNINGS prominently.
5. End with a recommendation on when to seek professional medical or emergency response team help.
6. Keep answers short (under 250 words) to save device battery and speed up readability.
7. If the question is NOT related to emergencies, disasters, safety, or preparedness, politely remind the user that this app is dedicated to emergency rescue support and keep the channel clear.
"""

async def query_ollama(messages: List[Dict[str, str]], disaster_context: Optional[str] = None) -> Dict:
    """
    Sends chat messages to local Ollama instance.
    Falls back to a detailed static rule-based system if Ollama is unreachable.
    """
    # Prepare payload with System Prompt first
    formatted_messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Append the user conversation
    for msg in messages:
        # Avoid duplicate system prompts
        if msg["role"] != "system":
            formatted_messages.append({"role": msg["role"], "content": msg["content"]})

    # Add optional context at the end of user request if provided
    if disaster_context and formatted_messages and formatted_messages[-1]["role"] == "user":
        formatted_messages[-1]["content"] += f"\n(Context: User is currently dealing with a {disaster_context} emergency. Tailor advice specifically to this situation.)"

    payload = {
        "model": DEFAULT_MODEL,
        "messages": formatted_messages,
        "stream": False,
        "options": {
            "temperature": 0.2, # low temperature for deterministic safety
            "num_predict": 300   # limit response length
        }
    }

    try:
        async with httpx.AsyncClient(timeout=12.0) as client:
            response = await client.post(
                f"{OLLAMA_HOST}/api/chat",
                json=payload
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    "status": "success",
                    "content": result["message"]["content"],
                    "model": result.get("model", DEFAULT_MODEL)
                }
            else:
                return {
                    "status": "error",
                    "content": f"Ollama returned error code {response.status_code}. Using local disaster procedures.",
                    "offline_fallback": True
                }
    except (httpx.ConnectError, httpx.TimeoutException) as e:
        # Return fallback state to let frontend know AI is offline but app functions
        return {
            "status": "offline",
            "content": (
                "⚠️ **Local AI Engine Offline**\n\n"
                "I cannot connect to the local Gemma AI model via Ollama (unreachable on http://localhost:11434).\n\n"
                "**Immediate Advice:**\n"
                "1. Please head directly to the **Survival Toolkit** tab.\n"
                "2. Browse pre-loaded **First Aid Guides** (CPR, Bleeding, Burns, Drowning) or **Survival Guides**.\n"
                "3. Use the **Emergency Contacts** tab to find active helper services.\n"
                "4. Check local **Shelter Information** to locate nearby safe zones.\n\n"
                "*Tip for responders: Make sure Ollama is running (`ollama serve`) and the gemma model is pulled (`ollama pull gemma`).*"
            ),
            "offline_fallback": True
        }
