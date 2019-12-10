const {app, BrowserWindow, Menu} = require('electron');

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + "/icon.png",
    webPreferences: {
      nodeIntegration: true
    }
  })

  mainWindow.loadFile('./dist-app/index.html')
  //mainWindow.loadURL("http://localhost:8080");
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', function () {
    mainWindow = null
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  if (mainWindow === null) createWindow()
});

