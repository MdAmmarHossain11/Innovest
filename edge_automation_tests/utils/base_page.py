from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver

    def wait_for_element(self, by, value, timeout=10):
        return WebDriverWait(self.driver, timeout).until(EC.presence_of_element_located((by, value)))

    def wait_for_clickable(self, by, value, timeout=10):
        return WebDriverWait(self.driver, timeout).until(EC.element_to_be_clickable((by, value)))

    def get_title(self):
        return self.driver.title

    def get_url(self):
        return self.driver.current_url

    def take_screenshot(self, name):
        self.driver.save_screenshot(f"edge_automation_tests/screenshots/{name}.png") 