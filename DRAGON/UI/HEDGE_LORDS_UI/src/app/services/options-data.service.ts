import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OptionsDataService {
  private socket$: WebSocketSubject<any>;
  private optionsData$ = new BehaviorSubject<any[]>([]);
  private futuresData$ = new BehaviorSubject<any>(null);
  private currentSymbol$ = new BehaviorSubject<string>('');

  constructor() {
    this.socket$ = webSocket('ws://localhost:8001/stream/options');
    
    this.socket$.subscribe({
      next: (message: any) => {
        if (message.purpose === 'prices') {
          const futures = message.options_chain.find(
            (item: any) => item.contract_type === 'perpetual_futures'
          );
          
          if (futures) {
            this.futuresData$.next(futures);
            this.currentSymbol$.next(futures.symbol);
          }
          
          const optionsOnly = message.options_chain.filter(
            (item: any) => item.contract_type !== 'perpetual_futures'
          );
          
          const groupedOptions = this.groupAndSortOptions(optionsOnly);
          this.optionsData$.next(groupedOptions);
        }
      },
      error: (err: any) => console.error('WebSocket error:', err),
      complete: () => console.warn('WebSocket connection closed.')
    });
  }

  getOptionsData(): Observable<any[]> {
    return this.optionsData$.asObservable();
  }

  getFuturesData(): Observable<any> {
    return this.futuresData$.asObservable();
  }

  getCurrentSymbol(): Observable<string> {
    return this.currentSymbol$.asObservable();
  }

  // Helper method to find a specific option by type and strike price
  findOption(type: 'call' | 'put', strikePrice: number): Observable<any> {
    return this.optionsData$.pipe(
      map(options => {
        const row = options.find(opt => 
          (type === 'call' && opt.call?.strike_price === strikePrice) || 
          (type === 'put' && opt.put?.strike_price === strikePrice)
        );
        
        return type === 'call' ? row?.call : row?.put;
      })
    );
  }

  private groupAndSortOptions(options: any[]): any[] {
    const grouped = options.reduce((acc: any, option: any) => {
      const strike = option.strike_price;
      if (!acc[strike]) {
        acc[strike] = { call: null, put: null };
      }
      if (option.contract_type === 'call_options') {
        acc[strike].call = option;
      } else if (option.contract_type === 'put_options') {
        acc[strike].put = option;
      }
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => parseFloat(a) - parseFloat(b))
      .map(strike => grouped[strike]);
  }
} 