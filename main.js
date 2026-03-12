const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  const possiblePaths = [
    path.join(app.getAppPath(), 'dist/vermieter-app/browser/index.html'), // Angular Standard (Neu)
    path.join(app.getAppPath(), 'dist/vermieter-app/index.html')         // Angular (Alt/Andere Konfig)
  ];

  let finalPath = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      finalPath = p;
      break;
    }
  }

  if (finalPath) {
    console.log("ERFOLG: index.html gefunden unter: " + finalPath);
    win.loadURL(url.format({
      pathname: finalPath,
      protocol: 'file:',
      slashes: true
    }));
  } else {
    console.error("KRITISCH: index.html an keinem der folgenden Orte gefunden:");
    possiblePaths.forEach(p => console.error(" - " + p));
  }

  win.once('ready-to-show', () => {
    win.show();
    setTimeout(() => {
      if (win) win.webContents.reload();
    }, 400);
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});