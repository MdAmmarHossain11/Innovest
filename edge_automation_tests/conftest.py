import pytest
from selenium.webdriver import Edge, EdgeOptions
import os

@pytest.fixture(scope="class")
def driver_init(request):
    options = EdgeOptions()
    options.add_argument("start-maximized")
    driver = Edge(options=options)
    if not os.path.exists("edge_automation_tests/screenshots"):
        os.makedirs("edge_automation_tests/screenshots")
    request.cls.driver = driver
    yield
    driver.quit()

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    rep = outcome.get_result()
    if rep.when == "call" and rep.failed:
        driver = getattr(item.instance, "driver", None)
        if driver:
            driver.save_screenshot(f"edge_automation_tests/screenshots/{item.name}_failed.png") 