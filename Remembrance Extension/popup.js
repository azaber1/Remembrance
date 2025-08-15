document.addEventListener("DOMContentLoaded", async () => {
  const enabledEl = document.getElementById("enabled");
  const periodEl = document.getElementById("period");
  const testBtn = document.getElementById("test");

  // Load saved state
  const { enabled = true, periodMinutes = 60 } = await chrome.storage.local.get(["enabled", "periodMinutes"]);
  enabledEl.checked = !!enabled;
  periodEl.value = String(periodMinutes);

  // Toggle on/off
  enabledEl.addEventListener("change", async () => {
    await chrome.storage.local.set({ enabled: enabledEl.checked });
  });

  // Change frequency
  periodEl.addEventListener("change", async () => {
    const period = parseInt(periodEl.value, 10);
    await chrome.storage.local.set({ periodMinutes: period });
    // Ask SW to reschedule immediately by pinging it
    await chrome.runtime.sendMessage({ type: "reschedule" }).catch(() => {});
  });

  // Test notification
  testBtn.addEventListener("click", async () => {
    // A lightweight permission nudge (not strictly required for chrome.notifications)
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      try { await Notification.requestPermission(); } catch {}
    }
    await chrome.runtime.sendMessage({ type: "test" }).catch(() => {});
  });
});

// Handle messages in service worker
chrome.runtime.onMessage.addListener(() => {});
