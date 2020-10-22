import io from 'socket.io-client';
import { log, LogLevel } from '../../common';
import { EventBus, Events } from '../../events';
import { Config, OnDonationEvent } from "../../models";
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

    this.socket.on('event:test', async (data:any) => {
      data.event.test = true;
      switch (data.listener) {
        case 'tip-latest':
          await this.onDonation(data.event);
      }
    });
    this.socket.on('event', async (data) => {
      switch (data.type) {
        case 'tip':
          await this.onDonation(data.data);
      }
    });
  }

  onConnect = (): void => {
    log(LogLevel.Info, `Successfully connected to the StreamElements websocket`)
    this.socket.emit('authenticate', {
      method: 'jwt',
      token: this.config.streamElementsJWT
    });
  }

  onDisconnect = (): void => {
    log(LogLevel.Info, `Disconnected from StreamElements websocket`)
  }

  onAuthenticated = (data:any): void => {
    const {
      channelId
    } = data;

    log(LogLevel.Info, `Successfully connected to channel ${channelId}`)
  }

  onDonation = async (data:any): Promise<void> => {
    const name = data.username || data.name;
    const user = await Twitch.getUser(name);
    EventBus.eventEmitter.emit(Events.OnDonation, new OnDonationEvent(name, data.amount, data.message, user));
  }
}
