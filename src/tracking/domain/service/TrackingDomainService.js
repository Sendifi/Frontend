import { TrackingEvent } from '../model/TrackingEvent.js'

export class TrackingDomainService {
  static buildTimeline(events = []) {
    return events
      .map((event) => TrackingEvent.fromPrimitives(event instanceof TrackingEvent ? event.toPrimitives() : event))
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
  }
}
