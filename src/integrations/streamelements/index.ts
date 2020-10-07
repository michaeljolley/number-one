import io from 'socket.io-client';
import { log, LogLevel } from '../../common';
import { EventBus, Events } from '../../events';
import { Config, OnDonationEvent, User } from "../../models";
import { Twitch } from '../twitch-api';

export default class StreamElements {

  private socket: SocketIOClient.Socket;

  constructor(private config: Config) {
    this.socket = io('https://realtime.streamelements.com', {
      transports: ['websocket']
    });

    // Socket connected
    this.socket.on('connect', this.onConnect);
    // Socket got disconnected
    this.socket.on('disconnect', this.onDisconnect);
    // Socket is authenticated
    this.socket.on('authenticated', this.onAuthenticated);

    this.socket.on('event:test', (data) => {
      data.event.test = true;
      switch (data.listener) {
        case 'tip-latest':
          this.onDonation(data.event);
      }
    });
    this.socket.on('event', (data) => {
      switch (data.type) {
        case 'tip':
          this.onDonation(data.data);
      }
    });
  }

  onConnect = () => {
    log(LogLevel.Info, `Successfully connected to the StreamElements websocket`)
    this.socket.emit('authenticate', {
      method: 'jwt',
      token: this.config.streamElementsJWT
    });
  }

  onDisconnect = () => {
    log(LogLevel.Info, `Disconnected from StreamElements websocket`)
  }

  onAuthenticated = (data) => {
    const {
      channelId
    } = data;

    log(LogLevel.Info, `Successfully connected to channel ${channelId}`)
  }

  onDonation = (data) => {
    const name = data.username || data.name;
    EventBus.eventEmitter.emit(Events.OnDonation, new OnDonationEvent(name, data.amount, data.message));
  }
}
