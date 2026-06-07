from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_api_status():
    """
    Test status diagnostics route.
    """
    response = client.get("/api/status")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["status"] == "active"
    assert "database" in json_data
    assert "ollama_ai" in json_data

def test_get_shelters():
    """
    Test reading shelter database records.
    """
    response = client.get("/api/shelters")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    assert len(response.json()) > 0

def test_create_and_delete_shelter():
    """
    Test shelter registration CRUD.
    """
    payload = {
        "name": "Temporary Test Gym",
        "address": "404 Mockingbird Lane",
        "capacity": 50,
        "contact_number": "123-456-7890",
        "available_facilities": "Cots, Water"
    }
    # Create
    response = client.post("/api/shelters", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Temporary Test Gym"
    shelter_id = data["id"]

    # Search
    search_response = client.get("/api/shelters?query=Temporary")
    assert search_response.status_code == 200
    assert len(search_response.json()) > 0

    # Delete
    del_response = client.delete(f"/api/shelters/{shelter_id}")
    assert del_response.status_code == 200

def test_get_first_aid():
    """
    Test reading preloaded first aid tutorials.
    """
    response = client.get("/api/firstaid")
    assert response.status_code == 200
    assert len(response.json()) > 0
    # Verify we seeded Bleeding Management
    titles = [item["title"] for item in response.json()]
    assert any("Bleeding" in t for t in titles)

def test_get_checklists():
    """
    Test reading checklists.
    """
    response = client.get("/api/checklists")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_chat_assistant_fallback():
    """
    Test chat response. Will return a structured dictionary.
    If Ollama is not running, it gracefully returns fallback content.
    """
    payload = {
        "messages": [
            {"role": "user", "content": "How do I perform CPR?"}
        ]
      }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    assert "content" in response.json()
    assert "status" in response.json()
