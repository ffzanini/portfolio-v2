import { spawn, execSync } from "child_process";
import { writeFile } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PORT = 3000;
const BASE = `http://localhost:${PORT}`;

/** Retorna o caminho do Chromium/Chrome do sistema (Linux) para evitar falha do bundle do Puppeteer. */
function getChromeExecutablePath() {
  const candidates = [
    "chromium-browser",
    "chromium",
    "google-chrome-stable",
    "google-chrome",
  ];
  for (const cmd of candidates) {
    try {
      const path = execSync(`which ${cmd} 2>/dev/null`, {
        encoding: "utf-8",
        stdio: ["pipe", "pipe", "pipe"],
      }).trim();
      if (path) return path;
    } catch {
      // ignore
    }
  }
  return undefined;
}

function waitForServer(maxAttempts = 60) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const check = () => {
      http
        .get(BASE, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => {
          attempts++;
          if (attempts >= maxAttempts)
            reject(new Error("Server did not start in time"));
          else setTimeout(check, 1000);
        });
    };
    check();
  });
}

async function main() {
  const nextStart = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: ROOT,
    stdio: "ignore",
    detached: true,
    env: { ...process.env, PORT: String(PORT) },
  });
  nextStart.unref();

  try {
    console.log("Aguardando servidor em", BASE, "...");
    await waitForServer();
    console.log("Servidor pronto. Gerando PDFs com Puppeteer...");

    const puppeteer = await import("puppeteer");
    const executablePath = getChromeExecutablePath();
    if (executablePath) {
      console.log("Usando navegador do sistema:", executablePath);
    } else {
      console.log(
        "Chromium do sistema não encontrado. Instale com: sudo apt install chromium-browser (ou chromium)"
      );
    }
    const browser = await puppeteer.default.launch({
      headless: true,
      executablePath: executablePath || undefined,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--single-process",
        "--no-zygote",
        "--disable-software-rasterizer",
      ],
    });

    for (const lang of ["pt", "en"]) {
      const page = await browser.newPage();
      await page.goto(`${BASE}/resume?lang=${lang}`, {
        waitUntil: "networkidle2",
      });
      await page.addStyleTag({
        content: `
          @media print { .no-print { display: none !important; } nav { display: none; } }
          body { margin: 0; box-sizing: border-box; }
          .page-break { page-break-before: always; }
        `,
      });
      const pdfPath = join(ROOT, "public", `resume-${lang}.pdf`);
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: { top: "10mm", bottom: "10mm" },
      });
      await writeFile(pdfPath, pdfBuffer);
      console.log("Gerado:", pdfPath);
      await page.close().catch(() => {});
    }

    await browser.close().catch(() => {});
  } finally {
    try {
      nextStart.kill("SIGTERM");
    } catch {
      if (nextStart.pid) process.kill(-nextStart.pid, "SIGTERM");
    }
  }
  console.log(
    "PDFs salvos em public/. Faça commit e deploy para servir estático.",
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
