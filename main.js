const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');
const path = require('path');
const fs = require('fs');

const root = () => path.join(app.getPath('desktop'), 'أسواق بدر');
const safe = (s) => String(s || '').replace(/[\\/:*?"<>|]/g, '_');

ipcMain.handle('save-file', async (e, o) => {
  const dir = path.join(root(), safe(o.folder));
  fs.mkdirSync(dir, { recursive: true });
  const f = path.join(dir, safe(o.name));
  fs.writeFileSync(f, o.b64 ? Buffer.from(o.b64, 'base64') : (o.text || ''));
  return f;
});
ipcMain.handle('read-backup', async () => {
  try { return fs.readFileSync(path.join(root(), 'Backup', 'backup.json'), 'utf8'); }
  catch (e) { return null; }
});
ipcMain.handle('open-folder', async () => {
  fs.mkdirSync(root(), { recursive: true });
  return shell.openPath(root());
});

function createWindow() {
  const w = new BrowserWindow({
    width: 1150, height: 820, title: 'أسواق بدر', autoHideMenuBar: true,
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: { contextIsolation: true, nodeIntegration: false, preload: path.join(__dirname, 'preload.js') }
  });
  Menu.setApplicationMenu(null);
  w.loadFile(path.join(__dirname, 'www', 'index.html'));
}
app.whenReady().then(createWindow);
app.on('window-all-closed', () => app.quit());
