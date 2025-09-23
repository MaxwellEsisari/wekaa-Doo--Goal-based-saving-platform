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
  next: (res: any) => {
    console.log("📦 Full login response:", res);

    this.isSuccess = true;

    // ✅ Extract token from res.data.token
    const token = res?.data?.token;
    if (token) {
      this.authService.saveToken(token);
      console.log('✅ Token saved:', token);

      const role = this.authService.getRole();
      console.log('🎭 Role from token:', role);
    } else {
      console.warn("⚠️ No token found in response");
    }

    // Save user info
    const user = {
      id: res.user?.id || Date.now(),
      firstname: res.user?.firstname || this.loginForm.value.email.split('@')[0],
      email: this.loginForm.value.email
    };
    localStorage.setItem('user', JSON.stringify(user));

    setTimeout(() => {
      this.isLoading = false;
      this.authMessage = 'Login successful!';
      this.isAccountOpen = false;

      // ✅ Redirect based on role
      const role = this.authService.getRole();
      if (role === 'ROLE_ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else if (role === 'ROLE_USER') {
        this.router.navigate(['/user-dashboard']);
      } else {
        this.router.navigate(['/']); // fallback
      }
    }, 1000);
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
      }, 2000);
    }, 1000);
  }
});

}

get dashboardLink(): string {
  const role = this.authService.getRole();
  if (role === 'ROLE_ADMIN') {
    return '/admin-dashboard';
  } else if (role === 'ROLE_USER') {
    return '/user-dashboard';
  }
  return '/'; // fallback if no role
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
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
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

