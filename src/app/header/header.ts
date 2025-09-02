import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { AuthService } from '../services/auth-service';
import { SignupResponse } from '../models/signup-response';
import { SignupRequest } from '../models/signup-request';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class Header {

  selectedImage: File | null = null;

  // UI state
  isScrolled = false;
  isSearchOpen = false;
  isAccountOpen = false;

  accountPage: 'account-home' | 'login' | 'signup' = 'account-home';
  pageHistory: ('account-home' | 'login' | 'signup')[] = [];

  // form fields
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  authMessage = '';

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

  constructor(private authService: AuthService) {}

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

  // Handle Login
  onLogin() {
  const request: LoginRequest = { email: this.email, password: this.password };

    this.authService.doLogin(request).subscribe({
      next: (response: LoginResponse) => {  // explicitly type response
        this.authMessage = response.message || 'Login successful!';
        console.log('Token:', response.token);
        // Reset login fields
        this.email = '';
        this.password = '';
      },
      error: (err: any) => {  // explicitly type err as any
        this.authMessage = err?.error?.message || 'Login failed. Try again.';
      }
    });
  }

onImageSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedImage = input.files[0];
  }
}
// Handle Signup
onSignup() {
  // Validate fields
  if (!this.firstName || !this.lastName || !this.email || !this.password || !this.confirmPassword) {
    this.authMessage = 'Please fill in all fields!';
    return;
  }

  if (this.password !== this.confirmPassword) {
    this.authMessage = 'Passwords do not match!';
    return;
  }

  // Prepare request with image field
  const request: SignupRequest = {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password,
    image: '' // you can set a default URL or keep it empty
  };

  // Call backend
  this.authService.doSignup(request).subscribe({
    next: (response: SignupResponse) => {
      this.authMessage = response.message || 'Signup successful!';
      console.log('Token:', response.token);

      // Reset form fields
      this.firstName = '';
      this.lastName = '';
      this.email = '';
      this.password = '';
      this.confirmPassword = '';
    },
    error: (err: any) => {
      this.authMessage = err?.error?.message || 'Signup failed. Try again.';
    }
  });
}

}
