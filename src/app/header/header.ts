import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { AuthService } from '../services/auth-service';
import { SignupResponse } from '../models/signup-response';
import { SignupRequest } from '../models/signup-request';
import { Router, RouterModule } from '@angular/router';
import { H } from '@angular/cdk/keycodes';
import { Loader } from '../shared/loader/loader';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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

  // FORMS

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

  // AUTH LOGIC

onLogin() {
  this.isLoading = true;
  this.authMessage = '';
  const request = this.loginForm.value;

  this.authService.doLogin(request).subscribe({
    next: (res: LoginResponse) => {
      const token = res?.data?.token;
      const role = res?.data?.role;

      if (!token || !role) {
        this.isLoading = false;
        this.authMessage = 'Login failed: missing token or role';
        return;
      }

      this.authService.saveToken(token);
      localStorage.setItem('role', role);

      this.isLoading = false;
      this.authMessage = 'Login successful!';
      this.isAccountOpen = false;

     if (role === 'ADMIN' || role === 'USER') {
        this.router.navigate(['/dashboard']);
      } else {
        this.router.navigate(['/']);
      }

    },
    error: (err) => {
      this.isLoading = false;
      this.authMessage = 'Login failed. Check credentials.';
      console.error('Login error:', err);
    }
  });
}





get dashboardLink(): string {
  return '/dashboard';
}


get role(): string | null {
  return this.authService.getRole();
}



get isLoggedIn(): boolean {
  const token = localStorage.getItem('authToken');
  const user = localStorage.getItem('user');
  return (!!token && token.trim() !== '') || !!user;
}


get userName(): string {
  const user = localStorage.getItem('user');
  if (user) {
    const u = JSON.parse(user);
    // Prefer firstname if available, else email
    return u.firstname || u.firstName || u.email || 'Account';
  }
  return 'Account';
}





logout() {
  this.authService.clearToken();   
  this.authMessage = 'You have logged out successfully';
  this.accountPage = 'account-home'; 
  this.router.navigate(['/']); 
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

  const request: SignupRequest = {
    firstname: this.signupForm.value.firstName,
    lastname: this.signupForm.value.lastName,
    email: this.signupForm.value.email,
    password: this.signupForm.value.password,
    confirmPassword: this.signupForm.value.confirmPassword,
    imageUrl: this.selectedImage ? this.selectedImage.name : ''
  };

  this.authService.doSignup(request, this.selectedImage!).subscribe({
    next: (res) => {
      this.authMessage = 'Signup successful!';
      console.log('Signup Response:', res);

      // Save new user immediately
      const user = {
        email: this.signupForm.value.email,
        firstname: this.signupForm.value.firstName
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.isAccountOpen = false;
      this.router.navigate(['/']);
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

