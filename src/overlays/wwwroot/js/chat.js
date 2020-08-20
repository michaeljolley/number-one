const socket = io.connect('/')

socket.on('onChatMessage', onChatMessageEvent => {
  console.dir(onChatMessageEvent)

  let bubble = createDiv(['bubble'])
  let message = createDiv(['message'])
  let profile = createDiv(['profile'])

  let profileImg = document.createElement('img')
  profileImg.src = onChatMessageEvent.user.avatar_url

  profile.appendChild(profileImg)

  message.innerText = onChatMessageEvent.message

  bubble.appendChild(message)
  bubble.appendChild(profile)

  let chat = document.getElementById('chat')
  chat.appendChild(bubble)
})

function createDiv(classList) {
  const div = document.createElement('div')
  for (i = 0; i < classList.length; i++) {
    div.classList.add(classList[i])
  }
  return div
}