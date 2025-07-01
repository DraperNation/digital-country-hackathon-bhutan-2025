import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { TradingComponent } from './components/trading/trading.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  imports: [SettingsComponent, TradingComponent, MatIconModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Hedge Lords UI';
  sidebarOpen = false;
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
