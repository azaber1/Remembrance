const NOTIF_ID_PREFIX = "athkar_";
const ALARM_NAME = "hourlyAthkar";
const DEFAULT_ENABLED = true;
const DEFAULT_PERIOD_MIN = 60; // change to 30 or 15 if you want more frequent

// --- Adhkar list (no repeats until all are used) ---
const ATHKAR = [
  {
    title: "Light on the tongue, heavy on the scales",
    message: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ"
  },
  {
    title: "A solution for worries",
    message: "أَسْتَغْفِرُ اللهَ وَأَتُوبُ إِلَيْهِ"
  },
  {
    title: "Blessed tenfold",
    message: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ"
  },
  {
    title: "Most beloved words",
    message: "سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ"
  },
  {
    title: "A palm tree in Jannah",
    message: "سُبْحَانَ اللهِ الْعَظِيمِ وَبِحَمْدِهِ"
  }
];

// Shuffle helper
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Keep a shuffled queue in storage so service worker restarts don’t repeat
async function getQueue() {
  const { athkarQueue } = await chrome.storage.local.get("athkarQueue");
  if (Array.isArray(athkarQueue) && athkarQueue.length) return athkarQueue;
  const fresh = shuffle(ATHKAR);
  await chrome.storage.local.set({ athkarQueue: fresh });
  return fresh;
}

async function popNextAthkar() {
  const queue = await getQueue();
  const next = queue.shift();
  if (queue.length === 0) {
    await chrome.storage.local.set({ athkarQueue: shuffle(ATHKAR) });
  } else {
    await chrome.storage.local.set({ athkarQueue: queue });
  }
  return next;
}

// Align to the top of the next hour
function msUntilTopOfNextHour() {
  const now = new Date();
  const next = new Date(now);
  next.setMinutes(0, 0, 0);
  next.setHours(now.getHours() + 1);
  return next.getTime() - now.getTime();
}

async function scheduleAlarm() {
  const { periodMinutes } = await chrome.storage.local.get("periodMinutes");
  const period = Number.isFinite(periodMinutes) ? periodMinutes : DEFAULT_PERIOD_MIN;

  // Create one-shot alarm at next top-of-hour (or now + period if not hourly)
  const when = period === 60 ? Date.now() + msUntilTopOfNextHour()
                             : Date.now() + period * 60 * 1000;

  await chrome.alarms.clear(ALARM_NAME);
  await chrome.alarms.create(ALARM_NAME, {
    when,
    periodInMinutes: period
  });
}

async function ensureInitialized() {
  const data = await chrome.storage.local.get(["enabled", "periodMinutes"]);
  const updates = {};
  if (typeof data.enabled !== "boolean") updates.enabled = DEFAULT_ENABLED;
  if (!Number.isFinite(data.periodMinutes)) updates.periodMinutes = DEFAULT_PERIOD_MIN;
  if (Object.keys(updates).length) await chrome.storage.local.set(updates);
}

// Show notification
async function showAthkarNotification() {
  const athkar = await popNextAthkar();

  await chrome.notifications.create(
    NOTIF_ID_PREFIX + Date.now(),
    {
      type: "basic",
      title: athkar.title,
      message: athkar.message,
      iconUrl: "icon48.png",
      requireInteraction: true,
      priority: 2
    }
  );
}

// Fired on install/update and on browser start
chrome.runtime.onInstalled.addListener(async () => {
  await ensureInitialized();
  await scheduleAlarm();
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureInitialized();
  await scheduleAlarm();
});

// Alarm tick
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name !== ALARM_NAME) return;
  const { enabled } = await chrome.storage.local.get("enabled");
  if (!enabled) return;

  // (Optional) Respect OS Do Not Disturb? Chrome API has no direct DND; skip.

  await showAthkarNotification();
});

// Optional: clicking a notification closes it
chrome.notifications.onClicked.addListener((id) => {
  chrome.notifications.clear(id);
});
