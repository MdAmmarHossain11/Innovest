from selenium.webdriver.common.by import By
from utils.base_page import BasePage

class LoginPage(BasePage):
    URL = "http://localhost:3000/login"

    def go_to(self):
        self.driver.get(self.URL)

    def fill_form(self, email, password):
        self.wait_for_element(By.NAME, "email").send_keys(email)
        self.wait_for_element(By.NAME, "password").send_keys(password)

    def submit(self):
        self.wait_for_clickable(By.XPATH, "//button[@type='submit']").click()

    def get_success_message(self):
        return self.wait_for_element(By.CLASS_NAME, "MuiAlert-message").text

    def get_error_message(self):
        return self.wait_for_element(By.CLASS_NAME, "error").text 