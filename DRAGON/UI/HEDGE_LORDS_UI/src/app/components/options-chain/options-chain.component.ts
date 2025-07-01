import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PositionService } from '../../services/position.service';
import { OptionsDataService } from '../../services/options-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-options-chain',
  imports: [CommonModule, MatTableModule, MatSortModule, MatTooltipModule, MatButtonModule, MatIconModule],
  templateUrl: './options-chain.component.html',
  styleUrl: './options-chain.component.scss',
  standalone: true
})
export class OptionsChainComponent implements OnInit, OnDestroy {
  public optionsData: any[] = [];
  public futuresData: any = null;
  private currentSymbol: string = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private positionService: PositionService,
    private optionsDataService: OptionsDataService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.optionsDataService.getOptionsData().subscribe(data => {
        this.optionsData = data;
      }),
      
      this.optionsDataService.getFuturesData().subscribe(data => {
        this.futuresData = data;
      }),
      
      this.optionsDataService.getCurrentSymbol().subscribe(symbol => {
        this.currentSymbol = symbol;
      })
    );
  }

  selectOption(option: any, type: 'call' | 'put'): void {
    if (!option) return;
    
    this.positionService.addPosition(
      type,
      option.strike_price,
      this.currentSymbol,
      option.expiry_date
    );
  }

  selectStrikePrice(option: any): void {
    if (option.call) {
      this.selectOption(option.call, 'call');
    } else if (option.put) {
      this.selectOption(option.put, 'put');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
