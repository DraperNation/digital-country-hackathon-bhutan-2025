import { Injectable, OnDestroy } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { PositionSelection, LivePosition } from './position.service';
import { HttpClient } from '@angular/common/http';

// Define the message types for type safety
export interface PayoffMessage {
  type: string;
  timestamp?: number;
  data?: {
    x: number[];
    y: number[];
  };
  selected_contracts?: Record<string, string>;
  price_range_percentage?: number;
}

export interface ContractSelectionRequest {
  type: 'select_contract' | 'deselect_contract';
  symbol: string;
  position: 'buy' | 'sell';
}

@Injectable({
  providedIn: 'root',
})
export class PayoffWebsocketService {
  private readonly API_URL = 'http://localhost:8001/stream/get-graph';
  private readonly SELECT_OPTION_URL = 'http://localhost:8001/stream/select-option';

  public payoffDataSubject = new BehaviorSubject<{ x: number[]; y: number[] }>({
    x: [],
    y: [],
  });

  public payoffData$ = this.payoffDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  public refreshPayoffData(): void {
    this.http.post<PayoffMessage>(this.API_URL, {}).subscribe({
      next: (response) => {
        if (response.type === 'payoff_update' && response.data) {
          this.payoffDataSubject.next({
            x: response.data.x,
            y: response.data.y,
          });
        } else {
          console.warn('Unexpected response format:', response);
        }
      },
      error: (err) => {
        console.error('Error fetching payoff data:', err);
      },
    });
  }

  /**
   * Formats the contract symbol in the required format (C-BTC-86200-160425 or P-BTC-86200-160425)
   * @param position The position containing type, symbol, strike price and expiration date
   * @returns Formatted symbol string
   */
  private formatContractSymbol(position: LivePosition): string {
    // Extract type indicator (C for call, P for put)
    const typePrefix = position.type === 'call' ? 'C' : 'P';
    
    // Format the strike price without decimal points
    const formattedStrike = position.strikePrice.toString();
    
    // Format expiry date (assuming it's in ISO format YYYY-MM-DD, convert to DDMMYY)
    let formattedExpiry = '';
    try {
      const expiry = new Date(position.expirationDate);
      const day = expiry.getDate().toString().padStart(2, '0');
      const month = (expiry.getMonth() + 1).toString().padStart(2, '0');
      const year = expiry.getFullYear().toString().slice(2);
      formattedExpiry = day + month + year;
    } catch (e) {
      console.error('Error formatting expiry date:', e);
      // Use original format as fallback
      formattedExpiry = position.expirationDate.replace(/-/g, '').slice(2);
    }
    
    // Construct the full symbol
    return `${typePrefix}-${position.underlying}-${formattedStrike}-${formattedExpiry}`;
  }

  /**
   * Selects a contract by sending a request to the backend
   * @param position The position to be selected
   * @param action The action (buy/sell) for the position
   */
  public selectContract(position: LivePosition, action: 'buy' | 'sell'): void {
    const formattedSymbol = this.formatContractSymbol(position);
    
    const request: ContractSelectionRequest = {
      type: 'select_contract',
      symbol: formattedSymbol,
      position: action
    };

    console.log('Selecting contract with symbol:', formattedSymbol);
    console.log(request)
    this.http.post<any>(this.SELECT_OPTION_URL, request).subscribe({
      next: (response) => {
        console.log('Contract selected successfully:', response);
        this.refreshPayoffData(); // Refresh the payoff data after selection
      },
      error: (err) => {
        console.error('Error selecting contract:', err);
      }
    });
  }

  /**
   * Deselects a contract by sending a request to the backend
   * @param position The position to be deselected
   * @param action The action (buy/sell) for the position
   */
  public deselectContract(position: LivePosition, action: 'buy' | 'sell'): void {
    const formattedSymbol = this.formatContractSymbol(position);
    
    const request: ContractSelectionRequest = {
      type: 'deselect_contract',
      symbol: formattedSymbol,
      position: action
    };

    console.log('Deselecting contract with symbol:', formattedSymbol);
    
    this.http.post<any>(this.SELECT_OPTION_URL, request).subscribe({
      next: (response) => {
        console.log('Contract deselected successfully:', response);
        this.refreshPayoffData(); // Refresh the payoff data after deselection
      },
      error: (err) => {
        console.error('Error deselecting contract:', err);
      }
    });
  }

  /**
   * Clears all contracts by sending multiple deselect requests
   * @param positions Array of positions to be cleared
   */
  public clearAllContracts(positions: LivePosition[]): void {
    // If there are no positions, no need to do anything
    if (positions.length === 0) {
      return;
    }

    // Create an array of promises for each deselect operation
    const deselectPromises = positions.map(position => {
      const formattedSymbol = this.formatContractSymbol(position);
      
      const request: ContractSelectionRequest = {
        type: 'deselect_contract',
        symbol: formattedSymbol,
        position: position.action
      };
      
      return this.http.post<any>(this.SELECT_OPTION_URL, request).toPromise();
    });

    // Execute all deselect operations and refresh data once completed
    Promise.all(deselectPromises)
      .then(() => {
        console.log('All contracts cleared successfully');
        this.refreshPayoffData();
      })
      .catch(err => {
        console.error('Error clearing contracts:', err);
      });
  }
}