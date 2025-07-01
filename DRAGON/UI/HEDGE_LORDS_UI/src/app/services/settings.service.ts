import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  selectedExchange$ = new BehaviorSubject<string>('Delta Exchange');
  selectedCoin$ = new BehaviorSubject<string>('BTCUSD');
  selectedExpiryDate$ = new BehaviorSubject<Date | null>(new Date());
  selectedLotSize$ = new BehaviorSubject<number>(0.0001);

  constructor() {}

  //getters
  get selectedExchange(): Observable<string> {
    return this.selectedExchange$.asObservable(); // Return as Observable
  }

  get selectedCoin(): Observable<string> {
    return this.selectedCoin$.asObservable();
  }

  get selectedExpiryDate(): Observable<Date | null> {
    return this.selectedExpiryDate$.asObservable();
  }

  get selectedLotSize(): Observable<number> {
    return this.selectedLotSize$.asObservable();
  }

  //setters
  setSelectedExchange(exchange: string) {
    this.selectedExchange$.next(exchange);
  }

  setSelectedCoin(coin: string) {
    this.selectedCoin$.next(coin);
  }

  setSelectedExpiryDate(date: Date | null) {
    this.selectedExpiryDate$.next(date);
  }

  setSelectedLotSize(lotSize: number) {
    this.selectedLotSize$.next(lotSize);
  }
}
