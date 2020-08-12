import { UserFlags } from 'comfy.js'

export function viewerFlags(): UserFlags {
  return {
    subscriber: false,
    vip: false,
    broadcaster: false,
    founder: false,
    mod: false
  }
}

export function subscriberFlags(): UserFlags {
  return {
    subscriber: true,
    vip: false,
    broadcaster: false,
    founder: false,
    mod: false
  }
}

export function vipFlags(): UserFlags {
  return {
    subscriber: false,
    vip: true,
    broadcaster: false,
    founder: false,
    mod: false
  }

}

export function broadcasterFlags(): UserFlags {
  return {
    subscriber: false,
    vip: false,
    broadcaster: true,
    founder: false,
    mod: false
  }
}

export function moderatorFlags(): UserFlags {
  return {
    subscriber: false,
    vip: false,
    broadcaster: false,
    founder: false,
    mod: true
  }
}

export function founderFlags(): UserFlags {
  return {
    subscriber: false,
    vip: false,
    broadcaster: false,
    founder: true,
    mod: false
  }
}