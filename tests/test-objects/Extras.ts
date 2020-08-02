import { Extra, EmoteSet } from 'comfy.js'

const emoteSet: EmoteSet = {

}

export const onCommandExtra: Extra = {
  isEmoteOnly: false,
  id: '1234567',
  roomId: 'channel',
  channel: 'channel',
  sinceLastCommand: {
    any: null,
    user: null
  },
  messageType: 'chat',
  userColor: '',
  userId: '12345678',
  username: 'testuser',
  displayName: 'TestUser',
  timestamp: '01/01/2020'
}

export const emoteOnlyExtra: Extra = {
  isEmoteOnly: true,
  id: '1234567',
  roomId: 'channel',
  channel: 'channel',
  messageType: 'chat',
  userColor: '',
  userId: '12345678',
  username: 'testuser',
  displayName: 'TestUser',
  timestamp: '01/01/2020',

}