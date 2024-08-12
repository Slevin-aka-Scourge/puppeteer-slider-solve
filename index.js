const { solve2Captcha } = require("./2captcha/2captcha.js");
const { setTimeout } = require("timers/promises");
const dotenv = require("dotenv");
dotenv.config();
function log(str) {
  if (process.env.DEBUG) {
    console.log(str);
  }
}
async function boxFrame(page, src, container, slider) {
  let boxContainer, boxSlider, box;
  if (src) {
    const frame = await page.$(`iframe[src*="${src}"]`);
    box = await frame.boundingBox();
    const content = await frame.contentFrame();
    if (container) {
      const element = await content.$(`${container}`);
      boxContainer = await element.boundingBox();
    }
    if (slider) {
      const element = await content.$(`${slider}`);
      boxSlider = await element.boundingBox();
    }
  } else {
    box = { x: 0, y: 0, width: 0, height: 0 };
    if (container) {
      const element = await page.$(`${container}`);
      boxContainer = await element.boundingBox();
    }
    if (slider) {
      const element = await page.$(`${slider}`);
      boxSlider = await element.boundingBox();
    }
  }
  return { frame: box, container: boxContainer, slider: boxSlider };
}
async function customDragIndrop(page, fromX, fromY, toX, toY) {
  await page.mouse.move(fromX, fromY);
  await setTimeout(150);
  await page.mouse.down();
  await setTimeout(150);
  await page.mouse.move(toX, toY);
  await setTimeout(150);
  await page.mouse.up();
  await setTimeout(150);
}
/**
 * @param {String} page - page Browser
 * @param {String|Boolean} src - src on the frame where the captcha is located or false if the captcha is not frame
 * @param {String} container - selector HTML captcha container
 * @param {String} slider - selector HTML captcha slider
 * @param {Number} shift - shift to fine-tune the slider
 * @example
 * await solveSlider(page,false,'.geetest_holder.geetest_mobile.geetest_ant.geetest_embed',".geetest_slider_button",-25)
 * 
 * await solveSlider(page,"captcha","#captcha__frame",".slider",10)

 */
async function solveSlider(page, src, container, slider, shift) {
  const shiftX = shift || 0;
  const box = await boxFrame(page, src, container, slider);
  log(box);
  await page.screenshot({
    path: `${__dirname}/cpt/tmp-0.png`,
    clip: {
      x: box.container.x,
      y: box.container.y,
      width: box.container.width,
      height: box.container.height,
    },
    captureBeyondViewport: true,
  });
  if (process.env.TEST === "true") {
    return;
  }
  const solve = await solve2Captcha();
  log(solve);
  log(100 + shiftX);
  log(
    box.frame.x +
      box.container.x +
      Number(solve.x) +
      shiftX
  );
  await customDragIndrop(
    page,
    box.frame.x + box.slider.x + (box.slider.width/2),
    box.frame.y + box.slider.y + (box.slider.height/2),
    box.frame.x +
      box.container.x +
      Number(solve.x) +
      shiftX,
    box.frame.y + box.slider.y + (box.slider.height/2)
  );
}
module.exports.solveSlider = solveSlider;
