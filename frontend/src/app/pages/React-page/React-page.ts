
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar';
import { NavbarComponent } from '../../components/navbar/navbar';

@Component({
  selector: 'app-react-page',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './react-page.html',
  styleUrl: './react-page.scss'
})
export class ReactPageComponent {
  reactUrl: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    const page = this.route.snapshot.data['reactPage'] as string;

    const url = `http://localhost:5173/?page=${page}&embed=true`;

    this.reactUrl =
      this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
