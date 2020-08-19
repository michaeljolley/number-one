const socket = io.connect('/')

socket.on('onChatMessage', onChatMessageEvent => {
  console.dir(onChatMessageEvent)

  let div = document.createElement('div')
  div.innerText = onChatMessageEvent.message

  let chat = document.getElementById('chat')

  chat.appendChild(div)

})
