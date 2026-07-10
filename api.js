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

function logout() {
  localStorage.removeItem("authToken");
  window.location.href = "index.html";
}
