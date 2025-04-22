export class InitiativeEngine {
  constructor(
    private minInterval = 30_000,
    private maxInterval = 120_000
  ){}

  nextDelay() {
    return this.minInterval + Math.random()*(this.maxInterval - this.minInterval)
  }
}
