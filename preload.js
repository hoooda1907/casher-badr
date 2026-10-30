const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('winApi', {
  saveFile: (o) => ipcRenderer.invoke('save-file', o),
  readBackup: () => ipcRenderer.invoke('read-backup'),
  openFolder: () => ipcRenderer.invoke('open-folder')
});
