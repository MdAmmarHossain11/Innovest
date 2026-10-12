import requests
import json

def test_model_status():
    url = 'http://localhost:8000/api/ml/model-status/'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        print("Model Status:")
        print(json.dumps(data, indent=2))
        
        if data.get('is_trained'):
            print("\n✅ Model is trained and ready for predictions")
            print(f"Last trained: {data.get('last_trained', 'N/A')}")
            print(f"Test accuracy: {float(data.get('test_accuracy', 0)):.2%}")
        else:
            print("\n❌ Model is not trained yet")
            if 'error' in data:
                print(f"Error: {data['error']}")
            
    except requests.exceptions.RequestException as e:
        print(f"Error connecting to the API: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    test_model_status()
