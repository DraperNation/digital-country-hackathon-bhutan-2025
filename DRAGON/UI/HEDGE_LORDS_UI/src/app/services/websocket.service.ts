import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { OptionsTicker, FuturesTicker } from '../models/ticker.model';
import { RestClientService } from './rest-client.service';

interface SubscribeMessage {
  type: string;
  payload: {
    channels: Array<{
      name: string;
      symbols: string[];
    }>;
  };
}

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  // WebSocketSubject instance for the exchange connection.
  private socket$: WebSocketSubject<any> | null = null;
  public options: BehaviorSubject<Map<string, OptionsTicker>> =
    new BehaviorSubject(new Map());
  public future: BehaviorSubject<FuturesTicker | null> =
    new BehaviorSubject<FuturesTicker | null>(null);

  constructor() {}

  public connect(contracts: string[]): void {
    // Define the WebSocket URL. Adjust if needed
    const wsUrl = 'wss://socket.india.delta.exchange';

    // Create the WebSocket connection.
    this.socket$ = webSocket(wsUrl);

    // Send the subscribe message
    const subscribeMessage = {
      type: 'subscribe',
      payload: {
        channels: [
          { name: 'v2/ticker', symbols: contracts }, // Or specify symbols if needed
        ],
      },
    };
    this.socket$.next(subscribeMessage);

    // Listen to incoming messages from the WebSocket.
    this.socket$.subscribe({
      next: (msg: any) => {
        // Process incoming messages and update the provided observables.
        if (
          msg.contract_type === 'call_options' ||
          msg.contract_type === 'put_options'
        ) {
          const newOptions = new Map(this.options.value);
          newOptions.set(msg.symbol, msg);
          this.options.next(newOptions);
        } else if (msg.contract_type === 'perpetual_futures') {
          this.future.next(msg);
        }
      },
      error: (err) => {
        console.error('WebSocket error:', err);
      },
      complete: () => {
        console.warn('WebSocket connection closed.');
      },
    });
  }

  public unsubscribe(): void {
    const unsubscribeMessage = {
      type: 'unsubscribe',
      payload: {
        channels: [
          { name: 'v2/ticker', symbols: [''] }, // Or specify symbols if needed
        ],
      },
    };

    if (this.socket$) {
      this.socket$.next(JSON.stringify(unsubscribeMessage)); // Use next() to send
    }
  }

  public disconnect(): void {
    if (this.socket$) {
      this.unsubscribe();
      this.socket$.complete();
      this.socket$ = null;
    }
  }
}
