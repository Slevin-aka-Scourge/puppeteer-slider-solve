# Slider captcha solution using puppeteer and [2CAPTCHA](https://2captcha.com/?from=18177101) captcha solution service

> Suitable for any slider captcha

## Install

```bash
npm install puppeteer-slider-solve
```

## Use

> Add to yours `.env` file is your API KEY of the 2CAPTCHA service, if you are not registered, you can register using this link [2CAPTCHA](https://2captcha.com/?from=18177101)

### Example `.env`
```bash
TOKEN=YOUR_API_KEY_2CAPTCHA
```
### Example
```js
await solveSlider(page,"captcha","#captcha__frame",".slider",10)
//IF CAPTCHA NOT IN FRAME
await solveSlider(page,false,'.geetest_holder.geetest_mobile.geetest_ant.geetest_embed',".geetest_slider_button",-25)
```
#### Fields

Supported options field are listed below.

| Field | Type        | Default value | Required | Description                                                                                                                                                                                                                                   |
| --- |-------------| --- | --- |-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| page | Page        |  | Yes | puppeteer page object                                                                                                                                                                                                                         |
| src | String(Boolean)      |  | Yes | Src frame where the captcha is located (or a distinctive feature of src for example "https://captcha.uvfuns.com ") or false if the captcha is not in the frame                                                                                                                                    |  
| container | String |  | Yes | The selector of the HTML block where the captcha is located |
| slider | String      |  | Yes | The selector of the HTML block where the slider is located                                                                                                                                                                                           |
| shift | Number      | 0 | No | Shift if the slider does not behave linearly (it can be either a positive number or a negative number)  

### Full Example
```js
import puppeteer from "puppeteer";
import { solveSlider } from "puppeteer-slider-solve";

(async () => {
  const browser = await puppeteer.launch({
    args: ["--start-maximized"],
    defaultViewport:false,
    headless: 'new',
    slowMo: 250
  });
  const [page] = await browser.pages();
  await page.goto("https://www.geetest.com/en/adaptive-captcha-demo", {
    waitUntil: "networkidle2",
  });
  await page.waitForSelector(".tab-item.tab-item-1", {
    timeout: 25000,
    visible: true,
  });
  await page.click(".tab-item.tab-item-1");
  await page.waitForSelector('div[aria-label="Click to verify"]', {
    timeout: 25000,
    visible: true,
  });
  await page.click('div[aria-label="Click to verify"]');
  await page.waitForSelector(".geetest_box", { timeout: 25000, visible: true });
  await solveSlider(page, false, ".geetest_box", ".geetest_btn", 0);
  await page.screenshot({ path: "demo.png" });
  await browser.close();
})();
```

## Demo

https://github.com/user-attachments/assets/b0139b96-e083-4f58-8876-8722d3dc5086