import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,
    RouterLink
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ex15';
  accessToken = localStorage.getItem('access_token');
  router = inject(Router);

  ngOnInit() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'access_token') {
        console.log('access_token changed');
        this.router.navigate([this.router.url]);
      }
    });
  }
}
