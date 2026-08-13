import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-recent-activity',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './recent-activity.html',
  styleUrl: './recent-activity.scss'
})
export class RecentActivityComponent {

  activities = [
    {
      icon: 'checkroom',
      title: 'New clothing item added',
      description: 'White Linen Shirt was added to your wardrobe.',
      time: '10 minutes ago'
    },
    {
      icon: 'style',
      title: 'Outfit created',
      description: 'You created a new Casual Summer outfit.',
      time: '2 hours ago'
    },
    {
      icon: 'favorite',
      title: 'Outfit favorited',
      description: 'Weekend Chic was added to your favorites.',
      time: 'Yesterday'
    },
    {
      icon: 'favorite_border',
      title: 'Wishlist updated',
      description: 'A new fashion item was added to your wishlist.',
      time: '2 days ago'
    }
  ];

}