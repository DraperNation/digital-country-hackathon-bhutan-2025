import {
  Component,
  OnInit,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PayoffWebsocketService } from '../../services/payoff-websocket.service';
import { Subscription } from 'rxjs';
import {
  ApexChart,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexStroke,
  ApexDataLabels,
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  title: ApexTitleSubtitle;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  annotations: ApexAnnotations;
};

@Component({
  selector: 'app-straddle-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './straddle-chart.component.html',
  styleUrls: ['./straddle-chart.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StraddleChartComponent implements OnInit, OnDestroy {
  public chartOptions: ChartOptions;
  private subscriptions: Subscription[] = [];

  constructor(
    private payoffService: PayoffWebsocketService,
    private cdr: ChangeDetectorRef
  ) {
    this.chartOptions = {
      series: [{ name: 'Payoff', data: [] }],
      chart: { type: 'line', height: 350 },
      xaxis: { title: { text: 'Underlying Price' } },
      yaxis: { title: { text: 'PnL' } },
      title: { text: 'Options Payoff Chart', align: 'left' },
      stroke: { curve: 'smooth' },
      dataLabels: { enabled: false },
      annotations: {
        yaxis: [
          {
            y: 0,
            strokeDashArray: 0,
            borderColor: '#775DD0',
            label: {
              borderColor: '#775DD0',
              style: { color: '#fff', background: '#775DD0' },
              text: 'Break Even',
            },
          },
        ],
      },
    };
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.payoffService.payoffData$.subscribe((data) => {
        const points = data.x.map((xVal, i) => ({ x: xVal, y: data.y[i] }));
        this.chartOptions.series = [{ name: 'Payoff', data: points }];
        this.cdr.detectChanges();
      })
    );

    this.refreshData(); // Fetch once on load
  }

  refreshData(): void {
    this.payoffService.refreshPayoffData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
