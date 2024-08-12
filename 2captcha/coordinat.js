const fetch = require("node-fetch");
const { setTimeout } = require("timers/promises");
const dotenv = require("dotenv");
dotenv.config();
function log(str) {
  if (process.env.DEBUG) {
    console.log(str);
  }
}
class Solver {
  token;
  constructor(token) {
    this.token = token;
  }
  async balance() {
    const res = await fetch(`https://api.2captcha.com/getBalance`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientKey: this.token }),
      method: "POST",
    });
    if (res.status == 200) {
      const body = await res.json();
      return body.balance;
    } else {
      const err = await res.text();
      console.log(err);
    }
  }
  async createTask(body) {
    const res = await fetch(`https://api.2captcha.com/createTask`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientKey: this.token,
        softId: 1,
        task: body,
      }),
      method: "POST",
    });
    if (res.status == 200) {
      const body = await res.json();
      log("CREATE TASK")
      log(body);
      if (body?.errorId == 0 && body?.taskId) {
        return body?.taskId;
      }else{
        throw new Error(`${body.errorCode}\n${body.errorDescription}`)
      }
    }else{
      const err=await res.json();
      log(err)
    }
  }
  async getResult(taskId) {
    const res = await fetch(`https://api.2captcha.com/getTaskResult`, {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientKey: this.token,
        taskId: taskId,
      }),
      method: "POST",
    });
    if (res.status == 200) {
      const body = await res.json();
      log("GET RESULT")
      log(body);
      if (body.errorId == 0 && body.status == "processing") {
        await setTimeout(5000);

        const result = await this.getResult(taskId);
        return result;
      } else if (body.errorId == 0 && body.status == "ready") {
        return body.solution;
      } else if (body.errorId > 0) {
        return false;
      }
    }
  }
  async coordinat(body, num) {
    if (num > 3) {
      throw new Error("2CAPTCHA API NOT WORK NOW");
    }
    const taskId = await this.createTask(body);
    log("TASKID")
    log(taskId);
    if (taskId) {
      const solution = await this.getResult(taskId);
      log("SOLUTION")
      log(solution);
      if (solution) {
        return { data: solution.coordinates, taskId: taskId };
      } else if (!solution) {
        num++;
        const result = await this.coordinat(body, num);
        return result;
      }
    }
  }
}
module.exports.Solver = Solver;
