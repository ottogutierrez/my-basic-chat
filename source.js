var app = new Vue({
    el: '#app',
    data: {
      messages: [
          'first comment', 'second comment'
      ],
      currentMessage: '',
    },
    methods: {
        sendMessage: function(){
            this.messages.push(this.currentMessage)
            this.currentMessage = ''
        }
    }
  })