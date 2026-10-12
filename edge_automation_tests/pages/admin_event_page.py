from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import Select
from utils.base_page import BasePage
import time
import os

class AdminEventPage(BasePage):
    URL = "http://localhost:3000/admin-dashboard"

    def go_to(self):
        self.driver.get(self.URL)
        time.sleep(3)  # Wait for page to load

    def wait_for_admin_dashboard(self):
        """Wait for admin dashboard to load"""
        try:
            # Wait for admin-specific elements
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[contains(@class, 'MuiTabs-root')]"))
            )
            return True
        except:
            return False

    def navigate_to_events_tab(self):
        """Navigate to the Events tab (index 3)"""
        try:
            # Find all tab buttons
            tab_buttons = self.driver.find_elements(By.XPATH, "//button[@role='tab']")
            print(f"Found {len(tab_buttons)} tab buttons")
            
            # Look for Events tab (should be the 4th tab, index 3)
            events_tab = None
            for i, tab in enumerate(tab_buttons):
                tab_text = tab.text.strip()
                print(f"Tab {i}: {tab_text}")
                if "Events" in tab_text:
                    events_tab = tab
                    break
            
            if events_tab:
                print(f"Clicking Events tab: {events_tab.text}")
                events_tab.click()
                time.sleep(3)  # Wait for tab content to load
                return True
            else:
                print("Events tab not found")
                return False
                
        except Exception as e:
            print(f"Error navigating to Events tab: {e}")
            return False

    def click_create_event_button(self):
        """Click the Create Event button to open the dialog"""
        try:
            create_button = WebDriverWait(self.driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Create Event')]"))
            )
            create_button.click()
            time.sleep(2)  # Wait for dialog to open
            return True
        except Exception as e:
            print(f"Error clicking Create Event button: {e}")
            return False

    def wait_for_create_event_dialog(self):
        """Wait for the create event dialog to appear"""
        try:
            WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//div[@role='dialog']//h2[contains(text(), 'Create Event')]"))
            )
            return True
        except:
            return False

    def fill_event_form(self, event_data):
        """Fill the event creation form with provided data using JavaScript to bypass interactability issues."""
        try:
            all_inputs = self.driver.find_elements(By.XPATH, "//div[@role='dialog']//input")
            print(f"Found {len(all_inputs)} input elements (by index): {[inp.get_attribute('type') for inp in all_inputs]}")

            # Title (index 1) - use JavaScript
            if event_data.get('title'):
                title_field = all_inputs[1]
                self.driver.execute_script("arguments[0].value = arguments[1];", title_field, event_data['title'])
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", title_field)
                print(f"✓ Filled title: {event_data['title']}")

            # Description (ReactQuill editor)
            if event_data.get('description'):
                try:
                    quill_editor = self.driver.find_element(By.XPATH, "//div[contains(@class, 'ql-editor')]")
                    quill_editor.click()
                    quill_editor.send_keys(event_data['description'])
                    print(f"✓ Filled description in Quill editor")
                except Exception as e:
                    print(f"Could not fill description: {e}")

            time.sleep(0.5)

            # Location (index 2) - use JavaScript
            if event_data.get('location'):
                location_field = all_inputs[2]
                self.driver.execute_script("arguments[0].value = arguments[1];", location_field, event_data['location'])
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", location_field)
                print(f"✓ Filled location: {event_data['location']}")

            # Location Link (index 3) - use JavaScript
            if event_data.get('location_link'):
                location_link_field = all_inputs[3]
                self.driver.execute_script("arguments[0].value = arguments[1];", location_link_field, event_data['location_link'])
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", location_link_field)
                print(f"✓ Filled location link: {event_data['location_link']}")

            # Categories: robustly select checkboxes in dropdown
            if event_data.get('categories'):
                try:
                    categories_label = self.driver.find_element(By.XPATH, "//label[contains(text(), 'Categories')]")
                    print(f"Found Categories label: {categories_label.text}")
                    try:
                        categories_select = categories_label.find_element(By.XPATH, "following::div[@role='button'][1]")
                    except:
                        categories_select = categories_label.find_element(By.XPATH, "following::div[contains(@class, 'MuiSelect') or contains(@class, 'MuiFormControl')][1]//div[@tabindex='0']")
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", categories_select)
                    categories_select.click()
                    time.sleep(1)
                    # Wait for dropdown options to be visible
                    WebDriverWait(self.driver, 5).until(
                        EC.visibility_of_element_located((By.XPATH, "//li[contains(@class, 'MuiMenuItem-root')]"))
                    )
                    # Print HTML of all dropdown <li> elements for debugging
                    all_lis = self.driver.find_elements(By.XPATH, "//li[contains(@class, 'MuiMenuItem-root')]")
                    print(f"Dropdown options HTML:")
                    for i, li in enumerate(all_lis):
                        print(f"  Option {i}: {li.get_attribute('outerHTML')}")
                    for category in event_data['categories']:
                        try:
                            # Try several selectors for the category text
                            try:
                                li = self.driver.find_element(By.XPATH, f"//li[contains(@class, 'MuiMenuItem-root') and .//span[contains(text(), '{category}')]]")
                            except:
                                li = self.driver.find_element(By.XPATH, f"//li[contains(@class, 'MuiMenuItem-root') and contains(., '{category}')]" )
                            checkbox = li.find_element(By.XPATH, ".//input[@type='checkbox']")
                            if not checkbox.is_selected():
                                self.driver.execute_script("arguments[0].scrollIntoView(true);", li)
                                try:
                                    li.click()
                                except Exception as e:
                                    print(f"  li.click() failed, trying JS click: {e}")
                                    self.driver.execute_script("arguments[0].click();", li)
                                time.sleep(0.5)
                            print(f"✓ Selected category: {category}")
                        except Exception as e:
                            print(f"Could not select category '{category}': {e}")
                    self.driver.find_element(By.XPATH, "//body").click()
                    time.sleep(0.5)
                except Exception as e:
                    print(f"Error selecting categories: {e}")

            # Registration Form Link (index 5) - use JavaScript
            if event_data.get('registration_form'):
                reg_form_field = all_inputs[5]
                self.driver.execute_script("arguments[0].value = arguments[1];", reg_form_field, event_data['registration_form'])
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", reg_form_field)
                print(f"✓ Filled registration form link: {event_data['registration_form']}")

            # Start At (index 8) - use JavaScript
            if event_data.get('start_at'):
                start_field = all_inputs[8]
                self.driver.execute_script("arguments[0].value = arguments[1];", start_field, event_data['start_at'])
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", start_field)
                print(f"✓ Filled start date: {event_data['start_at']}")

            # End At (index 9) - use JavaScript
            if event_data.get('end_at'):
                end_field = all_inputs[9]
                self.driver.execute_script("arguments[0].value = arguments[1];", end_field, event_data['end_at'])
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", end_field)
                print(f"✓ Filled end date: {event_data['end_at']}")

            # Registration End (index 10) - use JavaScript
            if event_data.get('registration_end'):
                reg_end_field = all_inputs[10]
                self.driver.execute_script("arguments[0].value = arguments[1];", reg_end_field, event_data['registration_end'])
                self.driver.execute_script("arguments[0].dispatchEvent(new Event('change', { bubbles: true }));", reg_end_field)
                print(f"✓ Filled registration end date: {event_data['registration_end']}")

            # Upload cover image if provided (index 0) - use correct relative path
            if event_data.get('cover_image'):
                try:
                    import os
                    file_input = all_inputs[0]
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", file_input)
                    # Use correct relative path from test dir
                    file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../', event_data['cover_image']))
                    print(f"Uploading file from: {file_path}")
                    file_input.send_keys(file_path)
                    time.sleep(2)
                    print(f"✓ Uploaded file: {file_path}")
                except Exception as e:
                    print(f"Error uploading file: {e}")

            # Publish switch (index 7, checkbox) - use JavaScript
            if event_data.get('publish') is False:
                try:
                    publish_switch = all_inputs[7]
                    self.driver.execute_script("arguments[0].scrollIntoView(true);", publish_switch)
                    time.sleep(0.2)
                    if publish_switch.is_selected():
                        self.driver.execute_script("arguments[0].click();", publish_switch)
                        print("✓ Toggled publish switch to False")
                except Exception as e:
                    print(f"Error toggling publish switch: {e}")

            # Print summary of filled values
            print("\nAdmin event form filled with the following data:")
            for k, v in event_data.items():
                print(f"  {k}: {v}")
            print("")

            return True
        except Exception as e:
            print(f"Error filling event form: {e}")
            return False

    def submit_event_form(self):
        """Submit the event creation form"""
        try:
            # Debug: Print all buttons in the dialog
            all_buttons = self.driver.find_elements(By.XPATH, "//div[@role='dialog']//button")
            print(f"Found {len(all_buttons)} buttons in dialog:")
            for i, btn in enumerate(all_buttons):
                print(f"  Button {i}: text='{btn.text}' class='{btn.get_attribute('class')}' type='{btn.get_attribute('type')}'")
            
            # Find and click the Create button - try multiple selectors
            create_button = None
            try:
                # Try to find button with "Create" text (excluding "Create Event")
                create_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Create') and not(contains(text(), 'Create Event'))]")
            except:
                try:
                    # Try to find button by position (usually the last button in dialog actions)
                    dialog_actions = self.driver.find_element(By.XPATH, "//div[@role='dialog']//div[contains(@class, 'MuiDialogActions')]")
                    buttons = dialog_actions.find_elements(By.XPATH, ".//button")
                    if buttons:
                        create_button = buttons[-1]  # Last button is usually the primary action
                except:
                    # Try to find any button with "Create" in the dialog
                    create_button = self.driver.find_element(By.XPATH, "//div[@role='dialog']//button[contains(text(), 'Create')]")
            
            if create_button:
                print(f"Found create button: {create_button.text}")
                # Try regular click first
                try:
                    create_button.click()
                except:
                    # If regular click fails, try JavaScript click
                    self.driver.execute_script("arguments[0].click();", create_button)
                
                time.sleep(3)  # Wait for form submission
                print("✓ Form submitted successfully")
                return True
            else:
                print("Could not find create button")
                return False

        except Exception as e:
            print(f"Error submitting event form: {e}")
            return False

    def get_success_message(self):
        """Get success message after event creation"""
        try:
            # Wait for success message
            success_element = WebDriverWait(self.driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'success') or contains(text(), 'created') or contains(text(), 'Event created')]"))
            )
            return success_element.text
        except:
            return "No success message found"

    def close_event_dialog(self):
        """Close the event creation dialog"""
        try:
            cancel_button = self.driver.find_element(By.XPATH, "//button[contains(text(), 'Cancel')]")
            cancel_button.click()
            time.sleep(1)
            return True
        except Exception as e:
            print(f"Error closing dialog: {e}")
            return False 