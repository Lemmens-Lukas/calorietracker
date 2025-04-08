import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { user } from 'rxfire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent  implements OnInit {

  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      //username: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {}

  /*onSubmit() {
    const email = this.registerForm.get('email')?.value;
    const password = this.registerForm.get('password')?.value;

    this.authService.signup(email, password).then((res) => {
      if(res === "success"){
        this.router.navigate(['/log-in']);
      }else{
        alert(res);
      }
    })
  }*/

  async onSubmit() {
    if (this.registerForm.valid) {
      const { email, password } = this.registerForm.value;
      const result = await this.authService.signup(email, password);
  
      if (result === 'success') {
        console.log('User registered successfully!');
        //this.router.navigate(['/log-in']);
          // Optionally navigate to home or another route after successful registration
          // this.router.navigate(['/home']);
      } else {
        console.error('Error during registration:', result);
      }
    } else {
      console.log('Form is not valid');
    }
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

}
