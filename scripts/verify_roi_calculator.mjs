import { spawn } from "child_process";
import fs from "fs";
import path from "path";

const EDGE_PATH = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const PORT = 9227;
const ARTIFACT_DIR = "C:\\Users\\Admin\\.gemini\\antigravity\\brain\\286e4b84-11e5-4a73-8dc4-d23e8bf87fb9";

async function run() {
  const edge = spawn(EDGE_PATH, [
    "--headless=new",
    "--no-sandbox",
    "--disable-gpu",
    `--remote-debugging-port=${PORT}`,
    "about:blank",
  ]);

  await new Promise((r) => setTimeout(r, 2000));

  try {
    const res = await fetch(`http://127.0.0.1:${PORT}/json`);
    const pages = await res.json();
    const page = pages.find((p) => p.type === "page") || pages[0];
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => {
      ws.onopen = r;
    });

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const cur = id++;
        const onMsg = (e) => {
          const msg = JSON.parse(e.data.toString());
          if (msg.id === cur) {
            ws.removeEventListener("message", onMsg);
            resolve(msg.result);
          }
        };
        ws.addEventListener("message", onMsg);
        ws.send(JSON.stringify({ id: cur, method, params }));
      });
    }

    await send("Page.enable");

    // 1. Desktop 1366px Test
    await send("Emulation.setDeviceMetricsOverride", {
      width: 1366,
      height: 950,
      deviceScaleFactor: 1,
      mobile: false,
    });

    console.log("Navigating to http://localhost:3005/roi-calculator on Desktop (1366px)...");
    await send("Page.navigate", { url: "http://localhost:3005/roi-calculator" });
    await new Promise((r) => setTimeout(r, 3000));

    const deskShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, "screenshot_roi_calculator_desktop.png"),
      Buffer.from(deskShot.data, "base64")
    );
    console.log("Saved screenshot_roi_calculator_desktop.png");

    // 2. Mobile 360px Test
    await send("Emulation.setDeviceMetricsOverride", {
      width: 360,
      height: 800,
      deviceScaleFactor: 2,
      mobile: true,
    });

    console.log("Navigating to http://localhost:3005/roi-calculator on Mobile (360px)...");
    await send("Page.navigate", { url: "http://localhost:3005/roi-calculator" });
    await new Promise((r) => setTimeout(r, 3000));

    const overflowEval = await send("Runtime.evaluate", {
      expression: `
        (() => {
          const docWidth = document.documentElement.clientWidth;
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
      returnByValue: true,
    });
    console.log("[Mobile 360px Check]:", overflowEval.result.value);

    const mobShot = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, "screenshot_roi_calculator_mobile.png"),
      Buffer.from(mobShot.data, "base64")
    );
    console.log("Saved screenshot_roi_calculator_mobile.png");

    ws.close();
  } catch (err) {
    console.error(err);
  } finally {
    edge.kill();
  }
}

run();
