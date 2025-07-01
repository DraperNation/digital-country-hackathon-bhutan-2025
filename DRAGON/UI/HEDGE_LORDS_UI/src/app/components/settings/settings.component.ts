import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { KeyValuePipe } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SettingsService } from '../../services/settings.service';
import { HttpClient } from '@angular/common/http';
import { PayoffWebsocketService } from '../../services/payoff-websocket.service';
import { AnalysisService } from '../../services/analysis.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    FormsModule,
    KeyValuePipe,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [provideNativeDateAdapter()],
})
export class SettingsComponent implements OnInit {
  exchanges: { [exchangeName: string]: string[] } = {
    Binance: [
      'SOLUSDT',
      'BTCUSDT',
      'ETHUSDT',
      'BNBUSDT',
      'XRPUSDT',
      'DOGEUSDT',
    ],
    'Delta Exchange': ['BTCUSD', 'ETHUSD'],
  };
  availableCoins: string[] = ['BTCUSD', 'ETHUSD'];

  selectedExchange: string = 'Delta Exchange';
  selectedCoin: string = 'BTCUSD';
  selectedExpiryDate: Date | null = new Date();
  selectedLotSize: number = 0.0001;

  constructor(
    private settingsService: SettingsService,
    private http: HttpClient,
    private payoffService: PayoffWebsocketService,
    private analysisService: AnalysisService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.settingsService.selectedExchange.subscribe((exchange) => {
      this.selectedExchange = exchange;
      this.availableCoins = this.exchanges[this.selectedExchange] || []; // Handle undefined
    });

    this.settingsService.selectedCoin.subscribe((coin) => {
      this.selectedCoin = coin;
    });

    this.settingsService.selectedExpiryDate.subscribe((date) => {
      this.selectedExpiryDate = date;
    });

    this.settingsService.selectedLotSize.subscribe((lotSize) => {
      this.selectedLotSize = lotSize;
    });
  }

  onExchangeChange() {
    this.availableCoins = this.exchanges[this.selectedExchange];
    this.settingsService.setSelectedExchange(this.selectedExchange);
  }

  onCoinChange() {
    this.settingsService.setSelectedCoin(this.selectedCoin);
  }

  onExpiryDateChange(event: any) {
    // Update both the local property and the service
    const newDate = event.value;
    this.selectedExpiryDate = newDate;
    this.settingsService.setSelectedExpiryDate(newDate);
    console.log('Date changed to:', newDate);

    // Force Angular change detection
    setTimeout(() => {
      console.log('Current date after change:', this.selectedExpiryDate);
    }, 0);
  }

  onLotSizeChange() {
    this.settingsService.setSelectedLotSize(this.selectedLotSize);
  }

  /**
   * Update lot size on the server when the user clicks the button
   */
  updateLotSize() {
    // Update local settings first
    this.settingsService.setSelectedLotSize(this.selectedLotSize);

    // Then send to backend
    this.analysisService.updateLotSize(this.selectedLotSize).subscribe({
      next: (response) => {
        console.log('Lot size updated successfully:', response);
        this.showNotification('Lot size updated successfully');

        // Refresh payoff data to reflect the new lot size
        this.payoffService.refreshPayoffData();
      },
      error: (error) => {
        console.error('Error updating lot size:', error);
        this.showNotification('Error updating lot size', true);
      },
    });
  }

  /**
   * Clear the current scenario after confirmation
   */
  clearScenario() {
    // Use the browser's built-in confirm dialog
    if (
      confirm(
        'Are you sure you want to clear the current scenario? This action cannot be undone.'
      )
    ) {
      // User confirmed the action
      this.analysisService.clearScenario().subscribe({
        next: (response) => {
          console.log('Scenario cleared successfully:', response);
          this.showNotification('Scenario cleared successfully');
        },
        error: (error) => {
          console.error('Error clearing scenario:', error);
          this.showNotification('Error clearing scenario', true);
        },
      });
    }
  }

  /**
   * Run the Monte Carlo simulation
   */
  runSimulation() {
    // Format date as yyyy-mm-dd in local time, not UTC
    const coin = this.selectedCoin;
    let expiryDate = '';
    if (this.selectedExpiryDate) {
      const year = this.selectedExpiryDate.getFullYear();
      const month = String(this.selectedExpiryDate.getMonth() + 1).padStart(
        2,
        '0'
      );
      const day = String(this.selectedExpiryDate.getDate()).padStart(2, '0');
      expiryDate = `${year}-${month}-${day}`;
    }

    this.analysisService.runSimulation(coin, expiryDate, '1h', 1000).subscribe({
      next: (response) => {
        console.log('Simulation completed successfully:', response);
        this.showNotification('Simulation completed successfully');
      },
      error: (error) => {
        console.error('Error running simulation:', error);
        this.showNotification('Error running simulation', true);
      },
    });
  }

  /**
   * Display notification to the user
   */
  private showNotification(message: string, isError: boolean = false) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: isError ? ['error-snackbar'] : ['success-snackbar'],
    });
  }

  onSubscribe() {
    this.settingsService.selectedExpiryDate
      .subscribe((date) => {
        this.selectedExpiryDate = date;

        // Format the date correctly accounting for timezone
        let formattedDate = '';
        if (this.selectedExpiryDate) {
          // Get local date components
          const year = this.selectedExpiryDate.getFullYear();
          const month = String(this.selectedExpiryDate.getMonth() + 1).padStart(
            2,
            '0'
          ); // Months are 0-indexed
          const day = String(this.selectedExpiryDate.getDate()).padStart(
            2,
            '0'
          );

          formattedDate = `${year}-${month}-${day}`;
        }

        const body = {
          symbol: this.selectedCoin,
          expiry_date: formattedDate,
        };

        console.log('Current date in component:', this.selectedExpiryDate);
        console.log('Formatted date for API:', formattedDate);
        console.log('Request body:', body);

        this.http
          .post('http://localhost:8000/producer/subscribe', body)
          .subscribe({
            next: (response) => {
              console.log('Subscription successful:', response);
              this.showNotification('Subscription successful');
            },
            error: (error) => {
              console.error('Subscription error:', error);
              this.showNotification('Subscription error', true);
            },
          });
      })
      .unsubscribe();
  }
}
