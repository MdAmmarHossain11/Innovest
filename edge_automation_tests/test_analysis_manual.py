#!/usr/bin/env python3
"""
Manual test script for Analysis functionality
This script tests the analysis form with the provided credentials
"""

import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.edge.options import Options

def test_analysis_manual():
    """Manual test for Analysis functionality"""
    
    # Setup Edge driver
    options = Options()
    options.add_argument("start-maximized")
    driver = webdriver.Edge(options=options)
    
    try:
        # Test credentials
        TEST_EMAIL = "imrangazi4052@gmail.com"
        TEST_PASSWORD = "Anas@2025"
        
        print("Starting Analysis test...")
        
        # Step 1: Login
        print("Step 1: Logging in...")
        driver.get("http://localhost:3000/login")
        time.sleep(2)
        
        # Fill login form
        email_field = driver.find_element(By.NAME, "email")
        password_field = driver.find_element(By.NAME, "password")
        
        email_field.send_keys(TEST_EMAIL)
        password_field.send_keys(TEST_PASSWORD)
        
        # Submit login
        submit_button = driver.find_element(By.XPATH, "//button[@type='submit']")
        submit_button.click()
        
        # Wait for login to complete
        time.sleep(3)
        print(f"Current URL after login: {driver.current_url}")
        
        # Step 2: Navigate to Analysis tab
        print("Step 2: Navigating to Analysis tab...")
        
        # Wait for tabs to be present
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'button.MuiTab-root'))
        )
        
        # Find and click Analysis tab (index 5)
        tab_buttons = driver.find_elements(By.CSS_SELECTOR, 'button.MuiTab-root')
        print(f"Found {len(tab_buttons)} tab buttons")
        
        if len(tab_buttons) > 5:
            analysis_tab = tab_buttons[5]
            print(f"Analysis tab text: {analysis_tab.text}")
            analysis_tab.click()
            time.sleep(2)
        else:
            raise Exception(f"Not enough tabs found. Expected at least 6, found {len(tab_buttons)}")
        
        # Step 3: Verify Analysis component loaded
        print("Step 3: Verifying Analysis component...")
        
        # Check for main heading
        try:
            heading = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//h4[contains(text(), 'Startup Profitability Predictor')]"))
            )
            print(f"✓ Found main heading: {heading.text}")
        except:
            print("✗ Could not find main heading")
        
        # Check for form heading
        try:
            form_heading = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//h6[contains(text(), 'Enter Startup Details')]"))
            )
            print(f"✓ Found form heading: {form_heading.text}")
        except:
            print("✗ Could not find form heading")
        
        # Step 4: Fill the form
        print("Step 4: Filling analysis form...")
        
        # Fill form fields
        try:
            # Industry
            industry_select = driver.find_element(By.ID, "mui-component-select-industry")
            industry_select.click()
            time.sleep(1)
            ai_option = driver.find_element(By.XPATH, "//li[normalize-space(text())='AI']")
            ai_option.click()
            time.sleep(1)
            print("✓ Selected Industry: AI")
            
            # Funding Rounds
            funding_rounds_field = driver.find_element(By.NAME, "funding_rounds")
            funding_rounds_field.clear()
            funding_rounds_field.send_keys("3")
            print("✓ Filled Funding Rounds: 3")
            
            # Funding Amount
            funding_amount_field = driver.find_element(By.NAME, "funding_amount_m_usd")
            funding_amount_field.clear()
            funding_amount_field.send_keys("5.5")
            print("✓ Filled Funding Amount: 5.5")
            
            # Valuation
            valuation_field = driver.find_element(By.NAME, "valuation_m_usd")
            valuation_field.clear()
            valuation_field.send_keys("20.0")
            print("✓ Filled Valuation: 20.0")
            
            # Revenue
            revenue_field = driver.find_element(By.NAME, "revenue_m_usd")
            revenue_field.clear()
            revenue_field.send_keys("2.5")
            print("✓ Filled Revenue: 2.5")
            
            # Employees
            employees_field = driver.find_element(By.NAME, "employees")
            employees_field.clear()
            employees_field.send_keys("15")
            print("✓ Filled Employees: 15")
            
            # Market Share
            market_share_field = driver.find_element(By.NAME, "market_share_percent")
            market_share_field.clear()
            market_share_field.send_keys("1.2")
            print("✓ Filled Market Share: 1.2")
            
            # Year Founded
            year_founded_field = driver.find_element(By.NAME, "year_founded")
            year_founded_field.clear()
            year_founded_field.send_keys("2019")
            print("✓ Filled Year Founded: 2019")
            
            # Region
            region_select = driver.find_element(By.ID, "mui-component-select-region")
            region_select.click()
            time.sleep(1)
            na_option = driver.find_element(By.XPATH, "//li[normalize-space(text())='North America']")
            na_option.click()
            time.sleep(1)
            print("✓ Selected Region: North America")
            
            # Exit Status
            exit_select = driver.find_element(By.ID, "mui-component-select-exit_status")
            exit_select.click()
            time.sleep(1)
            private_option = driver.find_element(By.XPATH, "//li[normalize-space(text())='Private']")
            private_option.click()
            time.sleep(1)
            print("✓ Selected Exit Status: Private")
            
        except Exception as e:
            print(f"✗ Error filling form: {e}")
            raise
        
        # Step 5: Submit the form
        print("Step 5: Submitting form...")
        
        try:
            submit_button = driver.find_element(By.XPATH, "//button[contains(., 'Predict Profitability')]")
            submit_button.click()
            time.sleep(3)
            print("✓ Form submitted successfully")
        except Exception as e:
            print(f"✗ Error submitting form: {e}")
            raise
        
        # Step 6: Check for results
        print("Step 6: Checking for results...")
        
        try:
            result_element = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Likely Profitable') or contains(text(), 'Likely Not Profitable')]"))
            )
            result_text = result_element.text
            print(f"✓ Analysis result: {result_text}")
        except Exception as e:
            print(f"✗ Error getting result: {e}")
            # Try alternative selector
            try:
                result_element = driver.find_element(By.XPATH, "//div[contains(@class, 'MuiPaper-root')]//h5")
                result_text = result_element.text
                print(f"✓ Analysis result (alternative): {result_text}")
            except:
                print("✗ Could not find any result")
                raise
        
        print("\n🎉 Analysis test completed successfully!")
        
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        # Take screenshot on failure
        driver.save_screenshot("edge_automation_tests/screenshots/manual_test_failed.png")
        raise
    
    finally:
        # Keep browser open for a few seconds to see the results
        print("Keeping browser open for 5 seconds...")
        time.sleep(5)
        driver.quit()

if __name__ == "__main__":
    test_analysis_manual()
