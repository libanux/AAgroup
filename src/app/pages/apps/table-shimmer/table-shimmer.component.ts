import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-shimmer',
  templateUrl: './table-shimmer.component.html',
  styleUrl: './table-shimmer.component.scss'
})
export class TableShimmerComponent {
  @Input() ROWS_COUNT: number = 10; // Default to 10 rows
  @Input() headers: string[] = ['driverId', 'name', 'vehicle', 'currentLocation', 'Phone'];

  getRows(): number[] {
    return Array(this.ROWS_COUNT).fill(0).map((x, i) => i);
  }
}