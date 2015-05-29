'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
const path = require('path');

// report crashes to the Electron project
require('crash-reporter').start();

// prevent window being GC'd
let mainWindow = null;
let static_path = path.resolve(__dirname, '..', '..', 'static');

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: false
  });

  mainWindow.loadUrl(`file://${static_path}/index.html`);

  mainWindow.on('closed', function() {
    // deref the window
    // for multiple windows store them in an array
    mainWindow = null;
  });
});
