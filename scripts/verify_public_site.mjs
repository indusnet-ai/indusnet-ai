import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9223;
const USER_DATA_DIR = "C:\\Users\\Admin\\.gemini\\antigravity\\brain\\286e4b84-11e5-4a73-8dc4-d23e8bf87fb9\\scratch\\edge_verify_profile";
const ARTIFACT_DIR = "C:\\Users\\Admin\\.gemini\\antigravity\\brain\\286e4b84-11e5-4a73-8dc4-d23e8bf87fb9";

mkdirSync(USER_DATA_DIR, { recursive: true });

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    };
  }

  async send(method, params = {}) {
    await this.ready;
    const id = this.id++;
    return new Promise((resolve, reject) => {
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function testApiEndpoints() {
  console.log("=== 1. TESTING API ROUTE HANDLERS ===");
  const BASE_URL = "http://localhost:3005";

  // Test 1: Newsletter
  try {
    const res = await fetch(`${BASE_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test_subscriber@indusnet-ai.com" })
    });
    const data = await res.json();
    console.log(`[Newsletter API] Status: ${res.status}`, data);
  } catch (err) {
    console.error("[Newsletter API] Failed:", err.message);
  }

  // Test 2: Consultation Inquiry
  try {
    const res = await fetch(`${BASE_URL}/api/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Verification Visitor",
        email: "test_visitor@indusnet-ai.com",
        company: "Test Enterprise Corp",
        service: "RAG Search Systems",
        message: "Automated verification test inquiry."
      })
    });
    const data = await res.json();
    console.log(`[Consultation Inquiry API] Status: ${res.status}`, data);
  } catch (err) {
    console.error("[Consultation Inquiry API] Failed:", err.message);
  }

  // Test 3: Calendar Booking
  try {
    const res = await fetch(`${BASE_URL}/api/consultations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Verification Visitor",
        email: "test_visitor@indusnet-ai.com",
        company: "Test Enterprise Corp",
        bookingDate: "Tomorrow at 11:00 AM"
      })
    });
    const data = await res.json();
    console.log(`[Consultation Booking API] Status: ${res.status}`, data);
  } catch (err) {
    console.error("[Consultation Booking API] Failed:", err.message);
  }

  // Test 4: Assessment Scoper
  try {
    const res = await fetch(`${BASE_URL}/api/assessments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        domain: "FinTech & Banking",
        businessStyle: "Transactional / High Volume",
        businessContext: "Verification test of automated scoping sheet ingestion.",
        customerProblem: "Testing end to end lead submission and error handling.",
        aiObjectives: ["Automated Document Search", "Risk Profiling"],
        dataProfile: ["PDF Guidelines", "SQL Logs"],
        dataSize: "10,000 - 100,000 records",
        contactName: "Verification Lead",
        contactEmail: "test_scoper@indusnet-ai.com",
        contactCompany: "Test Enterprise Corp",
        contactRole: "Director of Engineering"
      })
    });
    const data = await res.json();
    console.log(`[Assessment Scoper API] Status: ${res.status}`, data);
  } catch (err) {
    console.error("[Assessment Scoper API] Failed:", err.message);
  }
}

async function runBrowserVerification() {
  console.log("\n=== 2. RUNNING BROWSER CHECKS VIA HEADLESS EDGE ===");
  const edge = spawn(EDGE_PATH, [
    '--headless=new',
    '--no-sandbox',
    '--disable-gpu',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${USER_DATA_DIR}`,
    '--window-size=1366,900',
    'about:blank'
  ]);

  await sleep(2500);

  try {
    const listRes = await fetch(`http://127.0.0.1:${PORT}/json`);
    const pages = await listRes.json();
    const page = pages.find(p => p.type === 'page') || pages[0];
    const client = new CDPClient(page.webSocketDebuggerUrl);

    await client.send('Page.enable');
    await client.send('DOM.enable');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 1366,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    const BASE_URL = "http://localhost:3005";

    // 1. Check Desktop 1366px Navbar
    console.log("Navigating to desktop homepage (1366px)...");
    await client.send('Page.navigate', { url: BASE_URL });
    await sleep(2500);

    // Evaluate navbar items & line wrapping
    const navEval = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const links = Array.from(document.querySelectorAll('header nav a')).map(a => a.textContent.trim());
          const nav = document.querySelector('header nav');
          const navHeight = nav ? nav.offsetHeight : 0;
          return {
            linkCount: links.length,
            links: links,
            navHeight: navHeight,
            hasTenderPortal: links.some(l => l.toLowerCase().includes('tender') || l.toLowerCase().includes('portal'))
          };
        })()
      `,
      returnByValue: true
    });
    console.log("Desktop Navbar Inspection Result:", navEval.result.value);

    // Take Desktop Screenshot
    const deskShot = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(ARTIFACT_DIR, "screenshot_desktop_home_1366.png"), Buffer.from(deskShot.data, 'base64'));
    console.log("Saved screenshot_desktop_home_1366.png");

    // 2. Mobile 360px Checks Across Public Pages
    console.log("\nChecking Mobile 360px Viewport across public pages...");
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 360,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true,
    });

    const pagesToCheck = [
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
      { name: "Services", path: "/services" },
      { name: "Careers", path: "/careers" },
      { name: "Portfolio", path: "/portfolio" },
      { name: "Contact", path: "/contact" },
      { name: "Assessment", path: "/assessment" },
      { name: "Blog", path: "/blog" },
      { name: "Privacy", path: "/privacy" },
    ];

    for (const p of pagesToCheck) {
      await client.send('Page.navigate', { url: `${BASE_URL}${p.path}` });
      await sleep(1500);

      const overflowEval = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const docWidth = document.documentElement.offsetWidth;
            const scrollWidth = document.documentElement.scrollWidth;
            const bodyWidth = document.body.scrollWidth;
            return {
              docWidth,
              scrollWidth,
              bodyWidth,
              hasHorizontalScroll: scrollWidth > docWidth || bodyWidth > docWidth
            };
          })()
        `,
        returnByValue: true
      });

      console.log(`[360px Check] ${p.name} (${p.path}):`, overflowEval.result.value);
    }

    // Capture 360px Home and Careers Screenshots
    await client.send('Page.navigate', { url: `${BASE_URL}/` });
    await sleep(1500);
    const mobHomeShot = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(ARTIFACT_DIR, "screenshot_mobile_home_360.png"), Buffer.from(mobHomeShot.data, 'base64'));

    await client.send('Page.navigate', { url: `${BASE_URL}/careers` });
    await sleep(1500);
    const mobCareersShot = await client.send('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(ARTIFACT_DIR, "screenshot_mobile_careers_360.png"), Buffer.from(mobCareersShot.data, 'base64'));

    client.close();
  } catch (err) {
    console.error("Browser verification error:", err);
  } finally {
    edge.kill();
  }
}

async function main() {
  await testApiEndpoints();
  await runBrowserVerification();
  console.log("\nAll verification checks complete!");
}

main().catch(console.error);
