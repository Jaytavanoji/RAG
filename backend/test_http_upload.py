import requests
import time

url = "http://127.0.0.1:8000/api/upload"
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5OTNkNTNlZS01MjE4LTRiZWMtYjEyOS02N2JlOGE5OWVlMjkiLCJleHAiOjE3NzQ4OTUzMDh9.qtpIFtBg8x7pYTAxRSGS54N1BaqlEYIQSutzkM70rSA"

with open("test_doc.txt", "w") as f:
    f.write("This is a test constitution document about government.")

files = {'file': ('test_doc.txt', open('test_doc.txt', 'rb'), 'text/plain')}
headers = {'Authorization': f'Bearer {token}'}

print("Starting upload...")
try:
    response = requests.post(url, files=files, headers=headers, timeout=30)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except requests.exceptions.Timeout:
    print("Request timed out!")
except Exception as e:
    print(f"Error: {e}")
