const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  openApp: (appName) => ipcRenderer.send("open-app", appName),
});
