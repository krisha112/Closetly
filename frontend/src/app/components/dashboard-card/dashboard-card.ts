import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './dashboard-card.html',
  styleUrl: './dashboard-card.scss'
})
export class DashboardCardComponent {

  @Input() title: string = '';

  @Input() value: number = 0;

  @Input() icon: string = '';

  @Input() color: string = '#72583E';

}