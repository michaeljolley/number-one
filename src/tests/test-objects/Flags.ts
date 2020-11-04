import { OnCheerFlags, OnMessageFlags } from 'comfy.js'

export function viewerFlags(): OnMessageFlags {
  return {
    subscriber: false,
    vip: false,
    broadcaster: false,
    founder: false,
    mod: false,
    highlighted: false,
    customReward: false
  }
}

export function subscriberFlags(): OnMessageFlags {
  return {
    subscriber: true,
    vip: false,
    broadcaster: false,
    founder: false,
    mod: false,
    highlighted: false,
    customReward: false
  }
}

export function vipFlags(): OnMessageFlags {
  return {
    subscriber: false,
    vip: true,
    broadcaster: false,
    founder: false,
    mod: false,
    highlighted: false,
    customReward: false
  }

}

export function broadcasterFlags(): OnMessageFlags {
  return {
    subscriber: false,
    vip: false,
    broadcaster: true,
    founder: false,
    mod: false,
    highlighted: false,
    customReward: false
  }
}

export function moderatorFlags(): OnMessageFlags {
  return {
    subscriber: false,
    vip: false,
    broadcaster: false,
    founder: false,
    mod: true,
    highlighted: false,
    customReward: false
  }
}

export function founderFlags(): OnMessageFlags {
  return {
    subscriber: false,
    vip: false,
    broadcaster: false,
    founder: true,
    mod: false,
    highlighted: false,
    customReward: false
  }
}

export function cheerSubFlags(): OnCheerFlags {
  return {
    mod: false,
    founder: false,
    subscriber: true,
    vip: true
  }
}