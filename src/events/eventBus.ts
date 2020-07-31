import events from 'events'

export abstract class EventBus {

  public static eventEmitter = new events.EventEmitter()

}