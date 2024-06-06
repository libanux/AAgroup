import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';

import { FeatherModule } from 'angular-feather';

interface topcards {
  id: number;
  color: string;
  icon: string;
  title: string;
  percent: string;
  status: string;
  subtitle: string;
}

@Component({
  selector: 'app-top-cards',
  standalone: true,
  imports: [MaterialModule, FeatherModule],
  templateUrl: './top-cards.component.html',
})
export class AppTopCardsComponent {
  topcards: topcards[] = [
    {
      id: 1,
      color: "accent",
      icon: "users",
      title: "39,354",
      percent: "-9",
      status: "error",
      subtitle: "Customers"
    },
    {
      id: 2,
      color: "warning",
      icon: "package",
      title: "4,396",
      percent: "+23",
      status: "success",
      subtitle: "Products"
    },
    {
      id: 3,
      color: "error",
      icon: "bar-chart",
      title: "423,39",
      percent: "+38",
      status: "success",
      subtitle: "Sales"
    },
    {
      id: 4,
      color: "success",
      icon: "refresh-cw",
      title: "835",
      percent: "-12",
      status: "error",
      subtitle: "Refunds"
    },
  ]
}
