import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-items-found',
  templateUrl: './no-items-found.component.html',
  styleUrl: './no-items-found.component.scss'
})
export class NoItemsFoundComponent {

  @Input() Permission = false
}
