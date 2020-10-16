import { CommandTimePeriod } from "comfy.js";

export function ShouldThrottle(
  timePeriod: CommandTimePeriod,
  cooldownSeconds: number,
  userThrottle: boolean): boolean {

  let throttle = false

  if (timePeriod.any &&
    timePeriod.any > 0 &&
    timePeriod.any < cooldownSeconds * 1000) {
    throttle = true
  }

  if (userThrottle &&
    timePeriod.user &&
    timePeriod.user > 0 &&
    timePeriod.user < cooldownSeconds * 1000) {
    throttle = true
  }

  return throttle
}