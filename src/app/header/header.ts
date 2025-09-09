import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { AuthService } from '../services/auth-service';
import { SignupResponse } from '../models/signup-response';
import { SignupRequest } from '../models/signup-request';
import { Router } from '@angular/router';
import { H } from '@angular/cdk/keycodes';
import { Loader } from '../shared/loader/loader';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {

  selectedImage: File | null = null;

  // UI state
  isScrolled = false;
  isSearchOpen = false;
  isAccountOpen = false;
  isSuccess: boolean | null = null;
  isLoading = false;

  authMessage: string = '';

  accountPage: 'account-home' | 'login' | 'signup' = 'account-home';
  pageHistory: ('account-home' | 'login' | 'signup')[] = [];


  links = [
    { label: 'Link 1', url: '#' },
    { label: 'Link 2', url: '#' },
    { label: 'Link 3', url: '#' },
    { label: 'Link 4', url: '#' },
    { label: 'Link 5', url: '#' },
    { label: 'Link 6', url: '#' },
    { label: 'Link 7', url: '#' },
    { label: 'Link 8', url: '#' },
    { label: 'Link 9', url: '#' },
    { label: 'Link 10', url: '#' },
    { label: 'Link 11', url: '#' },
    { label: 'Link 12', url: '#' }
  ];


  // Scroll detection
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  // Toggle account dropdown
  toggleAccountMenu(event?: Event) {
    event?.stopPropagation();
    this.isAccountOpen = !this.isAccountOpen;
    if (this.isAccountOpen) {
      this.accountPage = 'account-home';
      this.pageHistory = [];
    } else {
      this.pageHistory = [];
    }
  }

  // Toggle search dropdown
  toggleSearchMenu(event?: Event) {
    event?.stopPropagation();
    this.isSearchOpen = !this.isSearchOpen;
    if (this.isSearchOpen) this.isAccountOpen = false;
  }

  // Navigate inside account dropdown
  goToPage(page: 'account-home' | 'login' | 'signup', event?: Event) {
    event?.stopPropagation();
    event?.preventDefault();
    if (this.accountPage !== page) {
      this.pageHistory.push(this.accountPage);
      this.accountPage = page;
    }
  }

  // Navigate back
  goBack(event?: Event) {
    event?.stopPropagation();
    event?.preventDefault();
    if (this.pageHistory.length > 0) {
      this.accountPage = this.pageHistory.pop()!;
    } else {
      this.accountPage = 'account-home';
    }
  }

  // Close dropdowns when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (
      !target.closest('.nav-item') &&
      !target.closest('.mega-menu') &&
      !target.closest('.dropdown-menu')
    ) {
      this.isSearchOpen = false;
      this.isAccountOpen = false;
    }
  }
    constructor(private authService: AuthService,
               private router: Router

    ) {}

  // ==========================
  // FORMS
  // ==========================

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)])
  });

  signupForm: FormGroup = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    confirmPassword: new FormControl('', Validators.required)
  });

  // ==========================
  // AUTH LOGIC
  // ==========================

onLogin() {
  this.isLoading = true;
  this.authMessage = '';
  const request = this.loginForm.value;

  this.authService.doLogin(request).subscribe({
    next: (res: any) => {
      this.isSuccess = true;

      // Save token and user info
      if (res.token) localStorage.setItem('authToken', res.token);
      if (res.user) localStorage.setItem('user', JSON.stringify(res.user));
      else localStorage.setItem('user', JSON.stringify({ email: this.loginForm.value.email }));

      // Simulate loader for 3 seconds
      setTimeout(() => {
        this.isLoading = false;
        this.authMessage = 'Login successful!';

        // Close dropdown and redirect to root
        this.isAccountOpen = false;
        this.router.navigate(['/']);
      }, 3000);
    },
    error: (err) => {
      console.error('Login error:', err);
      this.isSuccess = false;

      setTimeout(() => {
        this.isLoading = false;
        this.authMessage = 'Login failed. Please check your credentials.';
        setTimeout(() => {
          this.authMessage = '';
          this.isSuccess = null;
        }, 3000);
      }, 3000);
    }
  });
}



get isLoggedIn(): boolean {
  return !!localStorage.getItem('authToken');
}

get userName(): string {
  const user = localStorage.getItem('user');
  if (user) {
    const u = JSON.parse(user);
    return u.firstname ? u.firstname : u.email; // show first name
  }
  return 'Account';
}



logout() {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
  this.authMessage = 'You have logged out successfully';
  this.accountPage = 'account-home'; // reset dropdown
  this.router.navigate(['/']);       // redirect to home
}


  onSignup() {
  if (this.signupForm.invalid) {
    this.authMessage = 'Please fill in all required fields';
    return;
  }

  if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
    this.authMessage = 'Passwords do not match';
    return;
  }

  // Build request object matching backend DTO
  const request: SignupRequest = {
    firstname: this.signupForm.value.firstName,       
    lastname: this.signupForm.value.lastName,         // map to backend field
    email: this.signupForm.value.email,
    password: this.signupForm.value.password,
    confirmPassword: this.signupForm.value.confirmPassword, // required
    profileImage: this.selectedImage ? this.selectedImage.name : '' // optional
  };

  this.authService.doSignup(request, this.selectedImage!).subscribe({
    next: (res) => {
      this.authMessage = 'Signup successful!';
      console.log('Signup Response:', res);
    },
    error: (err) => {
      this.authMessage = 'Signup failed. Please try again.';
      console.error('Signup error:', err);
    }
  });
}
onImageSelected(event: Event) {
  const fileInput = event.target as HTMLInputElement;
  if (fileInput.files && fileInput.files.length > 0) {
    this.selectedImage = fileInput.files[0];
  }
}
}

