/**
 * Chronos Seed - Core Logic
 * Follows a fractal state pattern where all UI stems from a single baseMinutes value.
 */

// 1. Data Structure (The Seed)
const state = {
  baseMinutes: 0, // Minutes since start of day in UTC (0 - 1439)
  zones: [
    {
      id: "local",
      name: "Local Time",
      iana: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
    {
      id: "target",
      name: "Mexico City",
      iana: "America/Mexico_City",
    },
  ],
};

// 2. Core Logic Engine
function updateTime(totalMinutes) {
  state.baseMinutes = totalMinutes;
  render();
}

/**
 * Calculates time string for a specific IANA zone based on the scrubber's UTC minutes.
 */
function getZonedTime(iana, totalMinutes) {
  const now = new Date();
  // Create a date object at UTC midnight + totalMinutes
  const date = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      totalMinutes,
    ),
  );

  return new Intl.DateTimeFormat("en-US", {
    timeZone: iana,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

// 3. UI Component (The Atom)
function createZoneCard(zone) {
  const timeStr = getZonedTime(zone.iana, state.baseMinutes);

  /* WORKING HOURS LOGIC (PRESERVED FOR FUTURE USE)
       const hour = parseInt(timeStr.split(':')[0]);
       const isWork = hour >= 9 && hour < 18;
       const statusColor = isWork ? 'text-emerald-400' : 'text-slate-500';
       const statusLabel = isWork ? 'Working Hours' : 'Outside Work';
    */

  return `
        <div class="flex items-center justify-between p-6 bg-slate-800 border border-slate-700 rounded-2xl transition-all duration-300 hover:border-slate-600">
            <div>
                <h2 class="text-lg font-semibold text-white">${zone.name}</h2>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] text-slate-500 mono uppercase tracking-widest">${zone.iana}</span>
                </div>
            </div>
            <div class="text-right">
                <div class="text-3xl font-bold mono tracking-tighter">${timeStr}</div>
                <div class="text-[10px] text-slate-400 uppercase tracking-tighter">Relative to Base</div>
            </div>
        </div>
    `;
}

// 4. Render Engine
function render() {
  const container = document.getElementById("time-stack");
  if (container) {
    container.innerHTML = state.zones.map((z) => createZoneCard(z)).join("");
  }
}

// 5. Initialization & Event Listeners
window.onload = () => {
  const scrubber = document.getElementById("master-scrub");
  const resetBtn = document.getElementById("reset-btn");

  // Synchronize to real-time on load
  const now = new Date();
  const initialMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();

  if (scrubber) {
    scrubber.value = initialMinutes;
    updateTime(initialMinutes);

    scrubber.addEventListener("input", (e) => {
      updateTime(parseInt(e.target.value));
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      const resetNow = new Date();
      const resetMins = resetNow.getUTCHours() * 60 + resetNow.getUTCMinutes();
      if (scrubber) scrubber.value = resetMins;
      updateTime(resetMins);
    });
  }
};
