import { executablePath } from "puppeteer";
import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { solveSlider } from "puppeteer-slider-solve";
import { setTimeout } from "node:timers/promises";
puppeteer.use(StealthPlugin());
const HEADLESS = false; // HEADLESS BROWSER
const type = 1;
async function auth() {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--start-maximized"],
      headless: HEADLESS,
      executablePath: executablePath(),
      slowMo: 150,
    });
    const [page] = await browser.pages();
    let src;
    type === 0
      ? (src = "https://www.hermes.com/es/es/search/?s=Picotin#|")
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
        -25
      );
    } else if (type === 0) {
      await solveSlider(page, "captcha", "#captcha__frame", ".slider", 10);
    }
    await setTimeout(3000)
    await page.screenshot({path:"./test.png"})
  } catch (e) {
    console.log(e);
  } finally {
    if (browser && browser.isConnected()) {
      await browser.close();
    }
  }
}
auth();
