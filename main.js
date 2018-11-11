const { app, BrowserWindow, ipcMain } = require('electron')
const { SessionsClient } = require('dialogflow');
const dotenv = require('dotenv')
dotenv.config()

const keyPath = process.env.KEY_PATH
const projectId = process.env.PROJECT_ID
const sessionId = 'quickstart-session-id';
const languageCode = 'en-US';


const dialogflowClient = new SessionsClient({
  keyFilename: keyPath
})

// Define session path
const sessionPath = dialogflowClient.sessionPath(projectId, sessionId);


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  win.loadFile('index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  //create the Dialog Flow client

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



ipcMain.on('newMessage', (event,arg)=>{
  //console.log('new message: ' + arg)
  //event.sender.send('messageFromBot', "reply from bot!")
  
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: arg,
        languageCode: languageCode,
      },
    },
  };

  // Send request and log result
  dialogflowClient
  .detectIntent(request)
  .then(responses => {
    //console.log('Detected intent');
    const result = responses[0].queryResult;
    //console.log(result)
    //console.log(`  Query: ${result.queryText}`);
    //console.log(`  Response: ${result.fulfillmentText}`);
    const messageToBot= '--Bot: ' +  result.fulfillmentText
    event.sender.send('messageFromBot',messageToBot)
    // if (result.intent) {
    //   console.log(`  Intent: ${result.intent.displayName}`);
    // } else {
    //   console.log(`  No intent matched.`);
    // }

    // Check if the intent has all the parameters
    if (result.allRequiredParamsPresent == true) {
      console.log('finished intent')
      console.log('Action: '+ result.action)
    }

  })
  .catch(err => {
    console.error('ERROR:', err);
  });

})