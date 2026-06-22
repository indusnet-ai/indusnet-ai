const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const isWin = process.platform === "win32";
const pythonPath = isWin
  ? path.resolve(process.cwd(), "backend", ".venv", "Scripts", "python.exe")
  : path.resolve(process.cwd(), "backend", ".venv", "bin", "python");

console.log("--------------------------------------------------");
console.log("SMART TENDER COPILOT - CONCURRENT DEV SERVER");
console.log("--------------------------------------------------");

// 1. Start FastAPI Backend
console.log(`[Backend] Starting uvicorn from: ${pythonPath}...`);
const backend = spawn(
  pythonPath,
  ["-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"],
  {
    cwd: path.join(process.cwd(), "backend"),
    stdio: "inherit",
    shell: true,
  }
);

// 2. Start Next.js Frontend
console.log("[Frontend] Starting next dev...");
const frontend = spawn("next", ["dev"], {
  stdio: "inherit",
  shell: true,
});

// Handle clean exits
const cleanExit = () => {
  console.log("\nStopping servers...");
  backend.kill("SIGINT");
  frontend.kill("SIGINT");
  process.exit();
};

process.on("SIGINT", cleanExit);
process.on("SIGTERM", cleanExit);
process.on("exit", () => {
  backend.kill();
  frontend.kill();
});
