'use strict';
const app = require('app');
const BrowserWindow = require('browser-window');
var request = require('request');
var fs = require('fs');
var config = require('./server.config.json');
var theScript = fs.readFileSync(__dirname+'/assets/loadscript.js', 'utf8');

// report crashes to the Electron project
require('crash-reporter').start();

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

function createMainWindow () {
    const win = new BrowserWindow({
        width: 1280,
        height: 1024,
        resizable: true,
        title : 'Olapic - demo'
    });
    win.loadUrl('file://' + __dirname + '/assets/loading.html');
    win.on('closed', onClosed);

    return win;
}

function onClosed() {
    // deref the window
    // for multiple windows store them in an array
    mainWindow = null;
}

// prevent window being GC'd
let mainWindow;

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate-with-no-open-windows', function () {
    if (!mainWindow) {
        mainWindow = createMainWindow();
    }
});

var instanceConfig = {};
app.on('ready', function () {
    mainWindow = createMainWindow();

    request(config.configUrl, function (error, response, body) {

        instanceConfig = JSON.parse(body);
        instanceConfig = instanceConfig.config;
        if (!error && response.statusCode == 200) {
            mainWindow.webContents.on('did-finish-load', function() {

                theScript = theScript.replace(/XPATH/g, instanceConfig.xPath);
                theScript = theScript.replace(/APIKEY/g, instanceConfig.apiKey);
                theScript = theScript.replace(/WIDGETINSTANCE/g, instanceConfig.widgetInstance);
                theScript = theScript.replace(/BUILDURL/g, instanceConfig.buildUrl);

                mainWindow.webContents.executeJavaScript(theScript);
            });
            mainWindow.loadUrl(instanceConfig.url);
        }
    });

});



