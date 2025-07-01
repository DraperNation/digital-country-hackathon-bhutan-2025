import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, take } from 'rxjs';
import { map } from 'rxjs/operators';
import { OptionsDataService } from './options-data.service';
import { PayoffWebsocketService } from './payoff-websocket.service';

export interface PositionSelection {
  id: string;
  type: 'call' | 'put';
  strikePrice: number;
  symbol: string;
  action: 'buy' | 'sell';
  expirationDate: string;
  underlying: string;
}

export interface LivePosition extends PositionSelection {
  bestBid: number | null;
  bestAsk: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class PositionService {
  private selectedPositions = new BehaviorSubject<PositionSelection[]>([]);
  
  constructor(
    private optionsDataService: OptionsDataService,
    private payoffService: PayoffWebsocketService
  ) {}

  getSelectedPositions(): Observable<PositionSelection[]> {
    return this.selectedPositions.asObservable();
  }
  
  // This is the key method that combines user selections with live data
  getLivePositions(): Observable<LivePosition[]> {
    return combineLatest([
      this.selectedPositions.asObservable(),
      this.optionsDataService.getOptionsData()
    ]).pipe(
      map(([selections, optionsData]) => {
        return selections.map(selection => {
          const option = this.findOptionInData(selection.type, selection.strikePrice, optionsData);
          
          return {
            ...selection,
            bestBid: option ? option.best_bid : null,
            bestAsk: option ? option.best_ask : null
          };
        });
      })
    );
  }
  
  private findOptionInData(type: 'call' | 'put', strikePrice: number, optionsData: any[]): any {
    if (!optionsData || optionsData.length === 0) {
      return null;
    }
    
    const row = optionsData.find(opt => 
      (type === 'call' && opt.call?.strike_price === strikePrice) || 
      (type === 'put' && opt.put?.strike_price === strikePrice)
    );
    
    return type === 'call' ? row?.call : row?.put;
  }

  addPosition(type: 'call' | 'put', strikePrice: number, symbol: string, expiryDate: string): void {
    const currentPositions = this.selectedPositions.getValue();
    
    // Check if position already exists
    const exists = currentPositions.some(
      p => p.type === type && p.strikePrice === strikePrice && p.symbol === symbol
    );
    
    if (exists) {
      return;
    }
    
    // Extract underlying asset (first 3 letters of symbol)
    const underlying = symbol.substring(0, 3);
    
    const newPosition: PositionSelection = {
      id: `${type}-${strikePrice}-${Date.now()}`,
      type,
      strikePrice,
      symbol,
      action: 'buy', // Default action
      expirationDate: expiryDate,
      underlying
    };
    
    // Add to selected positions
    this.selectedPositions.next([...currentPositions, newPosition]);
    
    // Get the live position data (with bid/ask prices)
    // Use take(1) to ensure we only subscribe once and then complete
    this.getLivePositionById(newPosition.id).pipe(take(1)).subscribe(livePosition => {
      if (livePosition) {
        // Send message to API with default 'buy' action
        this.payoffService.selectContract(livePosition, 'buy');
      }
    });
  }

  updatePositionAction(id: string, action: 'buy' | 'sell'): void {
    const currentPositions = this.selectedPositions.getValue();
    const positionToUpdate = currentPositions.find(p => p.id === id);
    const oldAction = positionToUpdate?.action;
    
    // Update positions in the observable
    const updatedPositions = currentPositions.map(position => 
      position.id === id ? { ...position, action } : position
    );
    this.selectedPositions.next(updatedPositions);
    
    // If the position exists and the action has changed, update the API
    if (positionToUpdate && oldAction !== action) {
      // Use take(1) to ensure we only subscribe once and then complete
      this.getLivePositionById(id).pipe(take(1)).subscribe(livePosition => {
        if (livePosition) {
          // First deselect with old action if it exists
          if (oldAction) {
            this.payoffService.deselectContract(livePosition, oldAction);
          }
          
          // Then select with new action
          this.payoffService.selectContract(livePosition, action);
        }
      });
    }
  }

  removePosition(id: string): void {
    const currentPositions = this.selectedPositions.getValue();
    const positionToRemove = currentPositions.find(p => p.id === id);
    
    if (positionToRemove) {
      // First get the live position data with bid/ask prices
      // Use take(1) to ensure we only subscribe once and then complete
      this.getLivePositionById(id).pipe(take(1)).subscribe(livePosition => {
        if (livePosition) {
          // Send deselect message before removing
          this.payoffService.deselectContract(livePosition, livePosition.action);
        }
        
        // Remove from selected positions
        const updatedPositions = currentPositions.filter(position => position.id !== id);
        this.selectedPositions.next(updatedPositions);
      });
    }
  }

  clearPositions(): void {
    const currentPositions = this.selectedPositions.getValue();
    
    if (currentPositions.length === 0) {
      return; // Nothing to clear
    }
    
    // Get all live positions with bid/ask data
    // Use take(1) to ensure we only subscribe once and then complete
    this.getLivePositions().pipe(take(1)).subscribe(livePositions => {
      // Send deselect messages for all positions through payoff service
      this.payoffService.clearAllContracts(livePositions);
      
      // Clear all positions locally
      this.selectedPositions.next([]);
    });
  }
  
  /**
   * Gets a single live position by ID, combining the selection with real-time data
   * @param id The position ID to find
   * @returns An observable that emits the live position or undefined if not found
   */
  private getLivePositionById(id: string): Observable<LivePosition | undefined> {
    return this.getLivePositions().pipe(
      map(positions => positions.find(position => position.id === id))
    );
  }
}