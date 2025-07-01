import { Component, OnDestroy } from '@angular/core';
import { RestClientService } from '../../services/rest-client.service';
import { Subscription } from 'rxjs';
import { SettingsService } from '../../services/settings.service';
import { OptionsChainComponent } from '../options-chain/options-chain.component';
import { PositionAnalysisComponent } from '../position-analysis/position-analysis.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { StraddleChartComponent } from '../straddle-chart/straddle-chart.component';
import { PayoffWebsocketService } from '../../services/payoff-websocket.service';
import { MatIconModule } from '@angular/material/icon';
import { AnalysisService } from '../../services/analysis.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-trading',
  standalone: true,
  imports: [
    CommonModule,
    OptionsChainComponent,
    PositionAnalysisComponent,
    HighchartsChartModule,
    StraddleChartComponent,
    MatIconModule,
  ],
  templateUrl: './trading.component.html',
  styleUrl: './trading.component.scss',
  providers: [SettingsService, RestClientService],
})
export class TradingComponent implements OnDestroy {
  private subscriptions: Subscription = new Subscription();
  public simulationResult$;

  constructor(private analysisService: AnalysisService) {
    this.simulationResult$ = this.analysisService.getSimulationResults();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
