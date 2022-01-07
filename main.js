// ---------------------------------------------------------------------------
const electron = require('electron')

// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

//
// Electron 3 audio not allowed before user interaction with the page 
// (Chrome 66 autoplay policy) #13525
//
// https://blog.actorsfit.com/a?ID=00850-b35f1de9-8987-4cb3-9f12-01293371e7cd
//
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		fullscreen: true,
		backgroundColor: "black",
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
			enableRemoteModule: true,
		},
	})
	mainWindow.setMenu(null)

	// and load the index.html of the app.
	mainWindow.loadFile('./index.html')

	// and hide until ready!
//	mainWindow.hide();

	// Open the DevTools.
//	mainWindow.webContents.openDevTools()

	// Emitted when the window is closed.
	mainWindow.on('closed', function () {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null
	});
}

// ---------------------------------------------------------------------------

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	app.quit()
})
  
app.on('activate', function () {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow()
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const { ipcMain } = require('electron')

ipcMain.on('re-launch', (event, arg) => {
	app.relaunch()
	app.exit()
});

ipcMain.on('ready-now', (event, arg) => {
	// ...
});

ipcMain.on('loaded-now', (event, arg) => {
	mainWindow.show()
	mainWindow.focus();
});

ipcMain.on('quit-now', (event, arg) => {
	app.quit()
});
