async function syncSystemPulse() {
  try {
    // Fetching the telemetry from your log file
    // Note: For local development, we point to your JSON file
    const response = await fetch("../telemetry/voltage_log.json");
    const data = await response.json();

    // Get the most recent entry
    const latest = data[data.length - 1];

    // Update the UI elements
    const voltageVal = document.getElementById("voltage-value");
    const voltageFill = document.getElementById("voltage-fill");
    const systemMode = document.getElementById("system-mode");

    if (latest) {
      const v = latest.voltage;
      voltageVal.innerText = v.toFixed(1);
      voltageFill.style.width = v * 10 + "%"; // Convert 1-10 to 0-100%
      systemMode.innerText = latest.pattern || "SOVEREIGN";

      // Chaos Magic: Color Shift based on Voltage
      if (v < 4) {
        voltageFill.style.background = "#ff4d4d";
      } // Low: Red
      else if (v < 7) {
        voltageFill.style.background = "#ffcc00";
      } // Mid: Amber
      else {
        voltageFill.style.background = "#00ff9d";
      } // High: Mentat Green
    }
  } catch (error) {
    console.error("Pulse Sync Failed: Ensure the server is running.", error);
  }
}

// Initial sync and set heartbeat to 30 seconds
syncSystemPulse();
setInterval(syncSystemPulse, 30000);
