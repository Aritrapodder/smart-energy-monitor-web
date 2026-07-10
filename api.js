/* ============================================================
   API layer — mirrors com.yourname.energymonitor.api.ApiService
   Every function here maps 1:1 to a method in your Android
   ApiService.java, so the endpoint paths must match your backend
   exactly the same way they do for the app.
   ============================================================ */

function apiUrl(path) {
  return CONFIG.API_BASE_URL.replace(/\/$/, "") + "/" + path.replace(/^\//, "");
}

function authHeaders() {
  const token = localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: "Bearer " + token } : {}),
  };
}

async function handle(res) {
  if (!res.ok) {
    let body = "";
    try { body = await res.text(); } catch (e) {}
    throw new Error(`API ${res.status}: ${body || res.statusText}`);
  }
  return res.json();
}

const Api = {
  // POST api/auth/register  -> RegisterRequest -> LoginResponse
  register(payload) {
    return fetch(apiUrl("api/auth/register"), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }).then(handle);
  },

  // POST api/auth/login  -> LoginRequest -> LoginResponse
  login(email, password) {
    return fetch(apiUrl("api/auth/login"), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ email, password }),
    }).then(handle);
  },

  // POST api/auth/google  -> GoogleLoginRequest -> LoginResponse
  // NOTE: field name below is a guess ("idToken"). Open GoogleLoginRequest.java
  // and make sure this key matches its field/JSON name exactly.
  googleLogin(idToken) {
    return fetch(apiUrl("api/auth/google"), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ idToken }),
    }).then(handle);
  },

  // GET api/energy/latest?deviceId=
  getLatestReading(deviceId) {
    return fetch(apiUrl(`api/energy/latest?deviceId=${encodeURIComponent(deviceId)}`), {
      headers: authHeaders(),
    }).then(handle);
  },

  // GET api/relay?deviceId=
  getRelayStatus(deviceId) {
    return fetch(apiUrl(`api/relay?deviceId=${encodeURIComponent(deviceId)}`), {
      headers: authHeaders(),
    }).then(handle);
  },

  // POST api/relay/{relayNumber}  -> RelayRequest -> RelayResponse
  setRelay(relayNumber, payload) {
    return fetch(apiUrl(`api/relay/${encodeURIComponent(relayNumber)}`), {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    }).then(handle);
  },

  // GET api/energy/daily?deviceId=
  getDailySummary(deviceId) {
    return fetch(apiUrl(`api/energy/daily?deviceId=${encodeURIComponent(deviceId)}`), {
      headers: authHeaders(),
    }).then(handle);
  },

  // GET api/energy/monthly?deviceId=
  getMonthlySummary(deviceId) {
    return fetch(apiUrl(`api/energy/monthly?deviceId=${encodeURIComponent(deviceId)}`), {
      headers: authHeaders(),
    }).then(handle);
  },

  // GET api/energy/history?deviceId=&limit=
  getHistory(deviceId, limit) {
    return fetch(apiUrl(`api/energy/history?deviceId=${encodeURIComponent(deviceId)}&limit=${limit}`), {
      headers: authHeaders(),
    }).then(handle);
  },
};

function requireAuth() {
  if (!localStorage.getItem("authToken")) {
    window.location.href = "index.html";
  }
}

function getDeviceId() {
  return localStorage.getItem("deviceId") || "";
}

function setDeviceId(id) {
  localStorage.setItem("deviceId", id.trim());
}

// Call on every page that needs a device selected (all pages except index.html and device-setup.html)
function requireDevice() {
  if (!getDeviceId()) {
    window.location.href = "device-setup.html";
  }
}

function changeDevice() {
  const current = getDeviceId();
  const next = prompt("Enter your Device ID (the same one your meter/ESP32 sends):", current);
  if (next && next.trim()) {
    setDeviceId(next);
    location.reload();
  }
}

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "index.html";
}

// Shows a one-time "Enter your Device ID" screen if the customer hasn't set one
// yet, then runs onReady() once it's known. After that, CONFIG.DEVICE_ID is
// set to the saved value for the rest of the page.
function requireDeviceId(onReady) {
  const stored = localStorage.getItem("deviceId");
  if (stored) {
    CONFIG.DEVICE_ID = stored;
    onReady();
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = "deviceGateOverlay";
  overlay.style.cssText =
    "position:fixed;inset:0;background:rgba(10,14,18,0.94);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;";
  overlay.innerHTML = `
    <div style="background:var(--panel);border:1px solid var(--border);border-radius:14px;padding:32px;max-width:380px;width:100%;text-align:center;">
      <div class="eyebrow" style="justify-content:center;margin-bottom:14px;">SETUP</div>
      <h3 style="margin-bottom:10px;font-family:var(--font-display);color:var(--text);">Enter your Device ID</h3>
      <p style="color:var(--text-muted);font-size:13px;margin-bottom:18px;line-height:1.5;">
        This is the ID your smart meter reports as. You'll find it on the meter's label, or ask whoever installed it.
      </p>
      <input id="deviceIdInput" type="text" placeholder="e.g. ESP8266_001"
        style="width:100%;box-sizing:border-box;padding:11px 12px;border-radius:8px;border:1px solid var(--border);
        background:var(--bg-raised);color:var(--text);font-family:var(--font-mono);font-size:14px;margin-bottom:14px;outline:none;" />
      <button id="deviceIdSubmit" class="btn-primary">Continue</button>
      <div id="deviceIdMsg" style="color:var(--coral);font-family:var(--font-mono);font-size:12px;margin-top:10px;min-height:16px;"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = document.getElementById("deviceIdInput");
  const submit = () => {
    const val = input.value.trim();
    if (!val) {
      document.getElementById("deviceIdMsg").textContent = "Please enter a device ID.";
      return;
    }
    localStorage.setItem("deviceId", val);
    CONFIG.DEVICE_ID = val;
    overlay.remove();
    onReady();
  };
  document.getElementById("deviceIdSubmit").onclick = submit;
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
  input.focus();
}

// Lets the customer change their saved device ID later (e.g. clicking the
// DEVICE chip in the top bar).
function changeDeviceId() {
  localStorage.removeItem("deviceId");
  location.reload();
}
