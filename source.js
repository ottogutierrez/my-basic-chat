const {ipcRenderer} = require('electron')

var app = new Vue({
    el: '#app',
    data: {
      messages: [
          {
              type: 'bot',
              content: 'Start typing your messages to the bot'
          }
          
      ],
      currentMessage: '',
    },
    methods: {
        sendMessage: function(){
            var tempMessage = this.currentMessage
            const messageObj = {
                type: 'user',
                content: tempMessage
            }
            this.messages.push(messageObj)
            this.currentMessage = ''
            Vue.nextTick(function () {
                var div = document.getElementById('chat-list-ul');
                div.scrollTop = div.scrollHeight;
            })
            document.querySelector('#messageInput').focus()
            ipcRenderer.send('newMessage', tempMessage)

        },
        newMessageFromBot: function(arg){
            const messageObj = {
                type: 'bot',
                content: arg
            }
            this.messages.push(messageObj)
            Vue.nextTick(function () {
                var div = document.getElementById('chat-list-ul');
                div.scrollTop = div.scrollHeight;
            })
        }
    }
  })

  ipcRenderer.on('messageFromBot',(event,arg)=>{
      app.newMessageFromBot(arg)
  })