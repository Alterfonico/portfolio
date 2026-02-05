async function updateSystemPulse() {
  const response = await fetch("/api/system-status");
  const status = await response.json();
  document.getElementById("voltage-display").innerText =
    `V: ${status.voltage.toFixed(1)}`;
  document.getElementById("system-mode").innerText =
    `MODE: ${status.mode || "GHOST"}`;
}
setInterval(updateSystemPulse, 30000); // Pulse every 30s
updateSystemPulse();
