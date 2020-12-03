const { app, BrowserWindow , ipcMain} = require('electron')
const path = require("path")
const url = require("url")
const process = require("child_process");
let win;
function createWindow () {
   win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  })

 	win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('ready',() => {
	ipcMain.on("start:process",(err,data) => {
		console.log(data.tip);
    var overlay = "";
    switch(parseInt(data.tip)){
        case 1://Sol Üst
          overlay = "overlay=x=10:y=10"
          break;

        case 2:
          overlay = "overlay=x=10:y=H-h-10"

          break;

        case 3:
          overlay = "overlay=x=W-w-10:y=10"

          break;

        case 4:
          overlay = "overlay=x=W-w-10:y=H-h-10"

          break;

        case 5:
          overlay = "overlay=x=(W-w)/2:y=(H-h)/2"

          break;
    }

    console.log("ffmpeg");
    var random = Math.floor(Math.random() * 1000000000) + 1;
    const child = process.exec("ffmpeg -i \""+data.video+"\" -i \""+data.resim+"\" -filter_complex \"[1]format=rgba,colorchannelmixer=aa=0.5,scale=-1:140[a];[0][a]"+overlay+"\" " + random +".mp4",(error,stdout,stderr) => {
      //console.log("ok");
      console.log(stdout);
      console.log(error);
      console.log(stderr);
      
    })

    child.on('close',() => {
        win.webContents.send("result",random);
    })
    
    
	});
})