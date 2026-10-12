import pytest
from selenium.webdriver.common.by import By
from pages.register_page import RegisterPage
from utils.base_test import BaseTest
import time

@pytest.mark.usefixtures("driver_init")
class TestRegister(BaseTest):
    def test_register_form(self, request):
        page = RegisterPage(self.driver)
        page.go_to()
        # Check for the presence of the 'Create Account' heading
        heading = page.wait_for_element(By.XPATH, "//h1[contains(text(), 'Create Account')]")
        assert heading is not None
        # Generate a unique email
        unique_email = f"testuser_{int(time.time())}@example.com"
        page.fill_form("Test", "User", unique_email, "Password123!")
        page.submit()
        # Debug: Take screenshot and print URL after submit
        self.driver.save_screenshot("edge_automation_tests/screenshots/register_after_submit.png")
        print("Current URL after submit:", self.driver.current_url)
        # Try to get the message, but handle timeout gracefully
        try:
            msg = page.get_success_message().lower()
            print("Registration message:", msg)
            assert "registration successful" in msg or "check your email" in msg
        except Exception as e:
            print("Could not find success/error message:", e)
            # Try to print any visible validation errors
            errors = self.driver.find_elements(By.CLASS_NAME, "MuiFormHelperText-root")
            for err in errors:
                print("Validation error:", err.text)
            # Fail the test with a helpful message
            assert False, "No registration message found. See screenshot and console output for details." 