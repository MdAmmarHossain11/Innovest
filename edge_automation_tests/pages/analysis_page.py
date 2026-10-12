from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from utils.base_page import BasePage
import time

class AnalysisPage(BasePage):
    URL = "http://localhost:3000/dashboard"  # Dashboard page with tabs

    def go_to(self):
        self.driver.get(self.URL)
        
        # Wait for the page to load
        time.sleep(2)
        
        # Wait for tabs to be present
        WebDriverWait(self.driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'button.MuiTab-root'))
        )
        
        # Click the Analysis tab (index 4)
        tab_buttons = self.driver.find_elements(By.CSS_SELECTOR, 'button.MuiTab-root')
        print(f"Found {len(tab_buttons)} tab buttons")
        
        if len(tab_buttons) > 4:
            analysis_tab = tab_buttons[4]
            print(f"Analysis tab text: {analysis_tab.text}")
            
            # Check if tab is already selected
            if 'Mui-selected' not in analysis_tab.get_attribute('class'):
                print("Clicking Analysis tab...")
                analysis_tab.click()
                time.sleep(2)  # Wait for tab content to load
            else:
                print("Analysis tab is already selected")
        else:
            raise Exception(f"Not enough tabs found. Expected at least 5, found {len(tab_buttons)}")
        
        # Take a debug screenshot after tab click
        self.driver.save_screenshot("edge_automation_tests/screenshots/analysis_tab_clicked.png")
        
        # Wait for the Analysis component to load
        try:
            # First try to find the main heading
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//h4[contains(text(), 'Startup Profitability Predictor')]"))
            )
            print("Found 'Startup Profitability Predictor' heading")
        except:
            print("Could not find main heading, continuing...")
        
        # Wait for a unique heading or element from the Analysis tab
        try:
            self.wait_for_element(By.XPATH, "//h6[contains(text(), 'Enter Startup Details')]")
        except:
            # If the specific heading is not found, try to find any form elements
            try:
                WebDriverWait(self.driver, 5).until(
                    EC.presence_of_element_located((By.TAG_NAME, "form"))
                )
                print("Found form element")
            except:
                raise Exception("Could not find Analysis form elements")

    def fill_analysis_form(self, data):
        # Select industry (Material UI Select)
        try:
            industry_select = self.wait_for_element(By.ID, "mui-component-select-industry")
            industry_select.click()
            time.sleep(1)
            option = self.wait_for_element(By.XPATH, f"//li[normalize-space(text())='{data['industry']}']")
            option.click()
            time.sleep(1)
        except Exception as e:
            print(f"Error selecting industry: {e}")
            raise
        
        # Funding Rounds
        try:
            funding_rounds_field = self.wait_for_element(By.NAME, "funding_rounds")
            funding_rounds_field.clear()
            funding_rounds_field.send_keys(str(data['funding_rounds']))
        except Exception as e:
            print(f"Error filling funding rounds: {e}")
            raise
        
        # Funding Amount ($M)
        try:
            funding_amount_field = self.wait_for_element(By.NAME, "funding_amount_m_usd")
            funding_amount_field.clear()
            funding_amount_field.send_keys(str(data['funding_amount_m_usd']))
        except Exception as e:
            print(f"Error filling funding amount: {e}")
            raise
        
        # Valuation ($M)
        try:
            valuation_field = self.wait_for_element(By.NAME, "valuation_m_usd")
            valuation_field.clear()
            valuation_field.send_keys(str(data['valuation_m_usd']))
        except Exception as e:
            print(f"Error filling valuation: {e}")
            raise
        
        # Revenue ($M)
        try:
            revenue_field = self.wait_for_element(By.NAME, "revenue_m_usd")
            revenue_field.clear()
            revenue_field.send_keys(str(data['revenue_m_usd']))
        except Exception as e:
            print(f"Error filling revenue: {e}")
            raise
        
        # Number of Employees
        try:
            employees_field = self.wait_for_element(By.NAME, "employees")
            employees_field.clear()
            employees_field.send_keys(str(data['employees']))
        except Exception as e:
            print(f"Error filling employees: {e}")
            raise
        
        # Market Share (%)
        try:
            market_share_field = self.wait_for_element(By.NAME, "market_share_percent")
            market_share_field.clear()
            market_share_field.send_keys(str(data['market_share_percent']))
        except Exception as e:
            print(f"Error filling market share: {e}")
            raise
        
        # Year Founded
        try:
            year_founded_field = self.wait_for_element(By.NAME, "year_founded")
            year_founded_field.clear()
            year_founded_field.send_keys(str(data['year_founded']))
        except Exception as e:
            print(f"Error filling year founded: {e}")
            raise
        
        # Region (Material UI Select)
        try:
            region_select = self.wait_for_element(By.ID, "mui-component-select-region")
            region_select.click()
            time.sleep(1)
            region_option = self.wait_for_element(By.XPATH, f"//li[normalize-space(text())='{data['region']}']")
            region_option.click()
            time.sleep(1)
        except Exception as e:
            print(f"Error selecting region: {e}")
            raise
        
        # Exit Status (optional, Material UI Select)
        if data.get('exit_status'):
            try:
                exit_select = self.wait_for_element(By.ID, "mui-component-select-exit_status")
                exit_select.click()
                time.sleep(1)
                exit_option = self.wait_for_element(By.XPATH, f"//li[normalize-space(text())='{data['exit_status']}']")
                exit_option.click()
                time.sleep(1)
            except Exception as e:
                print(f"Error selecting exit status: {e}")
                # Exit status is optional, so don't raise

        # Print summary of filled values
        print("\nAnalysis form filled with the following data:")
        for k, v in data.items():
            print(f"  {k}: {v}")
        print("")

    def submit(self):
        try:
            submit_button = self.wait_for_clickable(By.XPATH, "//button[contains(., 'Predict Profitability')]")
            submit_button.click()
            time.sleep(2)  # Wait for submission
        except Exception as e:
            print(f"Error submitting form: {e}")
            raise

    def get_result(self):
        try:
            # Wait for the result box to appear
            result_element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'MuiPaper-root')]//h5"))
            )
            return result_element.text
        except Exception as e:
            print(f"Error getting result: {e}")
            # Try alternative selectors
            try:
                result_element = WebDriverWait(self.driver, 5).until(
                    EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Likely Profitable') or contains(text(), 'Likely Not Profitable')]"))
                )
                return result_element.text
            except:
                raise Exception("Could not find prediction result") 