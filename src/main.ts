import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthInterceptor } from './app/auth-interceptor';



// Merge HttpClientModule into your appConfig providers
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),      // keep existing providers
    importProvidersFrom(HttpClientModule), // provide HttpClient globally
    importProvidersFrom(FontAwesomeModule),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
}).catch(err => console.error(err));
