import { UserFlags } from 'comfy.js'

export const viewerFlags: UserFlags = {
  subscriber: false,
  vip: false,
  broadcaster: false,
  founder: false,
  mod: false
}

export const subscriberFlags: UserFlags = {
  subscriber: true,
  vip: false,
  broadcaster: false,
  founder: false,
  mod: false
}

export const vipFlags: UserFlags = {
  subscriber: false,
  vip: true,
  broadcaster: false,
  founder: false,
  mod: false
}

export const broadcasterFlags: UserFlags = {
  subscriber: false,
  vip: false,
  broadcaster: true,
  founder: false,
  mod: false
}

export const moderatorFlags: UserFlags = {
  subscriber: false,
  vip: false,
  broadcaster: false,
  founder: false,
  mod: true
}

export const founderFlags: UserFlags = {
  subscriber: false,
  vip: false,
  broadcaster: false,
  founder: true,
  mod: false
}