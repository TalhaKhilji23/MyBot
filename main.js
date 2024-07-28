const { app, BrowserWindow, ipcMain } = require("electron");
const { exec } = require("child_process");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

ipcMain.on("open-app", (event, appName) => {
  let command;
  switch (appName) {
    case "word":
      command = "start winword";
      break;
    case "excel":
      command = "start excel";
      break;
    case "powerpoint":
      command = "start powerpnt";
      break;
    case "notepad":
      command = "start notepad";
      break;
    case "calculator":
      command = "calc";
      break;
    case "browser":
      command = "start chrome";
      break;
    // Add more cases for other applications...
    default:
      command = "";
  }

  if (command) {
    exec(command, (err) => {
      if (err) {
        console.error(`Error opening ${appName}:`, err);
      }
    });
  }
});
