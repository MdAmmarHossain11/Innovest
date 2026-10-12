import logging
import os

def get_logger(name):
    if not os.path.exists('edge_automation_tests/screenshots'):
        os.makedirs('edge_automation_tests/screenshots')
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.FileHandler('edge_automation_tests/test.log')
        formatter = logging.Formatter('%(asctime)s %(levelname)s %(name)s: %(message)s')
        handler.setFormatter(formatter)
        logger.addHandler(handler)
    logger.setLevel(logging.INFO)
    return logger 