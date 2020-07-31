const socket = io.connect('/')

socket.on('onChatMessage', onChatMessageEvent => {
  console.dir(onChatMessageEvent)

})
