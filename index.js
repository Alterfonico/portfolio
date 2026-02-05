const fs = require("fs");

app.get("/api/system-status", (req, res) => {
  const data = JSON.parse(
    fs.readFileSync("./telemetry/voltage_log.json", "utf8"),
  );
  const latest = data[data.length - 1];
  res.json(latest);
});
