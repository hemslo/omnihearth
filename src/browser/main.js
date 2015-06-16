'use strict';
const app = require('app');
const Menu = require('menu');
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
    width: 800,
    height: 600
  });

  mainWindow.loadUrl(`file://${static_path}/index.html`);

  let template = [{
    label: 'OmniHearth',
    submenu: [{
      label: 'About OmniHearth',
      selector: 'orderFrontStandardAboutPanel:'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: 'Hide Electron',
      accelerator: 'Command+H',
      selector: 'hide:'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Shift+H',
      selector: 'hideOtherApplications:'
    }, {
      label: 'Show All',
      selector: 'unhideAllApplications:'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      selector: 'terminate:'
    }, ]
  }, {
    label: 'Edit',
    submenu: [{
      label: 'Undo',
      accelerator: 'Command+Z',
      selector: 'undo:'
    }, {
      label: 'Redo',
      accelerator: 'Shift+Command+Z',
      selector: 'redo:'
    }, {
      type: 'separator'
    }, {
      label: 'Cut',
      accelerator: 'Command+X',
      selector: 'cut:'
    }, {
      label: 'Copy',
      accelerator: 'Command+C',
      selector: 'copy:'
    }, {
      label: 'Paste',
      accelerator: 'Command+V',
      selector: 'paste:'
    }, {
      label: 'Select All',
      accelerator: 'Command+A',
      selector: 'selectAll:'
    }]
  }, {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'Command+R',
      click: function() {
        mainWindow.restart();
      }
    }, {
      label: 'Toggle Developer Tools',
      accelerator: 'Alt+Command+I',
      click: function() {
        mainWindow.toggleDevTools();
      }
    }, ]
  }, {
    label: 'Window',
    submenu: [{
      label: 'Minimize',
      accelerator: 'Command+M',
      selector: 'performMiniaturize:'
    }, {
      label: 'Close',
      accelerator: 'Command+W',
      selector: 'performClose:'
    }, {
      type: 'separator'
    }, {
      label: 'Bring All to Front',
      selector: 'arrangeInFront:'
    }, ]
  }, {
    label: 'Help',
    submenu: []
  }];
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});
