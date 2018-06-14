import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = 'Something error, go check your code';
  email = 'Something error, go check your code';

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit() {
      this.authService.getProfile().subscribe(profile => {
        // console.log('init di profile component ISI DARI profile');
        // console.log(profile);
        this.username = profile.user.username;
        this.email = profile.user.email;
      });
  }

}
