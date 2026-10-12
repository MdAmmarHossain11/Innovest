import requests
import json

# Test data
test_data = {
    "industry": "FinTech",
    "funding_rounds": 3,
    "funding_amount_m_usd": 15.5,
    "valuation_m_usd": 50.0,
    "revenue_m_usd": 10.2,
    "employees": 120,
    "market_share_percent": 2.5,
    "year_founded": 2018,
    "region": "North America"
}

# Make the prediction request
url = "http://localhost:8000/api/ml/predict/"

# Add your JWT token here if needed
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer your_token_here"  # Replace with your actual token
}

try:
    response = requests.post(url, json=test_data, headers=headers)
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {str(e)}")
