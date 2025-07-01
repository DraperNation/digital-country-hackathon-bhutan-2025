import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighchartsChartModule } from 'highcharts-angular';
import * as Highcharts from 'highcharts';
import { OptionsDataService } from '../../services/options-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-price-chart',
  standalone: true,
  imports: [CommonModule, HighchartsChartModule],
  template: `
    <div class="chart-container">
      <highcharts-chart 
        [Highcharts]="Highcharts"
        [options]="chartOptions"
        [callbackFunction]="chartCallback"
        [(update)]="updateFlag"
        [oneToOne]="true"
        style="width: 100%; height: 100%;"
      ></highcharts-chart>
    </div>
  `,
  styles: [`
    .chart-container {
      width: 100%;
      height: 100%;
    }
  `]
})
export class PriceChartComponent implements OnInit, OnDestroy {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  updateFlag = false;
  chart: Highcharts.Chart | null = null;
  
  private subscriptions: Subscription[] = [];
  private priceData: number[][] = [];
  
  constructor(private optionsDataService: OptionsDataService) {}
  
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.chart = chart;
  };
  
  ngOnInit(): void {
    // Initialize with some dummy data
    const currentTime = Date.now();
    
    for (let i = 0; i < 50; i++) {
      this.priceData.push([
        currentTime - (50 - i) * 15000,
        30000 + Math.random() * 2000
      ]);
    }
    
    this.initChart();
    
    // Subscribe to futures data for live updates
    this.subscriptions.push(
      this.optionsDataService.getFuturesData().subscribe(futuresData => {
        if (futuresData) {
          this.updateChart(futuresData);
        }
      })
    );
  }
  
  private initChart(): void {
    this.chartOptions = {
      chart: {
        type: 'line',
        animation: true,
        zooming: {
          type: 'x'
        },
        backgroundColor: '#ffffff',
        style: {
          fontFamily: 'Arial, sans-serif'
        }
      },
      time: {
        timezone: 'local'
      },
      title: {
        text: undefined
      },
      credits: {
        enabled: false
      },
      xAxis: {
        type: 'datetime',
        lineColor: '#ddd',
        tickColor: '#ddd',
        labels: {
          style: {
            color: '#333'
          }
        }
      },
      yAxis: {
        title: {
          text: 'Price'
        },
        gridLineColor: '#f0f0f0',
        labels: {
          style: {
            color: '#333'
          }
        }
      },
      legend: {
        enabled: false
      },
      tooltip: {
        headerFormat: '<b>{series.name}</b><br/>',
        pointFormat: '{point.x:%Y-%m-%d %H:%M:%S}<br/>{point.y:.2f}'
      },
      plotOptions: {
        line: {
          marker: {
            enabled: false
          }
        }
      },
      series: [{
        type: 'line',
        name: 'Price',
        color: '#2962FF',
        data: this.priceData
      }]
    };
  }
  
  private updateChart(futuresData: any): void {
    if (!this.chart || !futuresData) return;
    
    const series = this.chart.series[0];
    if (!series) return;
    
    // Add the new price point
    const price = futuresData.spot_price || futuresData.best_bid;
    const point = [Date.now(), price];
    
    series.addPoint(point, true, this.priceData.length >= 100);
    
    // Keep track of data for redraws
    this.priceData.push(point as number[]);
    if (this.priceData.length > 100) {
      this.priceData.shift();
    }
  }
  
  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}