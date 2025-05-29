import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterOutlet, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'ex15';
  accessToken: string | null = null;
  router = inject(Router);
  private routerSubscription!: Subscription;

  ngOnInit() {
    this.updateAccessToken();

    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateAccessToken();
      });

    window.addEventListener('storage', (event) => {
      if (event.key === 'access_token') {
        console.log('access_token changed');
        this.updateAccessToken();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private updateAccessToken() {
    this.accessToken = localStorage.getItem('access_token');
  }
}