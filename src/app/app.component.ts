import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent implements OnInit {
  // BehaviorSubject to track whether the app is still checking user state
  private isUserChecking = new BehaviorSubject<boolean>(true);

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Subscribe to the user observable to track the user state
    this.authService.user$.subscribe((user) => {
      console.log('Checking user state...'); // Debugging log

      if (user) {
        console.log('User is logged in:', user);
        this.isUserChecking.next(false); // Set checking to false once user state is determined
        this.router.navigate(['home']); // Redirect to home page if user is logged in
      } else {
        console.log('User is not logged in');
        this.isUserChecking.next(false); // Set checking to false once user state is determined
        this.router.navigate(['log-in']); // Redirect to login page if user is not logged in
      }
    });
  }

  get isChecking() {
    return this.isUserChecking.asObservable();
  }
}

/*export class AppComponent {
  private isUserChecking = true; // Flag to indicate checking state

  constructor(private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe((user) => {
      console.log('Checking user state...'); // Debugging log

      if (user) {
        console.log('User is logged in:', user);
        this.isUserChecking = false; // Set checking to false
        this.router.navigate(['home']); // Redirect to home if user is logged in
      } else {
        console.log('User is not logged in');
        if (!this.isUserChecking) {
          this.router.navigate(['log-in']); // Redirect only after checking
        }
      }
    });
  }
}*/
