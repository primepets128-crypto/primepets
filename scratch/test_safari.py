import time
from playwright.sync_api import sync_playwright

def run():
    print("Initializing Playwright...")
    with sync_playwright() as p:
        iphone = p.devices['iPhone 13']
        print("Launching webkit...")
        browser = p.webkit.launch(headless=True)
        context = browser.new_context(**iphone)
        page = context.new_page()
        
        # Capture console and page errors
        console_logs = []
        page.on("console", lambda msg: console_logs.append(f"[{msg.type}] {msg.text}"))
        page_errors = []
        page.on("pageerror", lambda err: page_errors.append(err))
        
        print("Navigating to https://primepets.in/ ...")
        page.goto("https://primepets.in/", timeout=20000)
        
        # Wait a bit for components to render
        time.sleep(3)
        
        # Take pre-click screenshot
        page.screenshot(path="scratch/iphone_safari_loader.png")
        print("Loader screenshot saved.")
        
        # Click on the loader screen to trigger handleTap (which dismisses it)
        print("Clicking screen to dismiss loader...")
        page.mouse.click(180, 400)
        
        # Wait 3 seconds for transition to finish
        time.sleep(3)
        
        # Take post-click screenshot (should show the home page)
        page.screenshot(path="scratch/iphone_safari_homepage.png")
        print("Homepage screenshot saved.")
        
        print("\n--- CONSOLE LOGS ---")
        for log in console_logs:
            print(log)
            
        print("\n--- PAGE ERRORS ---")
        for err in page_errors:
            print(f"[ERROR] {err}")
            
        browser.close()

if __name__ == "__main__":
    run()
