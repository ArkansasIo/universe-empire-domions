import requests
import sys
import json
from datetime import datetime

class StellarDominionAPITester:
    def __init__(self, base_url="https://26f3f83a-f4af-4064-a1b4-5797c1417aeb.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=10):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if not endpoint.startswith('http') else endpoint
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                self.failed_tests.append({
                    "name": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "response": response.text[:500]
                })
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response

        except requests.exceptions.Timeout:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": "Timeout"
            })
            print(f"❌ Failed - Request timeout")
            return False, None
        except requests.exceptions.ConnectionError as e:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": f"Connection error: {str(e)}"
            })
            print(f"❌ Failed - Connection error: {str(e)}")
            return False, None
        except Exception as e:
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": str(e)
            })
            print(f"❌ Failed - Error: {str(e)}")
            return False, None

    def test_health_check(self):
        """Test health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200)

    def test_api_health_check(self):
        """Test API health endpoint"""
        return self.run_test("API Health Check", "GET", "api/health", 200)

    def test_auth_endpoints(self):
        """Test authentication related endpoints"""
        print("\n📋 Testing Authentication Endpoints...")
        
        # Test login endpoint
        login_data = {"username": "player1", "password": "demo"}
        self.run_test("Login Endpoint", "POST", "api/auth/login", 200, login_data)
        
        # Test registration endpoint  
        register_data = {"username": "testuser", "password": "testpass", "email": "test@example.com"}
        self.run_test("Register Endpoint", "POST", "api/auth/register", 200, register_data)

    def test_game_endpoints(self):
        """Test game-related endpoints"""
        print("\n🎮 Testing Game Endpoints...")
        
        # Test game state endpoint
        self.run_test("Game State", "GET", "api/game/state", 200)
        
        # Test player info endpoint
        self.run_test("Player Info", "GET", "api/player/info", 200)

def main():
    print("🚀 Starting Stellar Dominion API Tests...")
    print("=" * 60)
    
    # Setup
    tester = StellarDominionAPITester()
    
    # Test basic connectivity
    print("\n🔧 Basic Connectivity Tests")
    tester.test_health_check()
    tester.test_api_health_check()
    
    # Test authentication
    tester.test_auth_endpoints()
    
    # Test game endpoints
    tester.test_game_endpoints()

    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.failed_tests:
        print("\n❌ Failed Tests:")
        for test in tester.failed_tests:
            error_msg = test.get('error', f"Expected {test.get('expected')}, got {test.get('actual')}")
            print(f"  - {test['name']}: {error_msg}")
    
    success_rate = (tester.tests_passed / tester.tests_run) * 100 if tester.tests_run > 0 else 0
    print(f"\n📈 Success Rate: {success_rate:.1f}%")
    
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())