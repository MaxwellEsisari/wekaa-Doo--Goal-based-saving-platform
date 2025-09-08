import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { AuthService } from '../services/auth-service';
import { SignupResponse } from '../models/signup-response';
import { SignupRequest } from '../models/signup-request';
import { H } from '@angular/cdk/keycodes';

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
    constructor(private authService: AuthService) {}

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
  if (this.loginForm.invalid) {
    this.authMessage = 'Please enter valid login details';
    return;
  }

  const request: LoginRequest = {
    email: this.loginForm.value.email,
    password: this.loginForm.value.password
  };

  this.authService.doLogin(request).subscribe({
    next: (res) => {
      this.authMessage = 'Login successful!';
      console.log('Login Response:', res);

      if ((res as any).token) {
        localStorage.setItem('authToken', (res as any).token);
      }
    },
    error: (err) => {
      console.error('Login error:', err);

      if (err.status === 0) {
        // Server unreachable (CORS, wrong port, backend down, etc.)
        this.authMessage = 'Connection error: Unable to reach the server.';
      } else if (err.status === 404) {
        this.authMessage = 'Error 404: Endpoint not found. Please check API URL.';
      } else if (err.status === 401) {
        this.authMessage = 'Error 401: Unauthorized. Please check your email or password.';
      } else if (err.status === 500) {
        this.authMessage = 'Error 500: Internal server error. Something went wrong on the server.';
      } else {
        // Generic fallback for unexpected errors
        this.authMessage = `Unexpected error (${err.status}): ${err.message || 'Unknown issue'}`;
      }
    }
  });
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
    firstname: this.signupForm.value.firstName,       // 👈 map to backend field
    lastname: this.signupForm.value.lastName,         // 👈 map to backend field
    email: this.signupForm.value.email,
    password: this.signupForm.value.password,
    confirmPassword: this.signupForm.value.confirmPassword, // 👈 required
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

