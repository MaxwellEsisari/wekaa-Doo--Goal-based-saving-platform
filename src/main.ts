import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Merge HttpClientModule into your appConfig providers
bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),      // keep existing providers
    importProvidersFrom(HttpClientModule) // provide HttpClient globally
  ]
}).catch(err => console.error(err));
