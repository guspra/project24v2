import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
// import 'rxjs/operators';
// import { mapx } from 'rxjs/operators';
// import 'rxjs/operators/map';
import 'rxjs/add/operator/map';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { catchError } from 'rxjs/operators/map'
// import { map } from 'rxjs/operators/map';

@Injectable()
export class AuthService {

  domain = "http://172.104.161.63:2424"; // Development Domain - Not Needed in Production
  // domain = "http://localhost:2424";
  authToken;
  user;
  options;

  constructor(
    private http: Http,
    private jwtHelperService: JwtHelperService
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
  // console.log(localStorage);
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }

  // Function to get token from client local storage
  loadToken() {
    this.authToken = localStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
  }

  registerUser(user) {
    // console.log("masuk ke auth service registerUser");
    // console.log(user);
    return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
    // return this.http.post(this.domain + '/authentication/register', user);
  }
  // registerUser(user) {
  //   // return this.http.post(this.domain + '/authentication/register', user).pipe(map(res => res.json()));
  //   return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  // }

  checkUsername(username) {
    return this.http.get(this.domain + '/authentication/checkUsername/' + username).map(res => res.json());
  }

  checkEmail(email) {
    // console.log('cek double email di auth service');
    return this.http.get(this.domain + '/authentication/checkEmail/' + email).map(res => res.json());
  }

  login(user) {
      return this.http.post(this.domain + '/authentication/login', user).map(res => res.json());
  }

  logout() {
    this.authToken = null; // Set token to null
    this.user = null; // Set user to null
    localStorage.clear(); // Clear local storage
  }

  storeUserData(token, user) {
    localStorage.setItem('token', token); // Set token in local storage
    localStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
  }

  getProfile() {
    this.createAuthenticationHeaders(); // Create headers before sending to API
    // console.log('getprofile func. isi dari this.http.get dan this.option');
    // console.log(this.http.get(this.domain + 'authentication/profile', this.options));
    // console.log(this.options);
    return this.http.get(this.domain + '/authentication/profile', this.options).map(res => res.json());
  }

  loggedIn() {
    // console.log("isTokenexpired:"+this.jwtHelperService.isTokenExpired(this.authToken));
    // console.log(this.authToken);
    return !this.jwtHelperService.isTokenExpired(this.authToken);
    // const helper = new JwtHelperService();

    // const isExpired = helper.isTokenExpired(this.loadToken());
  }

  loggedOut(){
    return this.jwtHelperService.isTokenExpired(this.authToken);
  }
}
