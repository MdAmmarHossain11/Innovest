import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from pages.analysis_page import AnalysisPage
from pages.login_page import LoginPage
from utils.base_test import BaseTest
import time

TEST_EMAIL = "d@gmail.com"
TEST_PASSWORD = "11111"

@pytest.mark.usefixtures("driver_init")
class TestAnalysis(BaseTest):
    def test_analysis_form(self, request):
        # Login first
        login_page = LoginPage(self.driver)
        login_page.go_to()
        
        # Wait for login page to load
        time.sleep(2)
        
        # Fill login form with valid credentials
        login_page.fill_form(TEST_EMAIL, TEST_PASSWORD)
        login_page.submit()
        
        # Wait for login to complete and redirect to dashboard
        time.sleep(5)
        
        # Wait for redirect to dashboard
        try:
            WebDriverWait(self.driver, 10).until(
                lambda driver: driver.current_url != "http://localhost:3000/login"
            )
            print("Successfully redirected from login page")
        except:
            print("Warning: Still on login page, continuing anyway...")
        
        # Verify we're on the dashboard
        current_url = self.driver.current_url
        print(f"Current URL after login: {current_url}")
        
        # Take screenshot after login
        self.driver.save_screenshot("edge_automation_tests/screenshots/after_login.png")
        
        # Now go to analysis page
        page = AnalysisPage(self.driver)
        page.go_to()
        
        # Debug: Print current URL and take a screenshot before waiting for heading
        print("Current URL after tab click:", self.driver.current_url)
        self.driver.save_screenshot("edge_automation_tests/screenshots/before_analysis_heading.png")
        
        # Wait for the Analysis component to load and check for the heading
        try:
            # Wait for the 'Enter Startup Details' heading
            heading = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//h6[contains(text(), 'Enter Startup Details')]"))
            )
            print(f"Found heading: {heading.text}")
            assert heading is not None
        except Exception as e:
            print(f"Error finding heading: {e}")
            # Take another screenshot for debugging
            self.driver.save_screenshot("edge_automation_tests/screenshots/heading_not_found.png")
            # Try alternative selectors
            try:
                heading = WebDriverWait(self.driver, 5).until(
                    EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Enter Startup Details')]"))
                )
                print(f"Found heading with alternative selector: {heading.text}")
                assert heading is not None
            except:
                # If still not found, check if we're on the right page
                page_source = self.driver.page_source
                if "Startup Profitability Predictor" in page_source:
                    print("Found 'Startup Profitability Predictor' text, Analysis component is loaded")
                    # Look for any form elements
                    form_elements = self.driver.find_elements(By.TAG_NAME, "form")
                    if form_elements:
                        print(f"Found {len(form_elements)} form elements")
                        assert len(form_elements) > 0
                    else:
                        raise Exception("Analysis component loaded but no form found")
                else:
                    raise Exception("Analysis component not loaded properly")
        
        # Fill the analysis form with test data
        test_data = {
            "industry": "AI",
            "funding_rounds": 3,
            "funding_amount_m_usd": 5.5,
            "valuation_m_usd": 20.0,
            "revenue_m_usd": 2.5,
            "employees": 15,
            "market_share_percent": 1.2,
            "year_founded": 2019,
            "region": "North America",
            "exit_status": "Private"
        }
        
        try:
            page.fill_analysis_form(test_data)
            page.submit()
            
            # Wait for result and assert
            result = page.get_result()
            assert result and len(result) > 0
            print(f"Analysis result: {result}")
            
        except Exception as e:
            print(f"Error during form filling/submission: {e}")
            self.driver.save_screenshot("edge_automation_tests/screenshots/form_error.png")
            raise 