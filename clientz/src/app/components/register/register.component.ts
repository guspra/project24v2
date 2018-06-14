import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  // hahaha = 'jajaja';
  message;
  messageClass;
  emailValid;
  emailMessage;
  emailSuccess;
  usernameValid;
  usernameMessage;
  usernameSuccess;


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.createForm(); // Create Angular 2 Form when component loads
  }

  createForm(){
    this.form = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required, // Field is required
        this.validateEmail // Custom validation
      ])],
      password: ['', Validators.compose([
        Validators.required // Field is required
      ])],
      confirmPassword: ['', Validators.required],
      username: ['', Validators.compose([
        Validators.required, // Field is required
        Validators.minLength(3), // Minimum length is 3 characters
        Validators.maxLength(15), // Maximum length is 15 characters
        this.validateUsername // Custom validation
      ])],
      gender: 'Choose Gender',
      age: ['', Validators.compose([
        Validators.required,
        this.validateAge
      ])]
    }, { validator: this.validateConfirmPassword('password', 'confirmPassword') })
  }

  // Function to validate e-mail is proper format
  validateEmail(controls) {
  // Create a regular expression
  const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  // Test email against regular expression
  if (regExp.test(controls.value)) {
  return null; // Return as valid email
} else {
return { 'validateEmail': true } // Return as invalid email
}
}

// Function to validate username is proper format
validateUsername(controls) {
// Create a regular expression
const regExp = new RegExp(/^[a-zA-Z][a-zA-Z0-9_-]+$/);
// Test username against regular expression
if (regExp.test(controls.value)) {
return null; // Return as valid username
} else {
return { 'validateUsername': true } // Return as invalid username
}
}

// Funciton to ensure passwords match
validateConfirmPassword(password, confirmPassword) {
return (group: FormGroup) => {
  // Check if both fields are the same
  if (group.controls[password].value === group.controls[confirmPassword].value) {
  return null; // Return as a match
} else {
return { 'validateConfirmPassword': true } // Return as error: do not match
}
}
}

validateAge(controls) {
  // Create a regular expression
  const regExp = new RegExp(/^[0-9]+$/);
  // Test username against regular expression
  let age = controls.value;
  if (regExp.test(controls.value) && age >= 10 && age <= 100) {
    return null; // Return as valid username
  } else {

  return { 'validateAge': true } // Return as invalid username
}
}

checkEmail() {
  console.log('cek double email di register component');
  // Function from authentication file to check if e-mail is taken
  // console.log('emailnya adalah:' + this.form.get('email').value.length+ "xx");
  if(this.form.get('email').value.length > 4)
  this.authService.checkEmail(this.form.get('email').value).subscribe(data => {
    // Check if success true or false was returned from API
    console.log(data.message);
    this.emailSuccess = data.success;
    if (!data.success) {
      this.emailValid = false; // Return email as invalid
      this.emailMessage = data.message; // Return error message
    } else {
    this.emailValid = true; // Return email as valid
    this.emailMessage = data.message; // Return success message
  }
});
}

checkUsername() {
  console.log('cek double username di register component');
  // Function from authentication file to check if e-mail is taken
  // console.log('usernamenya adalah:' + this.form.get('username').value.length+ "xx");
  if(this.form.get('username').value.length > 2)
  this.authService.checkUsername(this.form.get('username').value).subscribe(data => {
    // Check if success true or false was returned from API
    console.log(data.message);
    this.usernameSuccess = data.success;
    if (!data.success) {
      this.usernameValid = false; // Return username as invalid
      this.usernameMessage = data.message; // Return error message
    } else {
    this.usernameValid = true; // Return username as valid
    this.usernameMessage = data.message; // Return success message
  }
});
}

disableForm() {
  this.form.controls['email'].disable();
  this.form.controls['username'].disable();
  this.form.controls['password'].disable();
  this.form.controls['confirmPassword'].disable();
  this.form.controls['age'].disable();
  this.form.controls['gender'].disable();
}

enableForm() {
  this.form.controls['email'].enable();
  this.form.controls['username'].enable();
  this.form.controls['password'].enable();
  this.form.controls['confirmPassword'].enable();
  this.form.controls['age'].enable();
  this.form.controls['gender'].enable();
}

// Function to submit form
onRegisterSubmit() {
console.log('masuk ke onRegisterSubmit');
console.log(this.form);
const user = {
  email: this.form.get('email').value,
  username: this.form.get('username').value,
  password: this.form.get('password').value

  // ,
  // gender: this.form.get('gender').value,
  // age: this.form.get('age').value
}


this.authService.registerUser(user).subscribe(data => {
  console.log('xxxxxx');
  console.log(data);
  console.log('xxxxx');
  if (!data.success) {
    this.messageClass = 'alert alert-danger'; // Set an error class
    this.message = data.message; // Set an error message
    this.enableForm();
    // this.processing = false; // Re-enable submit button
    // this.enableForm(); // Re-enable form
  } else {
  this.messageClass = 'alert alert-success'; // Set a success class
  this.message = data.message; // Set a success message
  this.disableForm();
  // After 2 second timeout, navigate to the login page
  setTimeout(() => {
  this.router.navigate(['/login']); // Redirect to login view
}, 2000);
}
// console.log('data dimasukkan ke mongodb');
// console.log(user);
// console.log(data);
// setTimeout(() => {
//   this.router.navigate(['/login']); // Redirect to login view
// }, 2000);

});
}


ngOnInit() {
}

}
