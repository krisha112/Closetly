import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './charts.html',
  styleUrl: './charts.scss'
})
export class ChartsComponent {

  categoryData = [
    { name: 'Tops', value: 12 },
    { name: 'Bottoms', value: 8 },
    { name: 'Dresses', value: 6 },
    { name: 'Shoes', value: 10 },
    { name: 'Accessories', value: 7 }
  ];

  seasonData = [
    { name: 'Summer', value: 18 },
    { name: 'Winter', value: 10 },
    { name: 'Monsoon', value: 8 },
    { name: 'All Season', value: 7 }
  ];

}