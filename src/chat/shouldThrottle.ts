import { TimePeriod } from "comfy.js";
import { log, LogLevel } from "../common";

export function ShouldThrottle(
  timePeriod: TimePeriod,
  cooldownSeconds: number,
  userThrottle: boolean) {

  let throttle: boolean = false

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