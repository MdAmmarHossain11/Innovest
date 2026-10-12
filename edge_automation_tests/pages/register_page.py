from selenium.webdriver.common.by import By
from utils.base_page import BasePage

class RegisterPage(BasePage):
    URL = "http://localhost:3000/register"

    def go_to(self):
        self.driver.get(self.URL)

    def fill_form(self, first_name, last_name, email, password):
        self.wait_for_element(By.NAME, "first_name").send_keys(first_name)
        self.wait_for_element(By.NAME, "last_name").send_keys(last_name)
        self.wait_for_element(By.NAME, "email").send_keys(email)
        self.wait_for_element(By.NAME, "password").send_keys(password)
        self.wait_for_element(By.NAME, "password2").send_keys(password)
        print("\nRegistration form filled with the following data:")
        print(f"  First Name: {first_name}")
        print(f"  Last Name: {last_name}")
        print(f"  Email: {email}")
        print(f"  Password: {password}")
        print("")

    def submit(self):
        self.wait_for_clickable(By.XPATH, "//button[@type='submit']").click()

    def get_success_message(self):
        return self.wait_for_element(By.CLASS_NAME, "MuiAlert-message").text 