/* ============================================================
   EDIT THESE VALUES to connect the site to your real backend
   ============================================================ */
const CONFIG = {
  // Your backend base URL — same one Retrofit uses in RetrofitClient.java
  // (must end with a slash, and must be reachable from the browser, not just the phone)
  API_BASE_URL: "https://energy-monitor-api-mfo9.onrender.com/",

  // The Google Cloud "Web application" OAuth Client ID
  // (NOT the Android client ID from your app — web sign-in needs its own client ID
  //  from the same Google Cloud project. Create one under
  //  Google Cloud Console > APIs & Services > Credentials > Create Credentials > OAuth client ID > Web application)
  GOOGLE_CLIENT_ID: "40413389440-stqctm7monptrrrmquonu2agt31rr3m4.apps.googleusercontent.com",

  // The deviceId your ESP32 / smart meter reports as, same value your app sends as ?deviceId=
  DEVICE_ID: "ESP8266_001",

  // Published CSV links for your Google Sheet tabs (File > Share > Publish to web > pick tab > CSV)
  DAILY_SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRBh83v6Q7v90QrImEbEUmmAM3wd4jXD-jqhKxrsNSeWvef12KcWUsfJo7GlsIJ1c85xKkIzw41MVS9/pub?gid=1459796602&single=true&output=csv",
  MONTHLY_SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRBh83v6Q7v90QrImEbEUmmAM3wd4jXD-jqhKxrsNSeWvef12KcWUsfJo7GlsIJ1c85xKkIzw41MVS9/pub?gid=944233626&single=true&output=csv",
  RAWLOG_SHEET_CSV_URL: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRBh83v6Q7v90QrImEbEUmmAM3wd4jXD-jqhKxrsNSeWvef12KcWUsfJo7GlsIJ1c85xKkIzw41MVS9/pub?gid=874502950&single=true&output=csv",
};