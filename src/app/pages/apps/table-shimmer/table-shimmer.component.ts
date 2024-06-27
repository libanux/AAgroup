import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-table-shimmer',
  templateUrl: './table-shimmer.component.html',
  styleUrl: './table-shimmer.component.scss'
})
export class TableShimmerComponent {
  @Input() ROWS_COUNT: any[] = ['1', '2','3', '4', '5','6','7', '8','9', '10'];
  @Input () headers = ['driverId', 'name','vehicle', 'currentLocation', 'Phone'];
}
