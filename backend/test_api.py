import requests

url = "http://localhost:8000/api/groups/7/invite"
try:
    response = requests.post(url, allow_redirects=False)
    print(f"Status: {response.status_code}")
    print(f"Body: {response.text}")
except Exception as e:
    print(f"Error: {e}")
