export interface RateLimit {
  delaySecond: number
  limitSecond: number
  remainingSecond: number
  usedSecond: number
}
