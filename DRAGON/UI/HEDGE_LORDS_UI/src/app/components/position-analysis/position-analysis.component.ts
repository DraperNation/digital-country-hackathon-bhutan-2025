import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { PositionService, LivePosition } from '../../services/position.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-position-analysis',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, FormsModule],
  templateUrl: './position-analysis.component.html',
  styleUrls: ['./position-analysis.component.scss'],
})
export class PositionAnalysisComponent implements OnInit, OnDestroy {
  livePositions: LivePosition[] = [];
  private subscriptions: Subscription[] = [];
  Date = Date; // Used for formatting timestamps in the template
  lastUpdateTime: string = 'Never'; // Tracks the last time positions were updated

  constructor(
    private positionService: PositionService
  ) {}

  ngOnInit(): void {
    // Subscribe to live position updates and refresh the displayed data
    this.subscriptions.push(
      this.positionService.getLivePositions().subscribe(
        (positions) => {
          this.livePositions = positions;
          this.updateTimestamp();
        },
        (error) => {
          this.lastUpdateTime = `Error: ${error.message}`;
        }
      )
    );
  }

  /**
   * Updates the timestamp with the current time.
   */
  updateTimestamp(): void {
    const now = new Date();
    this.lastUpdateTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
  }

  /**
   * Handles the action change for a specific position (buy/sell).
   * Updates the position action in the service.
   *
   * @param position - The position being updated.
   * @param action - The selected action ('buy' or 'sell').
   */
  onActionChange(position: LivePosition, action: 'buy' | 'sell'): void {
    // PositionService will handle the API calls
    this.positionService.updatePositionAction(position.id, action);
  }

  /**
   * Removes a position by ID.
   *
   * @param position - The position to remove.
   */
  removePosition(position: LivePosition): void {
    // PositionService will handle the API calls
    this.positionService.removePosition(position.id);
  }

  /**
   * Clears all positions.
   */
  clearAll(): void {
    // PositionService will handle the API calls
    this.positionService.clearPositions();
  }

  /**
   * Unsubscribes from all subscriptions to prevent memory leaks.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
