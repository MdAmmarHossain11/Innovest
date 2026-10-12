import os
from utils.logger import get_logger

class BaseTest:
    logger = get_logger("BaseTest")

    def take_screenshot_on_failure(self, request):
        if request.node.rep_call.failed:
            self.driver.save_screenshot(f"edge_automation_tests/screenshots/{request.node.name}_failed.png") 