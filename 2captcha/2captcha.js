const { Solver } = require("./coordinat.js");
const dotenv = require("dotenv");
const fs = require("fs-extra");
dotenv.config();
function log(str) {
  if (process.env.DEBUG) {
    console.log(str);
  }
}
log(`${__dirname}/imginstructions.png`);
log(`${__dirname}/../cpt/tmp-0.png`);
async function solve2Captcha() {
  const solver = new Solver(process.env.TOKEN);
  const instruction = fs.readFileSync(
    `${__dirname}/imginstructions.png`,
    "base64"
  );
  const img = fs.readFileSync(`${__dirname}/../cpt/tmp-0.png`, "base64");
  const res = await solver.coordinat(
    {
      type: "CoordinatesTask",
      body: img,
      comment: "Puzzle center | Центр пазла",
      imgInstructions: instruction,
    },
    0
  );
  log(res);
  log(res.data);
  return res.data.length > 1
    ? res.data.filter((x) => x.x > 75)[0]
    : res.data[0];
}
module.exports.solve2Captcha = solve2Captcha;
