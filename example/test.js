import { executablePath } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { solveSlider } from "puppeteer-slider-solve";
import { setTimeout } from "node:timers/promises";
import { PuppeteerScreenRecorder } from "puppeteer-screen-recorder";
puppeteer.use(StealthPlugin());
const HEADLESS = "new"; // HEADLESS BROWSER
const type = 0;
async function test() {
  let browser;
  let recorder;
  try {
    browser = await puppeteer.launch({
      args: ["--start-maximized", "--no-first-run"],
      headless: HEADLESS,
      executablePath: executablePath(),
      slowMo: 100,
    });
    const [page] = await browser.pages();
    recorder = new PuppeteerScreenRecorder(page);
    await recorder.start(`./test.mp4`);
    let src;
    type === 0
      ? (src = "https://www.geetest.com/en/adaptive-captcha-demo")
      : (src = "https://2captcha.com/ru/demo/geetest");
    await page.goto(src, {
      networkIdle2Timeout: 5000,
      waitUntil: "networkidle2",
      timeout: 30000,
    });
    if (type === 1) {
      await page.waitForSelector(".geetest_wait", {
        timeout: 25000,
        visible: true,
      });
      await page.click(".geetest_wait");
      await page.waitForSelector(
        ".geetest_holder.geetest_mobile.geetest_ant.geetest_embed",
        { timeout: 25000, visible: true }
      );
      await solveSlider(
        page,
        false,
        ".geetest_holder.geetest_mobile.geetest_ant.geetest_embed",
        ".geetest_slider_button",
        5
      );
    } else if (type === 0) {
      //await solveSlider(page, "captcha", "#captcha__frame", ".slider", 10);
      await page.waitForSelector(".tab-item.tab-item-1", {
        timeout: 25000,
        visible: true,
      });
      await page.click(".tab-item.tab-item-1");
      await setTimeout(2500);
      await page.click('div[aria-label="Click to verify"]');
      await page.waitForSelector(".geetest_box", {
        timeout: 25000,
        visible: true,
      });
      await page.screenshot({ path: "./screen.png" });
      await solveSlider(page, false, ".geetest_box", ".geetest_btn", 0);
    }
    await setTimeout(5000);
    if (recorder) {
      await recorder.stop();
    }
    await page.screenshot({ path: "./test.png" });
  } catch (e) {
    console.log(e);
  } finally {
    if (browser && browser.isConnected()) {
      await browser.close();
    }
  }
}
test();
