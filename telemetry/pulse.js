const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const LOG_PATH = path.join(__dirname, "voltage_log.json");

// THE ARCHITECT'S INPUT
rl.question("Current Voltage (1.0 - 10.0): ", (v) => {
  rl.question("Active Pattern / Grip: ", (pattern) => {
    rl.question("Notes: ", (note) => {
      const entry = {
        timestamp: new Date().toISOString(),
        voltage: parseFloat(v),
        pattern: pattern,
        notes: note,
        tags: ["#daily_pulse", "#system_grip"],
      };

      const data = JSON.parse(fs.readFileSync(LOG_PATH, "utf8"));
      data.push(entry);

      fs.writeFileSync(LOG_PATH, JSON.stringify(data, null, 2));

      console.log(
        `\n✅ PULSE RECORDED: V ${v} | System Sovereignty Maintained.`,
      );
      rl.close();
    });
  });
});
