import { TimePeriod } from "comfy.js";

export function ShouldThrottle(
  timePeriod: TimePeriod,
  cooldownSeconds: number,
  userThrottle: boolean) {

  let throttle: boolean = false

  if (timePeriod.any &&
    timePeriod.any < cooldownSeconds * 1000) {
    throttle = true
  }

  if (userThrottle &&
    timePeriod.user &&
    timePeriod.user < cooldownSeconds * 1000) {
    throttle = true
  }

  return throttle
}