const {ipcRenderer} = require('electron')

var app = new Vue({
    el: '#app',
    data: {
      messages: [
          'Start typing your messages to the bot'
      ],
      currentMessage: '',
    },
    methods: {
        sendMessage: function(){
            var tempMessage = this.currentMessage
            this.messages.push(tempMessage)
            this.currentMessage = ''
            Vue.nextTick(function () {
                var div = document.getElementById('chat-list-ul');
                div.scrollTop = div.scrollHeight;
            })
            document.querySelector('#messageInput').focus()
            ipcRenderer.send('newMessage', tempMessage)

        },
        newMessageFromBot: function(arg){
            this.messages.push(arg)
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