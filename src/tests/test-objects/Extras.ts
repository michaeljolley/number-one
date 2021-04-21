import { EmoteSet, OnCheerExtra, OnCommandExtra, OnMessageExtra, OnSubExtra } from 'comfy.js'

const emoteSet: EmoteSet = {

}

export function onCommandExtra(): OnCommandExtra {
  return {
    isEmoteOnly: false,
    id: '1234567',
    roomId: 'channel',
    channel: 'channel',
    sinceLastCommand: {
      any: 0,
      user: 0
    },
    messageType: 'chat',
    userColor: '',
    userId: '12345678',
    username: 'testuser',
    displayName: 'TestUser',
    timestamp: '01/01/2020',
    messageEmotes: emoteSet,
    userBadges: {},
    customRewardId: '',
    flags: {}
  }
}
export function onCheerExtra(): OnCheerExtra {
  return {
    "channel": "channel",
    "roomId": "channel",
    "displayName": "TestUser",
    "userId": "12345678",
    "username": "testuser",
    "userColor": "",
    "userBadges": {},
    "messageEmotes": emoteSet,
    "subscriber": ""
  }
}
export function emoteOnlyExtra(): OnMessageExtra {
  return {
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
    messageEmotes: emoteSet,
    userBadges: {},
    customRewardId: '',
    flags: {}
  }
}

export function onSubExtra(): OnSubExtra {
  return {
    channel: 'channel',
    id: '1234567',
    roomId: 'channel',
    messageEmotes: emoteSet,
    messageType: 'chat',
    userBadges: {},
    userColor: '',
    userId: '12345678',
    username: 'testuser',
    displayName: 'TestUser'
  }
}