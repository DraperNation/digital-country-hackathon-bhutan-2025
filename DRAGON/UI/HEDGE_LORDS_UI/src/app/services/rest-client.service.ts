import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RestClientService {
  // Base URL for the exchange API.
  private baseUrl = 'https://api.india.delta.exchange';

  constructor(private http: HttpClient) {}

  public parseDateString(dateStr: string): Date {
    const day = parseInt(dateStr.substring(0, 2));
    const month = parseInt(dateStr.substring(2, 4)) - 1; // Months are 0-based
    const year = 2000 + parseInt(dateStr.substring(4, 6));
    return new Date(year, month, day);
  }

  private isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  public getOptionsContracts(): Observable<string[]> {
    const params = new HttpParams()
      .set('contract_types', 'call_options,put_options')
      .set('states', 'live');

    return this.http.get<any>(`${this.baseUrl}/v2/products`, { params }).pipe(
      map((response) => {
        if (response.success) {
          return response.result.map((product: any) => product.symbol);
        }
        console.error(
          'Error fetching options symbols:',
          response.error || 'Unknown error'
        );
        return [];
      }),
      catchError((error) => {
        console.error('Error fetching options symbols:', error);
        return of([]);
      })
    );
  }

  public getFilteredOptions(symbol: string, date: Date): Observable<string[]> {
    return this.getOptionsContracts().pipe(
      map((contracts) => {
        return contracts.filter((contract) => {
          const parts = contract.split('-');
          if (parts.length !== 4) return false;

          if (parts[1] !== symbol.substring(0, 3)) return false;

          // Convert date string to Date object
          const contractDate = this.parseDateString(parts[3]); // ddmmyy format
          return this.isSameDate(contractDate, date);
        });
      })
    );
  }
}
