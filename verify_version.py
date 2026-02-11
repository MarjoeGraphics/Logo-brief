import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        context = await browser.new_context()
        page = await context.new_page()

        # Start a local server
        import subprocess
        process = subprocess.Popen(["python3", "-m", "http.server", "8002"])

        try:
            await asyncio.sleep(1)
            await page.goto("http://localhost:8002/index.html")

            # Check for version indicator
            version_indicator = page.locator("div:has-text('v1.1.0')")
            is_visible = await version_indicator.is_visible()
            text = await version_indicator.inner_text()

            print(f"Version indicator visible: {is_visible}")
            print(f"Version indicator text: {text}")

            await page.screenshot(path="version_indicator.png")

            if is_visible and "v1.1.0" in text:
                print("Verification successful")
            else:
                print("Verification failed")
                exit(1)
        finally:
            process.terminate()
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
